require('dotenv').config();
const { generateGeminiContent } = require('./src/services/geminiService');
const prompts = require('./src/services/promptService');

async function test() {
    console.log("Testing Gemini API...");
    try {
        const prompt = prompts.dsa("Binary Search Trees", "Medium", 3);
        const result = await generateGeminiContent(prompt);
        console.log("Final Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Test Error:", e);
    }
}

test();
