// ─── Phone validation (Tanzania) ───
function isValidPhone(phone) {
    const clean = phone.replace(/\D/g, '');
    return /^255[0-9]{9}$/.test(clean);
}

// ─── Validate amount ───
function isValidAmount(amount) {
    const num = parseInt(amount);
    return !isNaN(num) && num >= 1;
}

// ─── Validate plan ID ───
function isValidPlanId(id, plans) {
    return plans.hasOwnProperty(id);
}

module.exports = { isValidPhone, isValidAmount, isValidPlanId };