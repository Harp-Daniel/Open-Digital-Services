const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin');
const verifyToken = require('../middlewares/auth.middleware');

// Helper to sanitize objects for Firestore (removes undefined)
const sanitize = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        return value === undefined ? null : value;
    }));
};

// GET all partners
router.get('/', verifyToken, async (req, res) => {
    try {
        console.log('--- GET /api/partners ---');
        const snapshot = await db.collection('partners').get();
        const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(partners);
    } catch (error) {
        console.error('ERROR in GET /api/partners:', error);
        res.status(500).json({ message: error.message });
    }
});

// SEARCH partners/projects for public tracking (MUST BE BEFORE /:id)
router.get('/search', async (req, res) => {
    try {
        let { query: searchQuery } = req.query;
        console.log('--- GET /api/partners/search ---', searchQuery);

        if (!searchQuery) return res.status(400).json({ message: 'Query is required' });

        // Basic sanitization: trim and remove potential script tags
        searchQuery = searchQuery.trim().replace(/<[^>]*>?/gm, '');

        const partnersRef = db.collection('partners');

        // Execute both queries in parallel for better performance
        const [orderSnapshot, emailSnapshot] = await Promise.all([
            partnersRef.where('orderNumber', '==', searchQuery).get(),
            partnersRef.where('email', '==', searchQuery.toLowerCase()).get()
        ]);

        const snapshot = !orderSnapshot.empty ? orderSnapshot : emailSnapshot;

        if (snapshot.empty) {
            return res.json(null);
        }

        const data = snapshot.docs[0].data();

        // Security: Filter data to send ONLY what is needed for public tracking
        // Prevent leaking internal notes or private admin fields
        const publicData = {
            partnerId: snapshot.docs[0].id,
            name: data.name,
            projects: (data.projects || []).map(p => ({
                id: p.id,
                projectName: p.title || p.projectName, // compatibility
                status: p.status,
                overallProgress: p.progress || p.overallProgress,
                lastUpdate: p.lastUpdate || p.createdAt
            }))
        };

        res.json(publicData);
    } catch (error) {
        console.error('ERROR in GET /api/partners/search:', error);
        res.status(500).json({ message: 'Error processing your search' });
    }
});

// GET partner by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        console.log(`--- GET /api/partners/${req.params.id} ---`);
        const doc = await db.collection('partners').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: 'Partner not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('ERROR in GET /api/partners/:id:', error);
        res.status(500).json({ message: error.message });
    }
});

// CREATE partner
router.post('/', verifyToken, async (req, res) => {
    try {
        console.log('--- POST /api/partners ---');
        console.log('Payload received:', JSON.stringify(req.body, null, 2));

        const partnerData = sanitize({
            ...req.body,
            createdAt: new Date().toISOString()
        });

        console.log('Sanitized data for Firestore:', JSON.stringify(partnerData, null, 2));

        const docRef = await db.collection('partners').add(partnerData);
        console.log('SUCCESS: Partner created with ID:', docRef.id);

        res.status(201).json({ id: docRef.id, ...partnerData });
    } catch (error) {
        console.error('CRITICAL ERROR in POST /api/partners:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);

        res.status(500).json({
            message: error.message,
            details: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// UPDATE partner
router.put('/:id', verifyToken, async (req, res) => {
    try {
        console.log(`--- PUT /api/partners/${req.params.id} ---`);
        const data = sanitize(req.body);
        await db.collection('partners').doc(req.params.id).update(data);
        res.json({ id: req.params.id, ...data });
    } catch (error) {
        console.error('ERROR in PUT /api/partners/:id:', error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE partner
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        console.log(`--- DELETE /api/partners/${req.params.id} ---`);
        await db.collection('partners').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        console.error('ERROR in DELETE /api/partners/:id:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
