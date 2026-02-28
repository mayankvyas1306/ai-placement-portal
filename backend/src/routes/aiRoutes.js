const express = require('express');
const router = express.Router();
const {
    healthCheck,
    generateDsaQuestions,
    generateInterviewQuestions,
    analyzeResume,
    generateStudyPlan
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/health-check', healthCheck);

// All AI routes below require authentication
router.use(protect);

router.post('/dsa-questions', generateDsaQuestions);
router.post('/interview-questions', generateInterviewQuestions);
router.post('/analyze-resume', analyzeResume);
router.post('/study-planner', generateStudyPlan);

module.exports = router;
