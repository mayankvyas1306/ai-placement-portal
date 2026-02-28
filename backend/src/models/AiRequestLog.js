const mongoose = require('mongoose');

const aiRequestLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentType: { type: String, enum: ['dsa', 'interview', 'resume_analysis', 'study_planner'], required: true },
    promptDetails: { type: Object },
    aiResponse: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('AiRequestLog', aiRequestLogSchema);
