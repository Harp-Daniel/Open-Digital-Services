const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Firebase: Attempting to load from FIREBASE_SERVICE_ACCOUNT env var');
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        // Fix for newline characters in private_key when provided via env var (Render/Vercel)
        if (serviceAccount && serviceAccount.private_key) {
            const originalKey = serviceAccount.private_key;
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            if (originalKey !== serviceAccount.private_key) {
                console.log('Firebase: Fixed newline characters in private_key');
            }
        }
        console.log('Firebase: Successfully parsed service account for project:', serviceAccount.project_id);
    } catch (parseErr) {
        console.error('CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', parseErr.message);
    }
} else {
    try {
        // Fallback to local file (for development)
        serviceAccount = require('./serviceAccountKey.json');
        console.log('Firebase: Loaded from local serviceAccountKey.json (Development)');
    } catch (err) {
        console.warn('WARNING: No Firebase configuration found (Env var or local file).');
    }
}

if (!serviceAccount) {
    console.error('CRITICAL: Firebase service account not found. Firestore will NOT work.');
} else {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK Initialized for project:', serviceAccount.project_id);
    } catch (initErr) {
        console.error('CRITICAL: Firebase initialization failed:', initErr.message);
    }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
