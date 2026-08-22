const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        data
    };
    const logFile = path.join(logDir, `${level.toLowerCase()}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    console.log(`[${level}] ${message}`);
}

function info(message, data) { log('INFO', message, data); }
function error(message, data) { log('ERROR', message, data); }
function warn(message, data) { log('WARN', message, data); }

module.exports = { info, error, warn };