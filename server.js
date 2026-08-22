const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Ensure database directory exists ───
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// ─── Import Routes ───
const purchaseRoute = require('./src/routes/purchase');
const webhookRoute = require('./src/routes/webhook');
const statusRoute = require('./src/routes/status');

// ─── Routes ───
app.use('/api/purchase', purchaseRoute);
app.use('/api/webhook', webhookRoute);
app.use('/api/status', statusRoute);

// ─── Serve Frontend ───
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// ─── 404 Handler ───
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// ─── Start Server ───
app.listen(PORT, () => {
    console.log(`✅ bighosting running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});