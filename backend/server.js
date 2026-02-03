const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cloudinary = require('./config/cloudinary');

const app = express();

// Middleware
// In production, restrict this to your domain: app.use(cors({ origin: 'https://ods-tech.com' }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Open Digital Services API is running',
        cloudinary: 'configured'
    });
});

// Import Routes
const servicesRoutes = require('./routes/services.routes');
const contentRoutes = require('./routes/content.routes');
const contactsRoutes = require('./routes/contacts.routes');
const partnersRoutes = require('./routes/partners.routes');
const subscribersRoutes = require('./routes/subscribers.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Use Routes
app.use('/api/services', servicesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/subscribers', subscribersRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('!!! EXPRESS ERROR !!!');
    console.error('Path:', req.path);
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        path: req.path
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', async () => {
    console.log(`\n============================================`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Mobile access: http://10.172.91.230:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Test Firestore Connectivity
    try {
        const { db } = require('./config/firebase-admin');
        const testRef = db.collection('_health_check').doc('ping');
        await testRef.set({ lastPing: new Date().toISOString() });
        console.log(`🔥 Firestore: CONNECTED (Project: ${process.env.GOOGLE_CLOUD_PROJECT || 'default'})`);
    } catch (fsError) {
        console.error(`❌ Firestore: CONNECTION ERROR:`, fsError.message);
    }

    console.log(`============================================\n`);

    setInterval(() => {
        // ... heartbeat ...
    }, 5000);
});

server.on('error', (err) => {
    console.error('CRITICAL: Server failed to start:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    }
});

process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
    console.log(`PROCESS EXIT: Server is exiting with code: ${code}`);
});

process.on('SIGINT', () => {
    console.log('PROCESS SIGNAL: Received SIGINT (Ctrl+C)');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('PROCESS SIGNAL: Received SIGTERM');
    process.exit(0);
});

module.exports = app;
