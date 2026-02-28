const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    planDetails: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexibile layout allows AI mutation
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
