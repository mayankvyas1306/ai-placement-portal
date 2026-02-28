require('dotenv').config({ path: 'C:/Projects/SDP/ai-placement-portal/backend/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try 1.5 flash
    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.5-flash-latest'
    ];

    for (const m of modelsToTest) {
        try {
            console.log(`Testing model: ${m}`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Say hello");
            console.log(`Success with ${m}:`, await result.response.text());
            break; // Stop if we find a working one
        } catch (e) {
            console.log(`Failed with ${m}:`, e.message);
        }
    }
}

testModels();
