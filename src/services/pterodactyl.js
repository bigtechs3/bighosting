const CONSTANT_PASSWORD = "@datmanj@9";

// ─── Create User ───
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
                password: CONSTANT_PASSWORD  // ← Constant password
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