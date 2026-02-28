const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or postman)
        if (!origin) return callback(null, true);

        // Check if the origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            // Passing false prevents Express from throwing a 500 error,
            // allowing the browser to correctly identify it as a CORS rejection.
            return callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

// Apply CORS middleware globally (also handles preflight OPTIONS for all routes)
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
