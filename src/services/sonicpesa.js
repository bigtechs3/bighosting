const axios = require('axios');

const SONICPESA_API_KEY = process.env.SONICPESA_API_KEY;
const SONICPESA_URL = 'https://api.sonicpesa.com/api/v1/payment/create_order';

// ─── Create Payment ───
async function createPayment(phone, amount, email, name) {
    try {
        const cleanPhone = phone.replace(/\D/g, '');

        const response = await axios.post(
            SONICPESA_URL,
            {
                buyer_email: email || `${cleanPhone}@bighosting.user`,
                buyer_name: name || `User ${cleanPhone.slice(-4)}`,
                buyer_phone: cleanPhone,
                amount: parseInt(amount),
                currency: 'TZS'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': SONICPESA_API_KEY
                },
                timeout: 45000
            }
        );

        if (response.data?.status === 'success') {
            return {
                success: true,
                orderId: response.data.data?.order_id,
                reference: response.data.data?.reference,
                status: response.data.data?.status,
                data: response.data.data
            };
        } else {
            return {
                success: false,
                message: response.data?.message || 'Payment initiation failed'
            };
        }
    } catch (error) {
        console.error('[SonicPesa] Error:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Payment gateway error'
        };
    }
}

module.exports = { createPayment };