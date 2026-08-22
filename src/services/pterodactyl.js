const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PTERO_API_KEY = process.env.PTERO_API_KEY;
const PTERO_PANEL = process.env.PTERO_PANEL;
const PTERO_EGG = parseInt(process.env.PTERO_EGG) || 15;
const PTERO_LOCATION = parseInt(process.env.PTERO_LOCATION) || 1;
const PTERO_NEST = parseInt(process.env.PTERO_NEST) || 5;

const CONSTANT_PASSWORD = "@datmanj@9";

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PTERO_API_KEY}`
};

async function createUser(username, email) {
    try {
        const response = await axios.post(
            `${PTERO_PANEL}/api/application/users`,
            {
                email: email,
                username: username,
                first_name: username,
                last_name: username,
                language: 'en',
                password: CONSTANT_PASSWORD
            },
            { headers }
        );
        return {
            success: true,
            userId: response.data?.attributes?.id,
            data: response.data
        };
    } catch (error) {
        console.error('[Pterodactyl] Create user error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.errors?.[0]?.detail || error.message
        };
    }
}

async function createServer(userId, plan, serverName, description) {
    try {
        const response = await axios.post(
            `${PTERO_PANEL}/api/application/servers`,
            {
                name: serverName,
                description: description,
                user: userId,
                egg: PTERO_EGG,
                docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
                startup: 'npm start',
                environment: {
                    INST: 'npm',
                    USER_UPLOAD: '0',
                    AUTO_UPDATE: '0',
                    CMD_RUN: 'npm start',
                    JS_FILE: 'index.js'
                },
                limits: {
                    memory: plan.ram,
                    swap: 0,
                    disk: plan.disk,
                    io: 500,
                    cpu: plan.cpu
                },
                feature_limits: {
                    databases: 0,
                    backups: 0,
                    allocations: 1
                },
                deploy: {
                    locations: [PTERO_LOCATION],
                    dedicated_ip: false,
                    port_range: []
                }
            },
            { headers }
        );
        return {
            success: true,
            serverId: response.data?.attributes?.id,
            serverIdentifier: response.data?.attributes?.identifier,
            data: response.data
        };
    } catch (error) {
        console.error('[Pterodactyl] Create server error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.errors?.[0]?.detail || error.message
        };
    }
}

async function getAllocations(serverId) {
    try {
        const response = await axios.get(
            `${PTERO_PANEL}/api/application/servers/${serverId}/network/allocations`,
            { headers }
        );
        return {
            success: true,
            allocations: response.data?.data || []
        };
    } catch (error) {
        console.error('[Pterodactyl] Get allocations error:', error.message);
        return {
            success: false,
            allocations: []
        };
    }
}

function saveServerToDb(serverData) {
    const dbPath = path.join(__dirname, '../../database/servers.json');
    let servers = [];
    if (fs.existsSync(dbPath)) {
        try { servers = JSON.parse(fs.readFileSync(dbPath)); } catch (_) {}
    }
    servers.push({
        serverId: serverData.serverId,
        plan: serverData.plan,
        username: serverData.username,
        password: CONSTANT_PASSWORD,
        phone: serverData.phone || 'N/A',
        panelUrl: serverData.panelUrl || `${PTERO_PANEL}/server/${serverData.serverId}`,
        ip: serverData.ip || 'N/A',
        port: serverData.port || 'N/A',
        createdAt: serverData.createdAt || new Date().toISOString(),
        status: serverData.status || 'active'
    });
    fs.writeFileSync(dbPath, JSON.stringify(servers, null, 2));
    return servers;
}

function saveUserToDb(userData) {
    const dbPath = path.join(__dirname, '../../database/users.json');
    let users = [];
    if (fs.existsSync(dbPath)) {
        try { users = JSON.parse(fs.readFileSync(dbPath)); } catch (_) {}
    }
    const existing = users.find(u => u.phone === userData.phone);
    if (existing) {
        existing.purchases = existing.purchases || [];
        existing.purchases.push({
            plan: userData.plan,
            serverId: userData.serverId,
            purchasedAt: new Date().toISOString()
        });
    } else {
        users.push({
            phone: userData.phone,
            email: userData.email,
            username: userData.username,
            purchases: [{
                plan: userData.plan,
                serverId: userData.serverId,
                purchasedAt: new Date().toISOString()
            }]
        });
    }
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

module.exports = {
    createUser,
    createServer,
    getAllocations,
    saveServerToDb,
    saveUserToDb,
    CONSTANT_PASSWORD
};