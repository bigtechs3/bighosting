const express = require('express');
const router = express.Router();
const PLANS = require('../config/plans');
const { generateUsername } = require('../utils/password');
const { createUser, createServer, getAllocations, saveServerToDb, saveUserToDb, CONSTANT_PASSWORD } = require('../services/pterodactyl');
const { createPayment } = require('../services/sonicpesa');

const PTERO_PANEL = process.env.PTERO_PANEL;

router.post('/', async (req, res) => {
    try {
        const { phone, planId, quantity = 1 } = req.body;

        if (!phone || !planId) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }

        const qty = parseInt(quantity);
        if (qty < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }

        const plan = PLANS[planId];
        if (!plan) {
            return res.status(400).json({ success: false, message: 'Invalid plan' });
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const username = generateUsername(phone);
        const email = `${cleanPhone}@bighosting.user`;
        const password = CONSTANT_PASSWORD;
        const totalPrice = plan.price * qty;

        const payment = await createPayment(cleanPhone, totalPrice, email, username);
        if (!payment.success) {
            return res.status(400).json({ success: false, message: payment.message });
        }

        const userResult = await createUser(username, email);
        if (!userResult.success) {
            return res.status(500).json({ success: false, message: userResult.error });
        }

        const serverResults = [];
        for (let i = 0; i < qty; i++) {
            const serverName = `bighosting-${username}-${i+1}`;
            const description = `${plan.name} (${i+1}/${qty}) – ${username} @ ${new Date().toLocaleDateString()}`;
            const serverResult = await createServer(userResult.userId, plan, serverName, description);
            if (!serverResult.success) {
                return res.status(500).json({ success: false, message: serverResult.error });
            }

            const allocs = await getAllocations(serverResult.serverId);
            let ip = 'N/A', port = 'N/A';
            if (allocs.success && allocs.allocations.length > 0) {
                ip = allocs.allocations[0]?.attributes?.ip || 'N/A';
                port = allocs.allocations[0]?.attributes?.port || 'N/A';
            }

            const serverData = {
                serverId: serverResult.serverId,
                plan: plan.name,
                username: username,
                password: CONSTANT_PASSWORD,
                phone: cleanPhone,
                ip: ip,
                port: port,
                panelUrl: `${PTERO_PANEL}/server/${serverResult.serverId}`,
                createdAt: new Date().toISOString(),
                status: 'active'
            };
            saveServerToDb(serverData);

            serverResults.push({
                serverId: serverResult.serverId,
                panelUrl: `${PTERO_PANEL}/server/${serverResult.serverId}`,
                ip,
                port
            });
        }

        saveUserToDb({
            phone: cleanPhone,
            email,
            username,
            plan: plan.name,
            serverId: serverResults[0].serverId
        });

        res.json({
            success: true,
            credentials: {
                username: username,
                password: CONSTANT_PASSWORD,
                email: email,
                panelUrl: serverResults[0].panelUrl,
                ip: serverResults[0].ip,
                port: serverResults[0].port,
                serverId: serverResults[0].serverId,
                totalServers: qty
            },
            payment: {
                orderId: payment.orderId,
                status: payment.status,
                amount: totalPrice,
                quantity: qty
            }
        });

    } catch (error) {
        console.error('[Purchase] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server creation failed' });
    }
});

module.exports = router;