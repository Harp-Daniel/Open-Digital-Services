const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Firebase: [DEBUG] Attempting to load from FIREBASE_SERVICE_ACCOUNT env var');
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        if (serviceAccount && serviceAccount.private_key) {
            const keyLen = serviceAccount.private_key.length;
            console.log(`Firebase: [DEBUG] Private key length: ${keyLen} chars`);

            // Technical check for standard private key headers
            const hasHeader = serviceAccount.private_key.includes('-----BEGIN PRIVATE KEY-----');
            const hasFooter = serviceAccount.private_key.includes('-----END PRIVATE KEY-----');
            console.log(`Firebase: [DEBUG] Header present: ${hasHeader}, Footer present: ${hasFooter} `);

            // Fix for newline characters
            const originalKey = serviceAccount.private_key;
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').replace(/\r/g, '');

            if (originalKey !== serviceAccount.private_key) {
                console.log('Firebase: [DEBUG] Replacement applied (converted \\n to real newlines)');
            }
        }
        console.log('Firebase: [DEBUG] Successfully parsed JSON for project:', serviceAccount.project_id);
        console.log('Firebase: [DEBUG] Client Email:', serviceAccount.client_email);
    } catch (parseErr) {
        console.error('CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', parseErr.message);
    }
} else {
    console.error('CRITICAL: FIREBASE_SERVICE_ACCOUNT env var NOT FOUND in process.env');
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
