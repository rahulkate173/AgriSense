import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { MistralAIEmbeddings, ChatMistralAI } from '@langchain/mistralai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createRequire } from 'module';
import { getLanguageSpecificPrompt, verifyLanguage, convertToFarmerUnits } from './ragUtils.js';
const require = createRequire(import.meta.url);
const _pdfParseModule = require('pdf-parse/lib/pdf-parse.js');
const pdfParse = _pdfParseModule.default || _pdfParseModule;

// Initialize Pinecone client
const pinecone = new Pinecone();

// Initialize Embeddings model (dimension defaults to 1024 for mistral-embed)
const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: 'mistral-embed',
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'agrisense-rag';
let _indexReady = false;

/**
 * Ensures the Pinecone index exists, creating it if necessary.
 * Mistral 'mistral-embed' outputs 1024-dimensional vectors.
 */
const ensureIndexExists = async () => {
  if (_indexReady) return;

  const existingIndexes = await pinecone.listIndexes();
  const names = (existingIndexes.indexes || []).map((idx) => idx.name);

  if (!names.includes(INDEX_NAME)) {
    console.log(`[RAG] Index "${INDEX_NAME}" not found. Creating it now...`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: 1024,          // mistral-embed output dimension
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: process.env.PINECONE_REGION || 'us-east-1',
        },
      },
      waitUntilReady: true,     // block until index is ready to accept upserts
    });
    console.log(`[RAG] ✅ Index "${INDEX_NAME}" created and ready.`);
  } else {
    console.log(`[RAG] Index "${INDEX_NAME}" already exists.`);
  }

  _indexReady = true;
};

/**
 * Extracts text from PDF buffer, splits into chunks, and stores in Pinecone.
 */
export const processAndStorePDF = async (buffer, userId, sessionId) => {
  try {
    // 0. Ensure Pinecone index exists (creates it on first run)
    await ensureIndexExists();

    // 1. Parse PDF buffer to text
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text || '';

    console.log(`[RAG] PDF parsed. Raw text length: ${rawText.length} chars`);

    // Strip control characters, preserve readable content
    const text = rawText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\r\n/g, '\n')
      .trim();

    if (!text || text.length < 20) {
      throw new Error(
        'PDF contains no readable text. It may be a scanned image-only PDF. ' +
        'Please upload a text-based PDF or use OCR first.'
      );
    }

    // 2. Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.createDocuments(
      [text],
      [{ userId, sessionId }]
    );

    console.log(`[RAG] Text split into ${docs.length} chunk(s).`);

    if (!docs || docs.length === 0) {
      throw new Error('PDF text could not be split into chunks. The document may be too short.');
    }

    // 3. Generate embeddings explicitly (avoids silent failures inside fromDocuments)
    const pageContents = docs.map((doc) => doc.pageContent);
    console.log(`[RAG] Generating embeddings for ${pageContents.length} chunks via Mistral...`);

    let vectors;
    try {
      vectors = await embeddings.embedDocuments(pageContents);
    } catch (embErr) {
      throw new Error(`Mistral embedding failed: ${embErr.message}`);
    }

    console.log(`[RAG] Received ${vectors.length} embedding vector(s).`);

    if (!vectors || vectors.length === 0) {
      throw new Error('Embedding model returned no vectors. Check your MISTRAL_API_KEY.');
    }

    // 4. Build Pinecone records
    //    'text' is the key PineconeStore.fromExistingIndex uses during retrieval
    const namespace = `${userId}_${sessionId}`;
    const records = docs.map((doc, i) => ({
      id: `${userId}_${sessionId}_chunk${i}_${Date.now()}`,
      values: vectors[i],
      metadata: {
        text: doc.pageContent,
        userId,
        sessionId,
      },
    }));

    // 5. Upsert to Pinecone in batches of 50
    const pineconeIndex = pinecone.Index(INDEX_NAME).namespace(namespace);
    const BATCH_SIZE = 50;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      console.log(`[RAG] Upserting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)} (${batch.length} records)...`);
      // Pinecone SDK v4+ requires { records: [...] } object, NOT a plain array
      await pineconeIndex.upsert({ records: batch });
    }

    console.log(`[RAG] ✅ Successfully stored ${docs.length} chunk(s) in namespace: ${namespace}`);
    return { success: true, chunksProcessed: docs.length };
  } catch (error) {
    console.error('[RAG] Error processing PDF:', error.message);
    throw error;
  }
};

/**
 * Retrieves context from Pinecone, formats prompt with chat history, and calls ChatMistralAI.
 * Enhanced to support multilingual output and farmer-friendly language.
 */
export const generateChatResponse = async (userId, sessionId, message, previousMessages = [], language = 'en') => {
  try {
    // Ensure index exists before querying
    await ensureIndexExists();

    const pineconeIndex = pinecone.Index(INDEX_NAME);
    const namespace = `${userId}_${sessionId}`;

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace,
      textKey: 'text', // matches the metadata key used during manual upsert
    });

    // 1. Retrieve the top 5 most relevant chunks for better context
    const retriever = vectorStore.asRetriever(5);
    const relevantDocs = await retriever.invoke(message);
    const contextText = relevantDocs.map((doc) => doc.pageContent).join('\n\n---\n\n');

    // 2. Format history into a readable string for the prompt
    const formattedHistory = previousMessages
      .map((msg) => `${msg.role === 'user' ? '👨‍🌾 Farmer' : '🤖 Agri-AI'}: ${msg.content}`)
      .join('\n\n');

    // 3. Get language-specific system prompt
    const systemPrompt = getLanguageSpecificPrompt(language);

    // 4. Create a comprehensive prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`${systemPrompt}

Previous Context (if any):
{history}

---

Soil Report Information:
{context}

---

Farmer's Question:
{question}

---

Now provide your detailed, farmer-friendly response. Remember:
- ONLY respond in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Marathi'}.
- All calculations must be done by you - no calculations for the farmer.
- Use the structured format provided above.
- Be helpful, clear, and encouraging.

Response:`);

    // 5. Initialize LLM with conservative settings for better language adherence
    const llm = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      model: 'mistral-large-latest',
      temperature: 0.1, // Low temperature for consistency
      maxTokens: 1500,  // Limit output length
    });

    // 6. Chain and Invoke
    const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());

    let result = await chain.invoke({
      history: formattedHistory || "No previous context",
      context: contextText || "No document context provided",
      question: message,
    });

    // 7. Verify language and convert if needed
    const { isCorrectLanguage, detectedLanguage, devanagariPercentage } = verifyLanguage(result, language);
    
    console.log(`[RAG] Language check - Target: ${language}, Detected: ${detectedLanguage}, Devanagari%: ${devanagariPercentage.toFixed(2)}`);

    if (!isCorrectLanguage && language !== 'en') {
      console.warn(`[RAG] Response not in ${language}. Detected ${detectedLanguage}. Attempting to regenerate...`);
      
      // If language is wrong, try again with a stronger language instruction
      const urgentPrompt = PromptTemplate.fromTemplate(`
CRITICAL: Your ENTIRE response MUST be in ${language === 'hi' ? 'HINDI' : 'MARATHI'} only. NO ENGLISH AT ALL.

${systemPrompt}

Farmer's Question:
{question}

Soil Report Context:
{context}

Respond NOW in ONLY ${language === 'hi' ? 'HINDI' : 'MARATHI'}:`);

      const urgentChain = urgentPrompt.pipe(llm).pipe(new StringOutputParser());
      result = await urgentChain.invoke({
        question: message,
        context: contextText || "No context",
      });

      console.log(`[RAG] Regenerated response in ${language}`);
    }

    // 8. Post-process to convert technical units
    result = convertToFarmerUnits(result, 'kg/ha', 1);

    return result;
  } catch (error) {
    console.error('[RAG] Error generating response:', error);
    throw error;
  }
};
