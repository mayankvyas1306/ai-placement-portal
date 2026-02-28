const User = require('../models/User');
const AiRequestLog = require('../models/AiRequestLog');

const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: 'student' });
        const admins = await User.countDocuments({ role: 'admin' });
        const totalAiRequests = await AiRequestLog.countDocuments();

        // Count per feature via aggregation
        const requestsByFeature = await AiRequestLog.aggregate([
            { $group: { _id: '$contentType', count: { $sum: 1 } } }
        ]);

        res.json({
            users: { total: totalUsers, students, admins },
            aiRequests: {
                total: totalAiRequests,
                breakdown: requestsByFeature
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

module.exports = { getSystemStats, getAllUsers };
