const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase-admin');
const verifyToken = require('../middlewares/auth.middleware');

/**
 * @route POST /api/analytics/hit
 * @desc Record a new visitor hit
 */
router.post('/hit', async (req, res) => {
    try {
        const timestamp = new Date().toISOString();
        const visitData = {
            timestamp,
            userAgent: req.headers['user-agent'] || 'unknown',
            page: req.body.page || 'home'
        };

        // 1. Log detailed hit
        await db.collection('analytics_hits').add(visitData);

        // 2. Increment atomic counter in summary document
        const summaryRef = db.collection('analytics').doc('summary');
        await summaryRef.set({
            totalVisits: admin.firestore.FieldValue.increment(1),
            lastVisit: timestamp
        }, { merge: true });

        res.status(200).json({ success: true, message: 'Visit recorded' });
    } catch (error) {
        console.error('Error recording hit:', error);
        res.status(500).json({ error: 'Failed to record visit' });
    }
});

/**
 * @route GET /api/analytics/public-stats
 * @desc Get simple visitor count (Public)
 */
router.get('/public-stats', async (req, res) => {
    try {
        const summaryRef = db.collection('analytics').doc('summary');
        const doc = await summaryRef.get();
        res.json({ totalVisits: doc.data()?.totalVisits || 0 });
    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ============================================
// DETAILED ANALYTICS ENDPOINTS
// ============================================

/**
 * @route GET /api/analytics/stats/summary
 * @desc Get summary statistics for a period
 * @query startDate, endDate (optional, defaults to last 30 days)
 */
router.get('/stats/summary', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate } = getDateRange(req);

        // Get all hits in the date range
        const hitsSnapshot = await db.collection('analytics_hits')
            .where('timestamp', '>=', startDate.toISOString())
            .where('timestamp', '<=', endDate.toISOString())
            .get();

        const totalVisits = hitsSnapshot.size;

        // Calculate daily stats
        const dailyStats = {};
        hitsSnapshot.forEach(doc => {
            const date = formatDate(doc.data().timestamp);
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });

        const dailyValues = Object.values(dailyStats);
        const averagePerDay = dailyValues.length > 0
            ? (totalVisits / dailyValues.length).toFixed(2)
            : 0;

        // Find peak day
        let peakDay = null;
        let maxCount = 0;
        Object.entries(dailyStats).forEach(([date, count]) => {
            if (count > maxCount) {
                maxCount = count;
                peakDay = { date, count };
            }
        });

        // Calculate growth (compare with previous period)
        const periodDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - periodDays);

        const previousHitsSnapshot = await db.collection('analytics_hits')
            .where('timestamp', '>=', previousStartDate.toISOString())
            .where('timestamp', '<', startDate.toISOString())
            .get();

        const previousVisits = previousHitsSnapshot.size;
        const growth = previousVisits > 0
            ? (((totalVisits - previousVisits) / previousVisits) * 100).toFixed(1)
            : 0;

        res.status(200).json({
            totalVisits,
            averagePerDay: parseFloat(averagePerDay),
            peakDay,
            growth: parseFloat(growth),
            period: {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate)
            }
        });
    } catch (error) {
        console.error('Error fetching summary stats:', error);
        res.status(500).json({ error: 'Failed to fetch summary statistics' });
    }
});

/**
 * @route GET /api/analytics/stats/daily
 * @desc Get daily visitor statistics
 * @query startDate, endDate (optional, defaults to last 30 days)
 */
router.get('/stats/daily', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate } = getDateRange(req);

        const hitsSnapshot = await db.collection('analytics_hits')
            .where('timestamp', '>=', startDate.toISOString())
            .where('timestamp', '<=', endDate.toISOString())
            .get();

        // Aggregate by day
        const dailyStats = {};
        hitsSnapshot.forEach(doc => {
            const date = formatDate(doc.data().timestamp);
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });

        // Convert to array and sort by date
        const data = Object.entries(dailyStats)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching daily stats:', error);
        res.status(500).json({ error: 'Failed to fetch daily statistics' });
    }
});

/**
 * @route GET /api/analytics/stats/monthly
 * @desc Get monthly visitor statistics
 * @query year (optional, defaults to current year)
 */
router.get('/stats/monthly', verifyToken, async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const hitsSnapshot = await db.collection('analytics_hits')
            .where('timestamp', '>=', startDate.toISOString())
            .where('timestamp', '<=', endDate.toISOString())
            .get();

        // Aggregate by month
        const monthlyStats = {};
        hitsSnapshot.forEach(doc => {
            const date = new Date(doc.data().timestamp);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyStats[month] = (monthlyStats[month] || 0) + 1;
        });

        // Convert to array and sort by month
        const data = Object.entries(monthlyStats)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));

        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching monthly stats:', error);
        res.status(500).json({ error: 'Failed to fetch monthly statistics' });
    }
});

/**
 * @route GET /api/analytics/stats/by-weekday
 * @desc Get visitor statistics by day of the week
 * @query startDate, endDate (optional, defaults to last 30 days)
 */
router.get('/stats/by-weekday', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate } = getDateRange(req);

        const hitsSnapshot = await db.collection('analytics_hits')
            .where('timestamp', '>=', startDate.toISOString())
            .where('timestamp', '<=', endDate.toISOString())
            .get();

        // Aggregate by weekday
        const weekdayStats = {
            'Lundi': 0,
            'Mardi': 0,
            'Mercredi': 0,
            'Jeudi': 0,
            'Vendredi': 0,
            'Samedi': 0,
            'Dimanche': 0
        };

        const weekdayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        hitsSnapshot.forEach(doc => {
            const date = new Date(doc.data().timestamp);
            const weekday = weekdayNames[date.getDay()];
            weekdayStats[weekday]++;
        });

        // Convert to array
        const data = Object.entries(weekdayStats)
            .map(([weekday, count]) => ({ weekday, count }));

        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching weekday stats:', error);
        res.status(500).json({ error: 'Failed to fetch weekday statistics' });
    }
});

/**
 * @route GET /api/analytics/stats
 * @desc Get simple visitor statistics (Fallback)
 */
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('analytics').orderBy('timestamp', 'desc').get();
        const visits = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null
        }));

        res.status(200).json({
            totalVisits: visits.length,
            recentVisits: visits.slice(0, 50) // Return last 50 visits for detail
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch visitor statistics' });
    }
});

/**
 * @route POST /api/analytics/reset
 * @desc Reset visitor counter (admin only)
 */
router.post('/reset', verifyToken, async (req, res) => {
    try {
        const summaryRef = db.collection('analytics').doc('summary');
        await summaryRef.set({
            totalVisits: 0,
            lastReset: new Date().toISOString()
        }, { merge: true });

        res.status(200).json({ success: true, message: 'Visitor counter reset successfully' });
    } catch (error) {
        console.error('Error resetting counter:', error);
        res.status(500).json({ error: 'Failed to reset visitor counter' });
    }
});

/**
 * Helper function to format date as YYYY-MM-DD
 */
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Helper function to get start and end dates from query params
 */
function getDateRange(req) {
    const now = new Date();
    let startDate, endDate;

    if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate);
        endDate = new Date(req.query.endDate);
    } else {
        // Default: last 30 days
        endDate = now;
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
    }

    return { startDate, endDate };
}

module.exports = router;

