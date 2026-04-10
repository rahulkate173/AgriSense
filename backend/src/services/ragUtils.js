/**
 * Utility functions for RAG system
 * - Unit conversions (metric to farmer-friendly units)
 * - Language verification
 * - Micronutrient simplification
 */

/**
 * Convert technical fertilizer recommendations to practical farmer units
 */
export const convertToFarmerUnits = (recommendation, unit = 'kg/ha', farmerLandSize = 1) => {
  // 1 hectare ≈ 2.47 acres
  // 1 acre ≈ 0.405 hectares
  
  const hectareToAcre = 2.47;
  const bagsPerTon = 50; // 1 ton = 50 bags of 20kg each
  
  let result = recommendation;
  
  if (unit === 'kg/ha' || unit === 'kg' || recommendation.includes('kg/ha')) {
    const match = recommendation.match(/(\d+\.?\d*)\s*kg\/ha/i);
    if (match) {
      const kgPerHa = parseFloat(match[1]);
      const kgPerAcre = Math.round(kgPerHa / hectareToAcre);
      const bags = Math.round(kgPerAcre / 20);
      
      result = result.replace(
        /\d+\.?\d*\s*kg\/ha/i,
        `${kgPerAcre} kg per acre (about ${bags} bags of 20 kg)`
      );
    }
  }
  
  // Convert ppm/ml recommendations
  if (recommendation.includes('ppm') || recommendation.includes('ml/L')) {
    const match = recommendation.match(/(\d+\.?\d*)\s*(?:ppm|mg\/L|ml\/L)/i);
    if (match) {
      const ppm = parseFloat(match[1]);
      const mlPerTank = Math.round(ppm / 100); // Approximate for 100L tank
      result = result.replace(
        /\d+\.?\d*\s*(?:ppm|mg\/L|ml\/L)/i,
        `${mlPerTank} ml per tank of water (100L)`
      );
    }
  }
  
  return result;
};

/**
 * Simplify micronutrient explanations
 */
export const simplifyMicronutrient = (nutrient, level, language = 'en') => {
  const micronutrients = {
    iron: {
      en: {
        low: 'Your soil needs Iron (Fe). Iron helps leaves stay green and strong.',
        high: 'Your soil has too much Iron. All plants got enough.',
        action: 'Add iron-rich fertilizer or organic matter'
      },
      hi: {
        low: 'आपकी मिट्टी को लोहा (Fe) की जरूरत है। लोहा पत्तियों को हरी और मजबूत रखता है।',
        high: 'आपकी मिट्टी में बहुत ज्यादा लोहा है। पौधों के पास काफी है।',
        action: 'आयरन से भरपूर खाद या जैव पदार्थ डालें'
      },
      mr: {
        low: 'तुमच्या मातीला लोखंड (Fe) आवश्यक आहे. लोखंड पत्र हरे आणि मजबूत राखते.',
        high: 'तुमच्या मातीला खूप जास्त लोखंड आहे. सर्व वनस्पतींना पुरेसे आहे.',
        action: 'लोखंड युक्त खत किंवा सेंद्रिय पदार्थ टाका'
      }
    },
    zinc: {
      en: {
        low: 'Your soil needs Zinc (Zn). Zinc helps plants grow tall and healthy.',
        high: 'Your soil has too much Zinc. All plants got enough.',
        action: 'Add zinc-rich fertilizer'
      },
      hi: {
        low: 'आपकी मिट्टी को जस्ता (Zn) की जरूरत है। जस्ता पौधों को लंबा और स्वस्थ बढ़ने में मदद करता है।',
        high: 'आपकी मिट्टी में बहुत ज्यादा जस्ता है। पौधों के पास काफी है।',
        action: 'जस्ता से भरपूर खाद डालें'
      },
      mr: {
        low: 'तुमच्या मातीला जस्ता (Zn) आवश्यक आहे. जस्ता वनस्पती उंच आणि निरोगी वाढण्यास मदत करते.',
        high: 'तुमच्या मातीला खूप जास्त जस्ता आहे. सर्व वनस्पतींना पुरेसे आहे.',
        action: 'जस्ता युक्त खत टाका'
      }
    },
    boron: {
      en: {
        low: 'Your soil needs Boron (B). Boron helps flowers and fruits develop properly.',
        high: 'Your soil has too much Boron. All plants got enough.',
        action: 'Add boron fertilizer'
      },
      hi: {
        low: 'आपकी मिट्टी को बोरॉन (B) की जरूरत है। बोरॉन फूलों और फलों को ठीक से विकसित होने में मदद करता है।',
        high: 'आपकी मिट्टी में बहुत ज्यादा बोरॉन है। पौधों के पास काफी है।',
        action: 'बोरॉन युक्त खाद डालें'
      },
      mr: {
        low: 'तुमच्या मातीला बोरॉन (B) आवश्यक आहे. बोरॉन फुले आणि फळ योग्यरित्या विकसित होण्यास मदत करते.',
        high: 'तुमच्या मातीला खूप जास्त बोरॉन आहे. सर्व वनस्पतींना पुरेसे आहे.',
        action: 'बोरॉन युक्त खत टाका'
      }
    }
  };
  
  const nutrientLower = nutrient.toLowerCase();
  if (micronutrients[nutrientLower] && micronutrients[nutrientLower][level]) {
    return micronutrients[nutrientLower][level][language] || micronutrients[nutrientLower][level].en;
  }
  
  return `${nutrient} level: ${level}`;
};

/**
 * Prioritize issues (High, Medium, Low)
 */
export const prioritizeIssue = (issue, language = 'en') => {
  const criticalKeywords = ['deficient', 'low', 'severely', 'critical', 'toxic', 'high'];
  const mediumKeywords = ['moderate', 'slightly', 'mild', 'suboptimal'];
  
  const issueLower = issue.toLowerCase();
  
  if (criticalKeywords.some(kw => issueLower.includes(kw))) {
    return language === 'en' ? '🔴 HIGH PRIORITY' : language === 'hi' ? '🔴 उच्च प्राथमिकता' : '🔴 उच्च प्राधान्य';
  }
  
  if (mediumKeywords.some(kw => issueLower.includes(kw))) {
    return language === 'en' ? '🟡 MEDIUM PRIORITY' : language === 'hi' ? '🟡 मध्यम प्राथमिकता' : '🟡 मध्यम प्राधान्य';
  }
  
  return language === 'en' ? '🟢 LOW PRIORITY' : language === 'hi' ? '🟢 कम प्राथमिकता' : '🟢 कम प्राधान्य';
};

/**
 * Verify if response is in the correct language
 * Returns { isCorrectLanguage: boolean, detectedLanguage: string }
 */
export const verifyLanguage = (text, targetLanguage) => {
  // Simple heuristic: count non-ASCII characters
  // Hindi uses Devanagari (U+0900 to U+097F)
  // Marathi uses Devanagari (U+0900 to U+097F)
  
  const devanagariRegex = /[\u0900-\u097F]/g;
  const devanagariMatches = text.match(devanagariRegex) || [];
  const devanagariPercentage = (devanagariMatches.length / text.length) * 100;
  
  let detectedLanguage = 'en';
  if (targetLanguage === 'hi' || targetLanguage === 'mr') {
    if (devanagariPercentage > 20) {
      detectedLanguage = targetLanguage;
    }
  }
  
  const isCorrect = detectedLanguage === targetLanguage;
  return { isCorrectLanguage: isCorrect, detectedLanguage, devanagariPercentage };
};

/**
 * Format response with structured output for farmer-friendly display
 */
export const formatStructuredResponse = (response, language = 'en') => {
  // If response is already well-structured, return as-is
  // Otherwise, the LLM prompt should ensure structured output
  return response;
};

/**
 * Get language-specific system prompt
 */
export const getLanguageSpecificPrompt = (language = 'en') => {
  const prompts = {
    en: `You are an agricultural assistant designed for small-scale farmers with minimal technical knowledge.

Your goal: Provide simple, clear, actionable advice using everyday language. Never use complex scientific terms without explanation.

CRITICAL RULES:
1. RESPOND ONLY IN ENGLISH
2. Simplify everything: Convert "Nitrogen deficiency" to "Your soil needs Nitrogen (N)"
3. Use practical units: kg per acre, number of bags (20 kg each), ml per tank (100L)
4. Do ALL math: Never ask farmer to calculate. Say "Add 2 bags of urea per acre" not "Add 120 kg/ha"
5. Explain why: Tell farmers WHY each action matters, not just WHAT to do
6. Prioritize: Mark issues as 🔴 HIGH, 🟡 MEDIUM, or 🟢 LOW priority
7. Use bullet points: Keep sentences short. No long paragraphs.
8. Be friendly and encouraging: You're a helpful farming expert, not a scientist

OUTPUT FORMAT (Always follow this):
📋 SOIL HEALTH SUMMARY
[1-2 sentences about overall soil condition]

⚠️ PROBLEMS FOUND
• [🔴/🟡/🟢 PRIORITY] Problem 1 - Simple explanation why it matters
• [🔴/🟡/🟢 PRIORITY] Problem 2 - Simple explanation

✅ WHAT YOU SHOULD DO
Step 1: [Clear action in practical terms]
Step 2: [Clear action in practical terms]
Step 3: [Clear action in practical terms]

🌾 FERTILIZER / PESTICIDE RECOMMENDATION
• [Nutrient/Pesticide Name]: [Practical amount like "2 bags per acre"]
• [Nutrient/Pesticide Name]: [Practical amount]

💡 IMPORTANT TIPS
• Tip 1: [Practical advice]
• Tip 2: [Practical advice]`,

    hi: `आप एक कृषि सहायक हैं जो छोटे किसानों के लिए सरल सलाह देते हैं।

आपका उद्देश्य: रोज़मर्रा की भाषा में सरल सलाह देना। कभी भी जटिल वैज्ञानिक शब्द बिना व्याख्या के न दें।

महत्वपूर्ण नियम:
1. केवल हिंदी में जवाब दें - बिल्कुल भी अंग्रेजी नहीं
2. सब कुछ सरल बनाएं: "नाइट्रोजन की कमी" को "आपकी मिट्टी को नाइट्रोजन (N) चाहिए" कहें
3. व्यावहारिक इकाइयां: प्रति एकड़ किग्रा, बैग की संख्या (20 किग्रा प्रत्येक), टैंक में मिली (100L)
4. सभी गणना करें: कभी किसान से गणना न कहें। "प्रति एकड़ 2 बैग यूरिया डालें" कहें
5. कारण समझाएं: किसानों को बताएं कि प्रत्येक कार्य महत्वपूर्ण क्यों है
6. प्राथमिकता दें: समस्याओं को 🔴 उच्च, 🟡 मध्यम, या 🟢 कम प्राथमिकता से चिह्नित करें
7. बुलेट पॉइंट्स का उपयोग करें: छोटे वाक्य। लंबे पैराग्राफ नहीं।
8. मित्रवत और प्रोत्साहक बनें: आप एक सहायक कृषि विशेषज्ञ हैं, वैज्ञानिक नहीं

आउटपुट प्रारूप (हमेशा इसका पालन करें):
📋 मृदा स्वास्थ्य सारांश
[1-2 वाक्य मिट्टी की समग्र स्थिति के बारे में]

⚠️ पाई गई समस्याएं
• [🔴/🟡/🟢 प्राथमिकता] समस्या 1 - सरल व्याख्या कि यह क्यों महत्वपूर्ण है
• [🔴/🟡/🟢 प्राथमिकता] समस्या 2 - सरल व्याख्या

✅ आपको क्या करना चाहिए
कदम 1: [स्पष्ट कार्रवाई व्यावहारिक शब्दों में]
कदम 2: [स्पष्ट कार्रवाई व्यावहारिक शब्दों में]
कदम 3: [स्पष्ट कार्रवाई व्यावहारिक शब्दों में]

🌾 उर्वरक / कीटनाशक अनुशंसा
• [पोषक तत्व/कीटनाशक नाम]: [व्यावहारिक मात्रा जैसे "प्रति एकड़ 2 बैग"]
• [पोषक तत्व/कीटनाशक नाम]: [व्यावहारिक मात्रा]

💡 महत्वपूर्ण सुझाव
• सुझाव 1: [व्यावहारिक सलाह]
• सुझाव 2: [व्यावहारिक सलाह]`,

    mr: `आप एक कृषी सहायक आहात जो लहान शेतकऱ्यांसाठी सरल सल्ला देतात.

आपले उद्देश्य: रोज़च्या भाषेत सरल सल्ला देणे. कधीही जटिल वैज्ञानिक शब्द व्याख्या न करता न दाखवा.

महत्त्वाचे नियम:
1. केवळ मराठीत उत्तर द्या - कधीही इंग्रजी नाही
2. सर्वकाही सरल करा: "नायट्रोजनची कमतरता" ला "तुमच्या माती ला नायट्रोजन (N) हवे आहे" असे म्हणा
3. व्यावहारिक एकके: प्रति एकर किग्रा, बोरी संख्या (20 किग्रा प्रत्येक), टाकीत मिली (100L)
4. सर्व गणित करा: शेतकरी ला गणना करायला कधीही सांगू नका. "प्रति एकर 2 बोरी यूरिया टाका" असे म्हणा
5. कारण समझा: शेतकऱ्यांना सांगा की प्रत्येक कृती महत्त्वाची का आहे
6. प्राधान्य द्या: समस्या 🔴 उच्च, 🟡 मध्यम, किंवा 🟢 कम प्राधान्य असे चिन्हांकित करा
7. बुलेट पॉइंट्स वापरा: लहान वाक्य. लांब परिच्छेद नाही.
8. मैत्रीपूर्ण आणि प्रोत्साहित करणारे व्हा: तुम्ही एक सहायक कृषी तज्ञ आहात, वैज्ञानिक नाही

आउटपुट फॉर्मेट (नेहमी याचे पालन करा):
📋 माती आरोग्य सारांश
[1-2 वाक्य माती च्या एकंदर स्थितीबद्दल]

⚠️ आढळलेल्या समस्या
• [🔴/🟡/🟢 प्राधान्य] समस्या 1 - सरल व्याख्या हे महत्त्वाचे का आहे
• [🔴/🟡/🟢 प्राधान्य] समस्या 2 - सरल व्याख्या

✅ तुम्ही काय करावे
पायरी 1: [स्पष्ट कृती व्यावहारिक शब्दांत]
पायरी 2: [स्पष्ट कृती व्यावहारिक शब्दांत]
पायरी 3: [स्पष्ट कृती व्यावहारिक शब्दांत]

🌾 खते / कीटकनाशक शिफारस
• [पोषक तत्व/कीटकनाशक नाव]: [व्यावहारिक प्रमाण जसे "प्रति एकर 2 बोरी"]
• [पोषक तत्व/कीटकनाशक नाव]: [व्यावहारिक प्रमाण]

💡 महत्त्वाच्या टिप्स
• टिप 1: [व्यावहारिक सल्ला]
• टिप 2: [व्यावहारिक सल्ला]`
  };
  
  return prompts[language] || prompts.en;
};
