const { generateGeminiContent } = require('../services/geminiService');
const prompts = require('../services/promptService');
const AiRequestLog = require('../models/AiRequestLog');
const StudyPlan = require('../models/StudyPlan');

const healthCheck = async (req, res) => {
    try {
        console.log(`[AI Controller] GET /api/v1/ai/health-check`);
        const result = await generateGeminiContent("Return the word OK.");
        if (typeof result === 'object' && result.error) {
            return res.status(500).json(result);
        }
        return res.send(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const handleAiRequest = async (req, type, promptFunction, promptArgs) => {
    // Defensive check: Ensure req.user exists before accessing _id
    if (!req.user || !req.user._id) {
        return { error: true, status: 401, message: 'Unauthorized: User not found in request' };
    }

    const userId = req.user._id;
    const prompt = promptFunction(...promptArgs);
    const aiResponseRaw = await generateGeminiContent(prompt);

    if (typeof aiResponseRaw === 'object' && aiResponseRaw.error) {
        return aiResponseRaw; // Bubble up Gemini API errors verbatim
    }

    let parsedJson;
    try {
        // Attempt to extract JSON using regex defensively
        const jsonMatch = aiResponseRaw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        const extractedJsonText = (jsonMatch && jsonMatch[0]) ? jsonMatch[0] : aiResponseRaw;
        parsedJson = JSON.parse(extractedJsonText);
        console.log(`[AI Controller] Successfully parsed JSON for ${type}`);
    } catch (parseError) {
        console.error(`[AI Controller] JSON Parsing Failed. Error:`, parseError.message);
        // Never crash the server, return exactly as specified
        return {
            success: false,
            rawResponse: aiResponseRaw,
            error: "Parsing failed"
        };
    }

    try {
        // Log the request safely
        await AiRequestLog.create({
            userId,
            contentType: type,
            promptDetails: Object.assign({}, promptArgs),
            aiResponse: parsedJson
        });
    } catch (dbError) {
        console.error(`[AI Controller] DB Logging Error:`, dbError.message);
    }

    return parsedJson;
};

const generateDsaQuestions = async (req, res, next) => {
    try {
        console.log(`[AI Controller] POST /api/v1/ai/dsa-questions - Incoming Body:`, JSON.stringify(req.body));
        const { topic, difficulty, count = 3 } = req.body;
        const result = await handleAiRequest(req, 'dsa', prompts.dsa, [topic, difficulty, count]);

        if (result && result.error && result.status === 401) {
            return res.status(401).json(result);
        }
        if (result && result.error && result.success !== false) {
            return res.status(500).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error(`[AI Controller] DSA Questions Server Error:`, error.message);
        return res.json({ success: false, error: 'Failed to generate DSA questions', details: error.message });
    }
};

const generateInterviewQuestions = async (req, res, next) => {
    try {
        console.log(`[AI Controller] POST /api/v1/ai/interview-questions - Incoming Body:`, JSON.stringify(req.body));
        const { targetRole, experienceLevel, skills } = req.body;
        const result = await handleAiRequest(req, 'interview', prompts.interview, [targetRole, experienceLevel, skills]);

        if (result && result.error && result.status === 401) {
            return res.status(401).json(result);
        }
        if (result && result.error && result.success !== false) {
            return res.status(500).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error(`[AI Controller] Interview Questions Server Error:`, error.message);
        return res.json({ success: false, error: 'Failed to generate interview questions', details: error.message });
    }
};

const analyzeResume = async (req, res, next) => {
    try {
        console.log(`[AI Controller] POST /api/v1/ai/resume-analyzer - Incoming Body received`);
        const { resumeText, targetRole } = req.body;
        const result = await handleAiRequest(req, 'resume_analysis', prompts.resume, [resumeText, targetRole]);

        if (result && result.error && result.status === 401) {
            return res.status(401).json(result);
        }
        if (result && result.error && result.success !== false) {
            return res.status(500).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error(`[AI Controller] Resume Analysis Server Error:`, error.message);
        return res.json({ success: false, error: 'Failed to analyze resume', details: error.message });
    }
};

const generateStudyPlan = async (req, res, next) => {
    try {
        console.log(`[AI Controller] POST /api/v1/ai/study-planner - Incoming Body:`, JSON.stringify(req.body));
        const { topic, currentLevel } = req.body;
        const prompt = prompts.studyPlan(topic, currentLevel);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: true, message: 'Unauthorized: User not found in request' });
        }

        let aiResponseRaw = await generateGeminiContent(prompt);
        if (typeof aiResponseRaw === 'object' && aiResponseRaw.error) {
            return res.status(500).json(aiResponseRaw);
        }

        let parsedJson;
        try {
            const jsonMatch = aiResponseRaw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            const extractedJsonText = (jsonMatch && jsonMatch[0]) ? jsonMatch[0] : aiResponseRaw;
            parsedJson = JSON.parse(extractedJsonText);
        } catch (parseError) {
            console.error(`[AI Controller] Study Plan JSON Parsing Failed. Error:`, parseError.message);
            return res.json({
                success: false,
                rawResponse: aiResponseRaw,
                error: "Parsing failed"
            });
        }

        try {
            const plan = await StudyPlan.create({
                userId: req.user._id,
                topic,
                planDetails: parsedJson.planDetails || parsedJson
            });
            return res.json(plan);
        } catch (dbError) {
            console.error(`[AI Controller] Study Plan DB Logging Error:`, dbError.message);
            return res.json(parsedJson); // Return plan even if logging fails
        }
    } catch (error) {
        console.error(`[AI Controller] Study Plan Server Error:`, error.message);
        return res.json({ success: false, error: 'Failed to generate study plan', details: error.message });
    }
};

module.exports = {
    healthCheck,
    generateDsaQuestions,
    generateInterviewQuestions,
    analyzeResume,
    generateStudyPlan
};
