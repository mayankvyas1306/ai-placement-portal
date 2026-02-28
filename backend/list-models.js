require('dotenv').config({ path: 'C:/Projects/SDP/ai-placement-portal/backend/.env' });
const axios = require('axios');
const fs = require('fs');

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        fs.writeFileSync('models.json', JSON.stringify({ error: "No API key" }));
        return;
    }

    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        fs.writeFileSync('models.json', JSON.stringify(response.data, null, 2), 'utf8');
    } catch (err) {
        fs.writeFileSync('models.json', JSON.stringify({
            error: err.message,
            data: err.response ? err.response.data : null
        }, null, 2), 'utf8');
    }
}

listModels();
