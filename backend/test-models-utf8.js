require('dotenv').config({ path: 'C:/Projects/SDP/ai-placement-portal/backend/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        fs.writeFileSync('results.txt', "No API key");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-8b'
    ];

    let output = "";

    for (const m of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Say hello");
            output += `Success with ${m}: ` + await result.response.text() + "\n";
            break;
        } catch (e) {
            output += `Failed with ${m}: ` + e.message + "\n";
        }
    }
    fs.writeFileSync('results.txt', output, 'utf8');
}

testModels();
