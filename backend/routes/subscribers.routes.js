const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin');
const verifyToken = require('../middlewares/auth.middleware');

// GET all subscribers
router.get('/', verifyToken, async (req, res) => {
    try {
        console.log('--- GET /api/subscribers ---');
        // Temporarily removed orderBy to check if it causes the 500 error (indexed required)
        const snapshot = await db.collection('subscribers').get();
        const subscribers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${subscribers.length} subscribers`);
        res.json(subscribers);
    } catch (error) {
        console.error('ERROR in GET /api/subscribers:', error);
        res.status(500).json({ message: error.message });
    }
});

// CREATE subscriber
router.post('/', async (req, res) => {
    try {
        const { email, honeypot } = req.body;

        // 1. Honeypot check (SPAM protection)
        if (honeypot) {
            console.log('SPAM DETECTED: Newsletter Honeypot field filled');
            return res.status(200).json({ success: true, message: 'Subscribed' }); // Fail silently for robots
        }

        console.log('--- POST /api/subscribers ---', email);
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Basic validation & sanitization
        const cleanEmail = email.trim().toLowerCase().replace(/<[^>]*>?/gm, '');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if already exists
        const existing = await db.collection('subscribers').where('email', '==', cleanEmail).get();
        if (!existing.empty) {
            console.log('Email already subscribed:', cleanEmail);
            return res.status(409).json({ error: 'Already subscribed' });
        }

        const subscriber = {
            email: cleanEmail,
            subscribedAt: new Date().toISOString()
        };
        const docRef = await db.collection('subscribers').add(subscriber);
        console.log('Subscriber added with ID:', docRef.id);
        res.status(201).json({ id: docRef.id, ...subscriber });
    } catch (error) {
        console.error('ERROR in POST /api/subscribers:', error);
        res.status(500).json({ message: 'Unable to complete subscription' });
    }
});

// DELETE subscriber
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        console.log('--- DELETE /api/subscribers ---', req.params.id);
        await db.collection('subscribers').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        console.error('ERROR in DELETE /api/subscribers:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
