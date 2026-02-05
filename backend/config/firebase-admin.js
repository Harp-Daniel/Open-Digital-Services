const admin = require('firebase-admin');

let serviceAccount;
try {
    // Attempt local file first (for development)
    serviceAccount = require('./serviceAccountKey.json');
} catch (err) {
    // Fallback to environment variable (for production deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            // Fix for newline characters in private_key when provided via env var (Render/Vercel)
            if (serviceAccount && serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
        } catch (parseErr) {
            console.error('CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT env var');
        }
    }
}

if (!serviceAccount) {
    console.warn('WARNING: Firebase service account not found. Some features may not work.');
} else {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK Initialized for project:', serviceAccount.project_id);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
