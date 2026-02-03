const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin');

// GET content by type
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const doc = await db.collection('content').doc(type).get();
        if (!doc.exists) {
            return res.json({});
        }
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE content by type
router.put('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        await db.collection('content').doc(type).set(req.body, { merge: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
