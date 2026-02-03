const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
console.log('Firebase Admin SDK Initialized for project:', serviceAccount.project_id);

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
