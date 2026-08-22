const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        console.log('[Webhook] Received:', JSON.stringify(data, null, 2));

        // ─── Save transaction ───
        const dbPath = path.join(__dirname, '../../database/transactions.json');
        let transactions = [];
        if (fs.existsSync(dbPath)) {
            transactions = JSON.parse(fs.readFileSync(dbPath));
        }
        transactions.push({
            ...data,
            receivedAt: new Date().toISOString()
        });
        fs.writeFileSync(dbPath, JSON.stringify(transactions, null, 2));

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('[Webhook] Error:', error);
        res.status(500).json({ error: 'Webhook error' });
    }
});

module.exports = router;