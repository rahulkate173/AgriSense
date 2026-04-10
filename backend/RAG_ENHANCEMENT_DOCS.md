# AgriSense RAG Enhancement Documentation

## Overview

The RAG (Retrieval-Augmented Generation) system has been enhanced to provide **multilingual, farmer-friendly agricultural guidance** in English, Hindi, and Marathi. All responses are simplified, actionable, and free from calculation burden.

## Key Features

### 1. **Multilingual Support (en, hi, mr)**
- Responses are generated **STRICTLY** in the selected language
- Native script support (Devanagari for Hindi/Marathi)
- Language verification to ensure accuracy
- Automatic regeneration if language mismatch detected

### 2. **Farmer-Friendly Language**
- Simple, everyday language (no technical jargon)
- Terms explained in practical context
- Micronutrient explanations with why/what/how structure
- Prioritization system (High/Medium/Low priority)

### 3. **Unit Conversion to Practical Farmer Units**
- **kg/ha** → **kg per acre** with bag count (20 kg bags)
- **ppm** → **ml per tank** (100L reference)
- Direct application instructions (e.g., "2 bags per acre" not "120 kg/ha")

### 4. **Structured Output Format**
Every response follows this consistent format:
```
📋 SOIL HEALTH SUMMARY
   1-2 sentence summary of soil condition

⚠️ PROBLEMS FOUND
   • 🔴 HIGH PRIORITY - Problem 1
   • 🟡 MEDIUM PRIORITY - Problem 2
   • 🟢 LOW PRIORITY - Problem 3

✅ WHAT YOU SHOULD DO
   Step 1: [Clear action]
   Step 2: [Clear action]
   Step 3: [Clear action]

🌾 FERTILIZER / PESTICIDE RECOMMENDATION
   • Fertilizer Name: [Practical amount]

💡 IMPORTANT TIPS
   • Tip 1: [Practical advice]
   • Tip 2: [Practical advice]
```

### 5. **Calculation Handling**
- All fertilizer/pesticide calculations done by AI
- Conversions from technical units handled automatically
- Farmer receives ready-to-use recommendations

## Architecture

### Backend Files

#### `src/services/RAG.js`
Core RAG service with enhanced `generateChatResponse()` function:
- Retrieves context from Pinecone vector store
- Uses language-specific system prompts
- Implements language verification
- Performs unit conversions
- Regenerates if language is incorrect

#### `src/services/ragUtils.js` (NEW)
Utility functions supporting the RAG system:
- `getLanguageSpecificPrompt(language)` - Returns language-specific system prompt
- `verifyLanguage(text, targetLanguage)` - Checks if response is in correct language
- `convertToFarmerUnits(recommendation, unit)` - Converts technical units to practical units
- `simplifyMicronutrient(nutrient, level, language)` - Explains nutrients simply
- `prioritizeIssue(issue, language)` - Assigns priority levels

#### `src/controllers/rag.controller.js`
Updated to handle language parameter:
- `uploadPDF()` - Accepts and passes language to RAG service
- `chat()` - Accepts language parameter in request body

#### `src/routes/rag.routes.js`
Routes already handle language parameter

### Frontend Integration

#### `src/store/chatSlice.js`
- `uploadPDF` thunk passes `language` parameter
- `sendMessage` thunk passes `language` parameter

#### `src/features/chat/pages/ChatUploadPage.jsx`
- Uses `i18n.language` from current i18n context
- Passes language with PDF upload

#### `src/features/chat/pages/ChatPage.jsx`
- Uses `i18n.language` from current i18n context
- Passes language with each message

#### `src/i18n.js`
- Already configured with en, hi, mr locales
- Language persisted in localStorage

## API Specifications

### POST /api/rag/uploadpdf
**Request Body:**
```json
{
  "file": "<PDF file>",
  "userId": "user_id",
  "sessionId": "session_id",
  "language": "en|hi|mr"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_id",
    "chunksProcessed": 5,
    "message": "PDF analyzed contextually successfully."
  }
}
```

### POST /api/rag/chat
**Request Body:**
```json
{
  "userId": "user_id",
  "sessionId": "session_id",
  "message": "Question about the report",
  "language": "en|hi|mr"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "📋 SOIL HEALTH SUMMARY\n..."
  }
}
```

## Language Specifications

### English (en)
- Default language
- Full technical support
- No restrictions

### Hindi (hi)
- Devanagari script (U+0900 to U+097F)
- Practical examples from Indian agriculture
- Concepts explained in Hindi context

### Marathi (mr)
- Devanagari script
- Regional agricultural context
- Marathi-specific farming practices

## System Prompts

Each language has a dedicated system prompt in `ragUtils.js` that includes:
1. Role definition (agricultural assistant)
2. Language enforcement instructions
3. Simplification rules
4. Unit conversion guidelines
5. Output format specifications
6. Tone and style guidance

### Key Prompt Rules
- No technical jargon
- All calculations pre-done
- Clear prioritization
- Step-by-step instructions
- Bullet points over paragraphs

## Language Verification

The system includes a language checker that:
1. Counts Devanagari characters for Hindi/Marathi detection
2. Calculates percentage of native script
3. Triggers regeneration if language mismatch (>20% threshold)
4. Logs language verification results

## Unit Conversion Examples

| Technical | Farmer-Friendly |
|---|---|
| 120 kg/ha | 49 kg/acre ≈ 2.5 bags (20 kg) |
| 2000 ppm | 20 ml per 100L tank |
| 60 mg/L Phosphorus | 3 bags of DAP per acre |
| 50 ppm Iron | 5 ml per tank |

## Example Flow

### Scenario: Hindi-Speaking Farmer with Nitrogen Deficiency

**Farmer Input (Hindi):**
```
नाइट्रोजन की कमी के बारे में बताएं
```

**AI Response (Auto-generated in Hindi):**
```
📋 मृदा स्वास्थ्य सारांश
आपकी मिट्टी में नाइट्रोजन की काफी कमी है। यह समस्या तुरंत हल करनी चाहिए।

⚠️ पाई गई समस्याएं
• 🔴 उच्च प्राथमिकता - नाइट्रोजन (N) की कमी

✅ आपको क्या करना चाहिए
कदम 1: इस हफ्ते 3 बैग यूरिया (46% N) प्रति एकड़ डालें
कदम 2: नमी वाली मिट्टी में डालें अगर हो सके
कदम 3: 2 सप्ताह बाद फिर से जांच करें

🌾 उर्वरक अनुशंसा
• यूरिया: 3 बैग (60 किग्रा) प्रति एकड़
• फसल: गेहूं

💡 महत्वपूर्ण सुझाव
• नाइट्रोजन पत्तियों को हरी रखती है
• बार-बार डालने से बेहतर है एक बार में ही डालें
```

## Error Handling

### Language Mismatch
1. System detects response not in target language
2. Logs warning with detected language
3. Automatically regenerates with stronger language instruction
4. Returns corrected response to user

### No Context Available
- System checks if Pinecone retrieval returns empty
- Returns: "I couldn't find this information in the uploaded report."
- Prevents hallucination

### PDF Processing Errors
- Text extraction fails → Error message to user
- Scanned PDFs detected → Suggests OCR
- Empty/invalid PDFs → Clear error message

## Testing Recommendations

### 1. Language Testing
- Upload same PDF, test with en/hi/mr
- Verify script output (Devanagari for hi/mr)
- Check no English in Hindi/Marathi responses

### 2. Unit Conversion Testing
- Test various ppm/kg/ha values
- Verify bag count calculations
- Check tank volume recommendations

### 3. Farmer-Friendly Testing
- Have actual farmers read responses
- Check if no calculations needed
- Verify priority labels are clear

### 4. Structure Testing
- Verify all responses follow format
- Check emoji rendering
- Verify bullet points render correctly

## Configuration

### Environment Variables
```
MISTRAL_API_KEY=your_mistral_key
PINECONE_INDEX_NAME=agrisense-rag
PINECONE_REGION=us-east-1
BACKEND_URL=http://localhost:3000 (frontend config)
```

### Model Settings
- **Model**: mistral-large-latest
- **Temperature**: 0.1 (low for consistency)
- **Max Tokens**: 1500 (limits output)

## Performance Considerations

### Optimization Done
1. Temperature set to 0.1 for consistency
2. Max tokens limited to prevent long outputs
3. Retriever limited to top 5 chunks (balanced)
4. Language verification prevents wasted regenerations if language already correct

### Future Improvements
1. Add caching layer for common questions
2. Implement streaming for faster feedback
3. Add confidence scores to recommendations
4. Implement fallback translations using Google Translate API

## Troubleshooting

### Issue: English mixed with Hindi
**Solution**: Language verification should catch this. If not:
1. Check Devanagari percentage calculation
2. Increase threshold for language mismatch
3. Review system prompt for clarity

### Issue: Calculations not simplified
**Solution**: Check if conversions are being applied:
1. Verify `convertToFarmerUnits()` is called
2. Check regex patterns match your units
3. Add more unit type conversions if needed

### Issue: Priority labels missing
**Solution**: Check if `prioritizeIssue()` is being used in prompt
1. Update system prompt to include priority labeling request
2. Test with sample issue text

## Support & Maintenance

For issues or improvements:
1. Check unit conversion regex patterns regularly
2. Update micronutrient definitions as needed
3. Monitor language verification logs
4. Collect farmer feedback for prompt refinement

## Summary of Changes

✅ **Created**: `src/services/ragUtils.js` - Utility functions
✅ **Updated**: `src/services/RAG.js` - Enhanced RAG service with multilingual support
✅ **Updated**: `src/controllers/rag.controller.js` - Language parameter handling (already done)
✅ **Updated**: `src/routes/rag.routes.js` - Language support (already configured)
✅ **Frontend**: ChatPage and ChatUploadPage already passing language

## Result

Farmers now receive:
- ✅ Responses in their preferred language
- ✅ Simple, everyday language (no jargon)
- ✅ Ready-to-use recommendations (no calculations)
- ✅ Clear priorities (know what to fix first)
- ✅ Structured, easy-to-read format
- ✅ Practical units (bags, per acre, per tank)
