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
        const modelName = 'gemma-3-27b-it'; // Bypassing locked 2.0 Gemini models by using unrestricted 27-Billion Gemma open-model
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

        let msg = 'Failed to generate content from AI';
        let statusCode = 500;

        const errorString = (error.message || '').toLowerCase();

        if (errorString.includes('api key')) {
            msg = 'Invalid Google Gemini API Key. Please get a real key from Google AI Studio and put it in backend/.env.';
            statusCode = 401; // Unauthorized
        } else if (error.status === 429 || errorString.includes('429') || errorString.includes('quota') || errorString.includes('too many requests')) {
            msg = 'Google Gemini API Quota Exceeded. You have made too many requests. Please wait or check your Google AI Studio billing.';
            statusCode = 429; // Too Many Requests
        } else if (error.status) {
            statusCode = error.status;
        }

        // Return structured error JSON for network/API failures
        return {
            error: true,
            status: statusCode,
            message: msg,
            details: error.message || "Unknown error"
        };
    }
};

module.exports = { generateGeminiContent };
