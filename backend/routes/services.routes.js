const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin');
const verifyToken = require('../middlewares/auth.middleware');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Multer config for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all services
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('services').orderBy('createdAt', 'desc').get();
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE service
router.post('/', verifyToken, async (req, res) => {
    try {
        const service = {
            ...req.body,
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection('services').add(service);
        res.status(201).json({ id: docRef.id, ...service });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE service
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('services').doc(id).update(req.body);
        res.json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE service
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('services').doc(id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPLOAD image to Cloudinary
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Upload to Cloudinary using buffer
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'ods-services' },
            (error, result) => {
                if (error) return res.status(500).json({ error });
                res.json({ url: result.secure_url });
            }
        );

        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
