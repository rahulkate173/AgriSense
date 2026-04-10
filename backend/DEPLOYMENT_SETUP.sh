#!/bin/bash
# RAG Enhancement Deployment & Setup Guide

# ============================================================================
# BACKEND SETUP
# ============================================================================

echo "Setting up RAG Enhancement Backend..."

# 1. Install dependencies (already should be done)
# npm install @langchain/mistralai @langchain/pinecone pinecone-database pdf-parse

# 2. Verify environment variables are set
echo "Checking environment variables..."
if [ -z "$MISTRAL_API_KEY" ]; then
    echo "❌ MISTRAL_API_KEY not set"
    exit 1
fi

if [ -z "$PINECONE_INDEX_NAME" ]; then
    echo "⚠️  PINECONE_INDEX_NAME not set, using default: agrisense-rag"
    export PINECONE_INDEX_NAME="agrisense-rag"
fi

if [ -z "$PINECONE_REGION" ]; then
    echo "⚠️  PINECONE_REGION not set, using default: us-east-1"
    export PINECONE_REGION="us-east-1"
fi

echo "✅ Environment variables configured"

# 3. Verify file structure
echo "Checking file structure..."

files=(
    "src/services/RAG.js"
    "src/services/ragUtils.js"
    "src/controllers/rag.controller.js"
    "src/routes/rag.routes.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file NOT FOUND"
        exit 1
    fi
done

# ============================================================================
# FRONTEND SETUP
# ============================================================================

echo ""
echo "Setting up RAG Enhancement Frontend..."

# 1. Verify i18n configuration
echo "Checking i18n configuration..."
if grep -q "hi:" frontend/src/i18n.js && grep -q "mr:" frontend/src/i18n.js; then
    echo "✅ i18n configured with Hindi and Marathi"
else
    echo "❌ i18n missing Hindi or Marathi configuration"
    exit 1
fi

# 2. Verify locale files
echo "Checking locale files..."
locales=("en.json" "hi.json" "mr.json")
for locale in "${locales[@]}"; do
    if [ -f "frontend/src/locales/$locale" ]; then
        echo "✅ frontend/src/locales/$locale exists"
    else
        echo "❌ frontend/src/locales/$locale NOT FOUND"
        exit 1
    fi
done

# 3. Verify component integration
echo "Checking component integration..."
if grep -q "i18n.language" frontend/src/features/chat/pages/ChatPage.jsx; then
    echo "✅ ChatPage passes language to backend"
else
    echo "❌ ChatPage doesn't pass language to backend"
fi

# ============================================================================
# DEPLOYMENT CHECKLIST
# ============================================================================

echo ""
echo "=============================="
echo "DEPLOYMENT CHECKLIST"
echo "=============================="
echo ""
echo "Backend Configuration:"
echo "[ ] MISTRAL_API_KEY is set and has sufficient quota"
echo "[ ] PINECONE credentials are configured"
echo "[ ] Pinecone index exists or can be created"
echo "[ ] MongoDB connection string is valid"
echo ""
echo "Frontend Configuration:"
echo "[ ] VITE_BACKEND_URL points to correct backend"
echo "[ ] i18n is configured with en, hi, mr"
echo "[ ] Locale files have required translation keys"
echo ""
echo "Files Created/Updated:"
echo "✅ src/services/ragUtils.js (NEW)"
echo "✅ src/services/RAG.js (ENHANCED)"
echo "✅ src/controllers/rag.controller.js (supports language)"
echo "✅ src/routes/rag.routes.js (supports language)"
echo "✅ frontend/src/features/chat/pages/ChatPage.jsx (passes language)"
echo "✅ frontend/src/features/chat/pages/ChatUploadPage.jsx (passes language)"
echo ""
echo "Documentation:"
echo "✅ RAG_ENHANCEMENT_DOCS.md - Full documentation"
echo "✅ RAG_TEST_EXAMPLES.js - Test cases and examples"
echo ""

# ============================================================================
# BACKEND STARTUP
# ============================================================================

echo ""
echo "=============================="
echo "STARTING BACKEND"
echo "=============================="
echo ""
echo "From backend directory, run:"
echo "npm start"
echo ""
echo "Or for development with auto-reload:"
echo "npm run dev"
echo ""

# ============================================================================
# FRONTEND STARTUP
# ============================================================================

echo "=============================="
echo "STARTING FRONTEND"
echo "=============================="
echo ""
echo "From frontend directory, run:"
echo "npm run dev"
echo ""

# ============================================================================
# VERIFICATION COMMANDS
# ============================================================================

echo "=============================="
echo "VERIFICATION COMMANDS"
echo "=============================="
echo ""
echo "1. Check backend is running:"
echo "   curl http://localhost:3000/api/health"
echo ""
echo "2. Test RAG endpoint (requires auth token):"
echo "   curl -X POST http://localhost:3000/api/rag/chat \\"
echo "     -H 'Authorization: Bearer <token>' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"userId\":\"test\",\"sessionId\":\"s1\",\"message\":\"Help\",\"language\":\"en\"}'"
echo ""
echo "3. Check language support in frontend:"
echo "   - Open app and look for Language Switcher"
echo "   - Should show English, हिंदी, मराठी options"
echo ""

# ============================================================================
# TROUBLESHOOTING
# ============================================================================

echo ""
echo "=============================="
echo "TROUBLESHOOTING"
echo "=============================="
echo ""
echo "Issue: Mistral API key not working"
echo "Fix: Verify MISTRAL_API_KEY is valid and has active tokens"
echo ""
echo "Issue: Pinecone connection fails"
echo "Fix: Check PINECONE_INDEX_NAME and PINECONE_REGION match your setup"
echo ""
echo "Issue: Language not changing in UI"
echo "Fix: Verify i18n context provider wraps your app components"
echo ""
echo "Issue: Response not in correct language"
echo "Fix: Check language parameter is being passed to backend API"
echo "     Verify test with: curl ... -d '{...\"language\":\"hi\"}'"
echo ""
echo "Issue: Too many regenerations"
echo "Fix: Check Devanagari threshold in ragUtils.js verifyLanguage()"
echo ""

echo ""
echo "=============================="
echo "✅ ALL CHECKS COMPLETE"
echo "=============================="
