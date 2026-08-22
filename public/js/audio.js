// ─── Audio Controls ───
const clickSound = document.getElementById('clickSound');
const successSound = document.getElementById('successSound');

function playClick() {
    try {
        clickSound.currentTime = 0;
        clickSound.volume = 0.4;
        clickSound.play().catch(() => {});
    } catch (e) {}
}

function playSuccess() {
    try {
        successSound.currentTime = 0;
        successSound.volume = 0.5;
        successSound.play().catch(() => {});
    } catch (e) {}
}

// ─── Play click on plan card click ───
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', playClick);
    });
});