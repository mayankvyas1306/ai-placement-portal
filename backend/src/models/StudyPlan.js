const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    planDetails: { type: Array, required: true }, // Expected array of daily plans
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
