const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. AI features will not work. Get a key from https://aistudio.google.com/app/apikey');
}

const generateGeminiContent = async (prompt) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const isKeyPresent = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length >= 10;

        console.log(`[Gemini API] Key present: ${isKeyPresent}`);
        if (!isKeyPresent) {
            return { error: true, status: 400, message: 'GEMINI_API_KEY is missing or invalid in environment variables.' };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = 'models/gemini-1.5-pro';
        console.log(`[Gemini API] Using model: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });

        console.log(`[Gemini API] Requesting content generation...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[Gemini API] Response received. Length: ${text.length} characters.`);

        // Strictly return raw text
        return text;
    } catch (error) {
        console.error('[Gemini API] Detailed Error:', error.message || error);
        console.error('[Gemini API] Full error object:', JSON.stringify(error, null, 2));

        const msg = (error.message || '').includes('API key')
            ? 'Invalid Google Gemini API Key. Please get a real key from Google AI Studio and put it in backend/.env.'
            : 'Failed to generate content from AI';

        // Return structured error JSON for network/API failures
        return {
            error: true,
            message: msg,
            details: error.message || "Unknown error"
        };
    }
};

module.exports = { generateGeminiContent };
