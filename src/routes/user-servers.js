const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const phone = req.query.phone;
        if (!phone) {
            return res.json({ success: false, message: 'Phone number required' });
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const dbPath = path.join(__dirname, '../../database/servers.json');
        
        if (!fs.existsSync(dbPath)) {
            return res.json({ success: true, servers: [] });
        }

        const servers = JSON.parse(fs.readFileSync(dbPath));
        const userServers = servers.filter(s => s.phone === cleanPhone || s.username.includes(cleanPhone.slice(-6)));

        res.json({ success: true, servers: userServers });

    } catch (error) {
        console.error('[User Servers] Error:', error);
        res.json({ success: false, message: error.message });
    }
});

module.exports = router;