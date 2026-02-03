const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin');
const verifyToken = require('../middlewares/auth.middleware');

/**
 * Helper to strip HTML tags for basic sanitization
 */
const cleanInput = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/<[^>]*>?/gm, '').trim();
};

// GET all messages (Protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('contacts').orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE message (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message, honeypot } = req.body;

        // 1. Honeypot check (SPAM protection)
        if (honeypot) {
            console.log('SPAM DETECTED: Honeypot field filled');
            return res.status(200).json({ success: true, message: 'Message ignored (Spam)' });
        }

        // 2. Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, Email and Message are required' });
        }

        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // 3. Sanitization
        const cleanMsg = {
            name: cleanInput(name),
            email: email.trim().toLowerCase(),
            subject: cleanInput(subject || 'Contact Sans Sujet'),
            message: cleanInput(message),
            status: 'unread',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('contacts').add(cleanMsg);
        res.status(201).json({ id: docRef.id, ...cleanMsg });
    } catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// MARK as read (Protected)
router.put('/:id/read', verifyToken, async (req, res) => {
    try {
        await db.collection('contacts').doc(req.params.id).update({ status: 'read' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await db.collection('contacts').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
