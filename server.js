const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// ─── Routes ───
const purchaseRoute = require('./src/routes/purchase');
const webhookRoute = require('./src/routes/webhook');
const statusRoute = require('./src/routes/status');
const userServersRoute = require('./src/routes/user-servers');

app.use('/api/purchase', purchaseRoute);
app.use('/api/webhook', webhookRoute);
app.use('/api/status', statusRoute);
app.use('/api/user-servers', userServersRoute);

// ─── Serve Frontend ───
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/loading.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loading.html'));
});

app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/plans.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'plans.html'));
});

app.get('/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`✅ bighosting running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});