const express = require('express');
const router = express.Router();
const PLANS = require('../config/plans');
const { generatePassword, generateUsername } = require('../utils/password');
const { createUser, createServer, getAllocations, saveServerToDb } = require('../services/pterodactyl');
const { createPayment } = require('../services/sonicpesa');

router.post('/', async (req, res) => {
    try {
        const { phone, planId } = req.body;

        if (!phone || !planId) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }

        const plan = PLANS[planId];
        if (!plan) {
            return res.status(400).json({ success: false, message: 'Invalid plan' });
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const username = generateUsername(phone);
        const email = `${cleanPhone}@bighosting.user`;
        const password = generatePassword(12);
        const serverName = `bighosting-${username}`;
        const description = `${plan.name} – ${username} @ ${new Date().toLocaleDateString()}`;

        // ─── 1. Create Payment ───
        const payment = await createPayment(cleanPhone, plan.price, email, username);
        if (!payment.success) {
            return res.status(400).json({ success: false, message: payment.message });
        }

        // ─── 2. Create Pterodactyl User ───
        const userResult = await createUser(username, email, password);
        if (!userResult.success) {
            return res.status(500).json({ success: false, message: userResult.error });
        }

        // ─── 3. Create Pterodactyl Server ───
        const serverResult = await createServer(userResult.userId, plan, serverName, description);
        if (!serverResult.success) {
            return res.status(500).json({ success: false, message: serverResult.error });
        }

        // ─── 4. Get Allocations ───
        const allocs = await getAllocations(serverResult.serverId);
        let ip = 'N/A', port = 'N/A';
        if (allocs.success && allocs.allocations.length > 0) {
            ip = allocs.allocations[0]?.attributes?.ip || 'N/A';
            port = allocs.allocations[0]?.attributes?.port || 'N/A';
        }

        // ─── 5. Save to Database ───
        const serverData = {
            serverId: serverResult.serverId,
            plan: plan.name,
            username: username,
            password: password,
            ip: ip,
            port: port
        };
        saveServerToDb(serverData);

        // ─── 6. Response ───
        res.json({
            success: true,
            credentials: {
                username: username,
                password: password,
                panelUrl: `${process.env.PTERO_PANEL}/server/${serverResult.serverId}`,
                ip: ip,
                port: port,
                serverId: serverResult.serverId
            },
            payment: {
                orderId: payment.orderId,
                status: payment.status
            }
        });

    } catch (error) {
        console.error('[Purchase] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server creation failed' });
    }
});

module.exports = router;