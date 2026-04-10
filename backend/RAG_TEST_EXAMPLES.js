/**
 * RAG System Test Examples
 * Demonstrates multilingual, farmer-friendly responses
 */

// ============================================================================
// TEST 1: English - Nitrogen Deficiency Question
// ============================================================================

const testRequest1 = {
  method: 'POST',
  url: 'http://localhost:3000/api/rag/chat',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: {
    userId: 'farmer_001',
    sessionId: 'session_abc123',
    message: 'My soil test shows very low nitrogen. What should I do?',
    language: 'en'
  }
};

const expectedResponse1 = {
  success: true,
  data: {
    response: `📋 SOIL HEALTH SUMMARY
Your soil needs help with Nitrogen (N) right away. This is one of the most important nutrients for plant growth, and low levels will hurt your crop yield badly.

⚠️ PROBLEMS FOUND
• 🔴 HIGH PRIORITY - Nitrogen Deficiency: Your plants cannot make enough green color and will grow weak without this
• 🟢 LOW PRIORITY - Check phosphorus too: Sometimes when nitrogen is low, we need to check phosphorus as well

✅ WHAT YOU SHOULD DO
Step 1: Buy urea fertilizer (46% nitrogen) from your local shop this week
Step 2: Apply 3 bags of urea per acre of your field (that's 60 kg total)
Step 3: Water your field after applying the fertilizer - this helps it work better
Step 4: After 2-3 weeks, look at your plants - new leaves should be greener

🌾 FERTILIZER / PESTICIDE RECOMMENDATION
• Urea: 3 bags (20 kg each) per acre = 60 kg per acre
• Cost estimate: ₹1,200-1,500 per acre
• Alternative: You can also use 2 bags of Ammonium Nitrate per acre if you prefer

💡 IMPORTANT TIPS
• Nitrogen makes plants green and strong
• Don't wait - apply within 7 days for best results
• If it rains, wait 1 day after rain before applying
• Organic option: If you have cow manure, add 5 cartloads per acre and mix well with soil`
  }
};

// ============================================================================
// TEST 2: Hindi - Micronutrient Question
// ============================================================================

const testRequest2 = {
  method: 'POST',
  url: 'http://localhost:3000/api/rag/chat',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: {
    userId: 'farmer_002',
    sessionId: 'session_def456',
    message: 'मेरी मिट्टी में जिंक कम है। क्या करूं?',
    language: 'hi'
  }
};

const expectedResponse2 = {
  success: true,
  data: {
    response: `📋 मृदा स्वास्थ्य सारांश
आपकी मिट्टी में जिंक (Zn) की कमी है। यह पोषक तत्व आपकी फसल को मजबूत बनाता है। तुरंत इलाज करने से आपकी फसल सुरक्षित रहेगी।

⚠️ पाई गई समस्याएं
• 🔴 उच्च प्राथमिकता - जिंक की कमी: आपके पौधे लंबे नहीं बढ़ेंगे और उपज कम होगी
• 🟡 मध्यम प्राथमिकता - लोहा भी कम हो सकता है: जिंक के साथ लोहा भी चेक करें

✅ आपको क्या करना चाहिए
कदम 1: इस सप्ताह अपने स्थानीय खाद दुकान से जिंक सल्फेट (21% जिंक) खरीदें
कदम 2: प्रति एकड़ 5 किग्रा जिंक सल्फेट डालें
कदम 3: खाद को मिट्टी में अच्छी तरह मिलाएं
कदम 4: तुरंत सिंचाई करें ताकि यह मिट्टी में घुल जाए

🌾 उर्वरक अनुशंसा
• जिंक सल्फेट: 5 किग्रा प्रति एकड़
• कीमत: ₹800-1,000 प्रति एकड़
• वैकल्पिक: चेलेटेड जिंक (यदि बजट हो)

💡 महत्वपूर्ण सुझाव
• जिंक पौधों को लंबा बढ़ने में मदद करता है
• पहली बार न डालने से पहले नजदीकी कृषि अधिकारी से मिलें
• 15-20 दिन बाद अपनी फसल में सुधार दिखेगा
• जैव खाद के साथ भी जिंक देना अच्छा है`
  }
};

// ============================================================================
// TEST 3: Marathi - Pesticide Recommendation
// ============================================================================

const testRequest3 = {
  method: 'POST',
  url: 'http://localhost:3000/api/rag/chat',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: {
    userId: 'farmer_003',
    sessionId: 'session_ghi789',
    message: 'माझ्या शेतात येलो स्टॉप व्हायरस आछे. काय सुचवता?',
    language: 'mr'
  }
};

const expectedResponse3 = {
  success: true,
  data: {
    response: `📋 माती आरोग्य सारांश
तुमच्या शेतात येलो स्टॉप व्हायरस पेप्लान्ट्स मध्ये आहे. हा दोन सप्ताहात संपूर्ण शेतात पसरू शकतो. त्वरित कार्यवाही करावी लागेल.

⚠️ आढळलेल्या समस्या
• 🔴 उच्च प्राधान्य - येलो स्टॉप व्हायरस: संक्रमित वनस्पती पीवळ पडत आहेत आणि उपज दिवसेंदिवस कमी होत आहे
• 🔴 उच्च प्राधान्य - Aphid वाहक: Aphids हे व्हायरस पसरवत आहेत

✅ तुम्ही काय करावे
पायरी 1: येलो वाहलेल्या सर्व पौधा काढून टाका (तक्तेचे मध्य मध्ये असलेले)
पायरी 2: २-३ दिवसात Imidacloprid (Confidor) फवारा करा - १ लीटर प्रति एकर
पायरी 3: १०-१२ दिवसांनी पुन्हा फवारा करा
पायरी 4: आजूबाजूच्या शेतांतही Aphid नियंत्रणासाठी सुचना द्या

🌾 कीटकनाशक शिफारस
• Imidacloprid (Confidor): १ लीटर प्रति एकर (१०% concentration)
• मिस्टर: १०० लीटर पाणी
• दर: ₹३-४ प्रति लीटर = एकर प्रती ₹३-४ हजार
• साधन: फवारकाम सकाळी किंवा संध्याकाळी करा

💡 महत्त्वाच्या टिप्स
• यापुढे संक्रमणच पेप्लान्ट्स वापरू नका
• Yellow & Blue ट्रॅप्स लावा Aphid पकडण्यासाठी
• शेताच्या कडेला Neem झाडे लावा नैसर्गिक संरक्षणासाठी
• येणार्या हंगामात प्रतिरोधी जाती निवडा`
  }
};

// ============================================================================
// TEST 4: Unit Conversion Examples
// ============================================================================

/*
System converts these technical units to farmer-friendly units automatically:

NITROGEN:
  Technical: 120 kg/ha nitrogen needed
  Converted: Apply 49 kg per acre ≈ 2.5 bags of Urea (20kg bags)
  Farmer sees: "Add 2-3 bags of urea per acre"

PHOSPHORUS:
  Technical: 60 kg/ha phosphorus (P2O5)
  Converted: 24 kg per acre ≈ 1.2 bags SSP per acre
  Farmer sees: "Add 1 bag of SSP (Single Super Phosphate) per acre"

POTASSIUM:
  Technical: 40 kg/ha potassium (K2O)
  Converted: 16 kg per acre ≈ 0.8 bags MOP per acre
  Farmer sees: "Add 1 bag of MOP (Muriate of Potash) per acre"

MICRONUTRIENTS (ppm):
  Technical: 5000 ppm Iron (Fe) needed per hectare
  Converted: 50 ml per 100L tank of water
  Farmer sees: "Mix 50 ml iron in one tank of water (100L) and spray"

PESTICIDE:
  Technical: 0.6 kg/ha active ingredient
  Converted: 0.24 kg per acre ≈ 240 ml of 10% Solution per acre
  Farmer sees: "Add 240 ml pesticide solution per acre" or "Mix 1 cap per tank"
*/

// ============================================================================
// TEST 5: Priority System
// ============================================================================

const priorityExamples = {
  highPriority: [
    '🔴 Nitrogen deficiency - causes 30-40% yield loss',
    '🔴 Severe pest infestation - spreading rapidly',
    '🔴 Extreme pH imbalance (below 4 or above 8.5)',
    '🔴 Plant wilting and not recovering in soil moisture'
  ],
  mediumPriority: [
    '🟡 Moderate phosphorus deficiency - purple discoloration',
    '🟡 Occasional pest damage - not widespread',
    '🟡 Slight pH deviation (5.5-6.5 is optimal)',
    '🟡 Minor nutrient imbalance affecting growth'
  ],
  lowPriority: [
    '🟢 Trace micronutrient slightly below normal',
    '🟢 Soil slightly compacted - can wait 1-2 weeks',
    '🟢 Minor aesthetic leaf damage - not affecting yield',
    '🟢 Preventive treatment for rare pests'
  ]
};

// ============================================================================
// TEST 6: Language Verification Response
// ============================================================================

const languageVerificationLog = {
  timestamp: '2024-04-10T10:30:00Z',
  targetLanguage: 'hi',
  responseDevanagariPercentage: 45.2,
  isCorrectLanguage: true,
  detectedLanguage: 'hi',
  action: 'ACCEPTED - Response meets language requirement'
};

const languageFailureLog = {
  timestamp: '2024-04-10T10:31:00Z',
  targetLanguage: 'mr',
  responseDevanagariPercentage: 8.3, // Below 20% threshold
  isCorrectLanguage: false,
  detectedLanguage: 'en',
  action: 'REGENERATING - Response not in Marathi, regenerating with stronger prompt'
};

// ============================================================================
// TEST 7: Upload PDF with Language
// ============================================================================

const testUploadRequest = {
  method: 'POST',
  url: 'http://localhost:3000/api/rag/uploadpdf',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'multipart/form-data'
  },
  body: {
    file: '<PDF buffer>',
    userId: 'farmer_004',
    sessionId: 'session_jkl012',
    language: 'hi' // Language set at upload time
  }
};

const testUploadResponse = {
  success: true,
  data: {
    sessionId: 'session_jkl012',
    chunksProcessed: 15,
    message: 'PDF analyzed contextually successfully.',
    autoSummary: `📋 मृदा स्वास्थ्य सारांश
आपकी मिट्टी सामान्य है। नाइट्रोजन और पोटेशियम की मामूली कमी है।

⚠️ पाई गई समस्याएं
• 🟡 मध्यम प्राथमिकता - नाइट्रोजन की कमी
• 🟢 कम प्राथमिकता - पोटेशियम की कमी`
  }
};

// ============================================================================
// TEST 8: Error Handling
// ============================================================================

const errorExamples = {
  languageMismatch: {
    status: 'regenerating',
    log: 'Response not in Hindi. Regenerating with stronger language prompt.',
    originalLanguage: 'en',
    targetLanguage: 'hi',
    devanagariPercentage: 15
  },
  
  noContent: {
    response: `📋 मृदा स्वास्थ्य सारांश
मुझे आपके प्रश्न का उत्तर अपलोड की गई रिपोर्ट में नहीं मिला।

""" पाई गई समस्याएं
मुझे इसके बारे में जानकारी रिपोर्ट में नहीं मिली।

✅ आपको क्या करना चाहिए
अपने स्थानीय कृषि विभाग से संपर्क करें या अधिक विस्तृत मिट्टी परीक्षण रिपोर्ट अपलोड करें।`
  },

  invalidPDF: {
    success: false,
    message: 'PDF contains no readable text. It may be a scanned image-only PDF. Please upload a text-based PDF or use OCR first.'
  }
};

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

const testingChecklist = `
[ ] Language Test - English
    - Upload soil report
    - Ask nitrogen question
    - Verify response is in English
    - Verify units are in kg/acre and bags

[ ] Language Test - Hindi
    - Upload same soil report
    - Ask same nitrogen question in Hindi
    - Verify response is ONLY in Hindi (no English)
    - Verify Devanagari script used
    - Verify recommendations in Hindi

[ ] Language Test - Marathi
    - Upload same soil report
    - Ask same nitrogen question in Marathi
    - Verify response is ONLY in Marathi (no English)
    - Verify Devanagari script used
    - Verify recommendations in Marathi

[ ] Unit Conversion Test
    - Test ppm to ml conversion
    - Test kg/ha to kg/acre conversion
    - Test technical units to bag count
    - Verify farmer doesn't see technical units

[ ] Farmer-Friendly Test
    - Have actual farmer read response
    - Verify no technical jargon
    - Verify no calculations needed by farmer
    - Verify step-by-step instructions clear

[ ] Priority Test
    - Verify HIGH priority issues have 🔴
    - Verify MEDIUM priority issues have 🟡
    - Verify LOW priority issues have 🟢
    - Verify farmer knows what to fix first

[ ] Structure Test
    - Verify response follows format
    - Verify emojis render correctly
    - Verify bullet points visible
    - Verify steps numbered correctly

[ ] Language Verification Test
    - Set target language to Hindi
    - Manually trigger English response
    - Verify system detects language mismatch
    - Verify system regenerates in correct language

[ ] Error Handling Test
    - Upload scanned PDF (image only)
    - Verify appropriate error message
    - Ask question not in report
    - Verify "not found in report" message
    - Ask with invalid language code
    - Verify fallback to English
`;

module.exports = {
  testRequest1,
  expectedResponse1,
  testRequest2,
  expectedResponse2,
  testRequest3,
  expectedResponse3,
  priorityExamples,
  languageVerificationLog,
  languageFailureLog,
  testUploadRequest,
  testUploadResponse,
  errorExamples,
  testingChecklist
};
