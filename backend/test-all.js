require('dotenv').config({ path: 'C:/Projects/SDP/ai-placement-portal/backend/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testAllModels() {
    console.log("Starting exhaustive model tests...");
    const modelsData = JSON.parse(fs.readFileSync('models.json', 'utf8'));
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    let workingModels = [];

    const validModels = modelsData.models.filter(m =>
        m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
    );

    for (const m of validModels) {
        const modelName = m.name.replace('models/', '');
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000));
            const request = model.generateContent("Respond 'OK'");
            await Promise.race([request, timeout]);
            workingModels.push(modelName);
        } catch (e) { }
    }
    fs.writeFileSync('working-models.txt', workingModels.join('\n'), 'utf8');
}
testAllModels();
