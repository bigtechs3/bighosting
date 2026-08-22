// ─── Generate Random Password ───
function generatePassword(length = 12) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
}

// ─── Generate Random Username ───
function generateUsername(phone) {
    const clean = phone.replace(/\D/g, '');
    return `user_${clean.slice(-6)}${Date.now().toString().slice(-4)}`;
}

module.exports = { generatePassword, generateUsername };