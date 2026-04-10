import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { MistralAIEmbeddings, ChatMistralAI } from '@langchain/mistralai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createRequire } from 'module';
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

    // 1. Retrieve the top 3 most relevant chunks based on user message
    const retriever = vectorStore.asRetriever(3);
    const relevantDocs = await retriever.invoke(message);
    const contextText = relevantDocs.map((doc) => doc.pageContent).join('\n\n');

    // 2. Format history into a readable string for the prompt
    // Assuming previousMessages holds objects { role: 'user' | 'ai', content: '...' }
    const formattedHistory = previousMessages
      .map((msg) => `${msg.role === 'user' ? 'Farmer' : 'Agri-AI'}: ${msg.content}`)
      .join('\n');

    const languageMap = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi"
    };

    const displayLanguage = languageMap[language] || "English";

    // 3. Define prompt template mapping to a farmer-friendly persona
    let strictLangCommand = "Reply ONLY in English. Do not use other languages.";
    let structure1 = "1. What is good";
    let structure2 = "2. What is problem";
    let structure3 = "3. What farmer should do";

    if (language === 'hi') {
      strictLangCommand = "महत्वपूर्ण: अपना पूरा जवाब केवल हिंदी (Hindi) में दें। अंग्रेजी का प्रयोग न करें।";
      structure1 = "1. क्या अच्छा है (What is good)";
      structure2 = "2. क्या समस्या है (What is problem)";
      structure3 = "3. किसान को क्या करना चाहिए (What farmer should do)";
    } else if (language === 'mr') {
      strictLangCommand = "महत्त्वाचे: तुमचे संपूर्ण उत्तर फक्त मराठीत (Marathi) द्या. इंग्रजी अजिबात वापरू नका.";
      structure1 = "1. काय चांगले आहे (What is good)";
      structure2 = "2. काय समस्या आहे (What is problem)";
      structure3 = "3. शेतकऱ्याने काय करावे (What farmer should do)";
    }

    const promptTemplate = PromptTemplate.fromTemplate(`
You are an AI assistant for farmers.

IMPORTANT LANGUAGE RULES:
${strictLangCommand}
- Output MUST be strictly in ${displayLanguage}.
- Use simple, conversational language suitable for a farmer.
- Keep answers short and clear.
- If the Context doesn't contain the answer, say "I couldn't find this information in the uploaded report." Do not hallucinate data.

Structure your advice explicitly as:
${structure1}
...
${structure2}
...
${structure3}
...

History:
{history}

Context:
{context}

Farmer: {question}
Agri-AI:`);

    // 4. Initialize LLM
    const llm = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      model: 'mistral-large-latest',
      temperature: 0.1, // Keep it deterministic
    });

    // 5. Chain and Invoke
    const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());

    const result = await chain.invoke({
      history: formattedHistory,
      context: contextText,
      question: message,
    });

    return result;
  } catch (error) {
    console.error('[RAG] Error generating response:', error);
    throw error;
  }
};
