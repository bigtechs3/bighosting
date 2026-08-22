const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    sonicpesa: {
        apiKey: process.env.SONICPESA_API_KEY,
        baseUrl: 'https://api.sonicpesa.com/api/v1/payment/create_order'
    },
    pterodactyl: {
        apiKey: process.env.PTERO_API_KEY,
        panel: process.env.PTERO_PANEL,
        egg: parseInt(process.env.PTERO_EGG) || 1,
        location: parseInt(process.env.PTERO_LOCATION) || 1,
        nest: parseInt(process.env.PTERO_NEST) || 5
    },
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    }
};