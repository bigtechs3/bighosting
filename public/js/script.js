// ─── Plan Data with Colors ───
const plans = [
    { id: 1, name: "2 GB", price: 1500, ram: "2GB", disk: "20GB", cpu: "100%", color: "#90A4AE", icon: "🪙", medal: "" },
    { id: 2, name: "3 GB", price: 3000, ram: "3GB", disk: "30GB", cpu: "150%", color: "#78909C", icon: "🪙", medal: "" },
    { id: 3, name: "4 GB", price: 4500, ram: "4GB", disk: "40GB", cpu: "150%", color: "#607D8B", icon: "🪙", medal: "" },
    { id: 4, name: "5 GB", price: 6000, ram: "5GB", disk: "50GB", cpu: "200%", color: "#546E7A", icon: "🪙", medal: "" },
    { id: 5, name: "6 GB", price: 7500, ram: "6GB", disk: "60GB", cpu: "200%", color: "#455A64", icon: "🪙", medal: "" },
    { id: 6, name: "7 GB", price: 9000, ram: "7GB", disk: "70GB", cpu: "250%", color: "#37474F", icon: "🪙", medal: "" },
    { id: 7, name: "8 GB", price: 10500, ram: "8GB", disk: "80GB", cpu: "250%", color: "#4DD0E1", icon: "🪙", medal: "" },
    { id: 8, name: "9 GB", price: 12000, ram: "9GB", disk: "90GB", cpu: "300%", color: "#CD7F32", icon: "🥉", medal: "🥉" },
    { id: 9, name: "10 GB", price: 13500, ram: "10GB", disk: "100GB", cpu: "300%", color: "#C0C0C0", icon: "🥈", medal: "🥈" },
    { id: 10, name: "Unlimited", price: 15000, ram: "16GB+", disk: "200GB+", cpu: "400%", color: "#FFD700", icon: "🥇", medal: "🥇" }
];

const CONSTANT_PASSWORD = "@datmanj@9";

// ─── State ───
let selectedPlanId = null;
let currentScreen = 'start';

// ─── DOM Elements ───
const screenStart = document.getElementById('screenStart');
const screenLoading = document.getElementById('screenLoading');
const screenPlans = document.getElementById('screenPlans');
const screenProcessing = document.getElementById('screenProcessing');
const screenSuccess = document.getElementById('screenSuccess');
const progressFill = document.getElementById('progressFill');
const loadingText = document.getElementById('loadingText');

// ─── Show Screen ───
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    currentScreen = screenId;
}

// ─── Start Journey ───
function startJourney() {
    if (typeof playClick === 'function') playClick();
    showScreen('screenLoading');
    startLoading();
}

// ─── Loading Animation ───
function startLoading() {
    let progress = 0;
    const messages = [
        'Initializing system...',
        'Connecting to servers...',
        'Loading packages...',
        'Preparing your experience...',
        'Almost there...',
        'Welcome to bighosting! 🚀'
    ];

    const interval = setInterval(() => {
        progress += 2;
        if (progress > 100) {
            clearInterval(interval);
            setTimeout(() => {
                showScreen('screenPlans');
                renderPlans();
                if (typeof playSuccess === 'function') playSuccess();
            }, 500);
            return;
        }
        progressFill.style.width = progress + '%';
        const msgIndex = Math.min(Math.floor(progress / 17), messages.length - 1);
        loadingText.textContent = messages[msgIndex];
    }, 60);
}

// ─── Render Plans ───
function renderPlans() {
    const grid = document.getElementById('planGrid');
    grid.innerHTML = '';
    plans.forEach(p => {
        const card = document.createElement('div');
        card.className = 'plan-card';
        card.dataset.id = p.id;
        card.style.borderColor = p.color;
        card.innerHTML = `
            <div class="plan-medal">${p.medal || '🪙'}</div>
            <h3 style="color: ${p.color};">${p.name}</h3>
            <p style="color: ${p.color};">RAM: ${p.ram}</p>
            <p>Disk: ${p.disk}</p>
            <p>CPU: ${p.cpu}</p>
            <p class="price" style="color: ${p.color};">${p.price.toLocaleString()} TZS</p>
        `;
        card.onclick = () => selectPlan(p.id);
        grid.appendChild(card);
    });

    // ─── Populate Dropdown ───
    const select = document.getElementById('planSelect');
    select.innerHTML = '<option value="">Select a plan...</option>';
    plans.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} – ${p.price.toLocaleString()} TZS`;
        opt.style.color = p.color;
        select.appendChild(opt);
    });
}

// ─── Select Plan ───
function selectPlan(id) {
    selectedPlanId = id;
    document.querySelectorAll('.plan-card').forEach(el => {
        el.classList.toggle('selected', parseInt(el.dataset.id) === id);
    });
    document.getElementById('planSelect').value = id;
    if (typeof playClick === 'function') playClick();
}

// ─── Form Submission ───
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('purchaseForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const phone = document.getElementById('phone').value.trim();
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const planId = parseInt(document.getElementById('planSelect').value);

            if (!phone || !planId) {
                alert('Please fill in all fields!');
                return;
            }

            if (!/^255[0-9]{9}$/.test(phone)) {
                alert('Enter a valid Tanzania number (e.g., 255XXXXXXXXX)');
                return;
            }

            if (quantity < 1) {
                alert('Quantity must be at least 1');
                return;
            }

            const plan = plans.find(p => p.id === planId);
            if (!plan) { alert('Invalid plan'); return; }

            // ─── UI: Show Processing ───
            showScreen('screenProcessing');
            if (typeof playClick === 'function') playClick();

            try {
                const totalPrice = plan.price * quantity;
                const res = await fetch('/api/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone,
                        planId: plan.id,
                        quantity,
                        totalPrice
                    })
                });

                const data = await res.json();
                if (!data.success) throw new Error(data.message || 'Purchase failed');

                // ─── Populate Credentials ───
                document.getElementById('srvUser').textContent = data.credentials.username;
                document.getElementById('srvPass').textContent = CONSTANT_PASSWORD;
                document.getElementById('srvEmail').textContent = data.credentials.email;
                document.getElementById('srvPanel').textContent = data.credentials.panelUrl;
                document.getElementById('srvLink').href = data.credentials.panelUrl;

                // ─── Show Success ───
                showScreen('screenSuccess');
                if (typeof playSuccess === 'function') playSuccess();
                launchConfetti();

            } catch (err) {
                alert(`❌ Error: ${err.message}`);
                showScreen('screenPlans');
            }
        });
    }
});

// ─── Reset Purchase ───
function resetPurchase() {
    showScreen('screenPlans');
    document.getElementById('phone').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('planSelect').value = '';
    document.querySelectorAll('.plan-card').forEach(el => el.classList.remove('selected'));
    removeConfetti();
}
window.resetPurchase = resetPurchase;

// ─── Confetti ───
function launchConfetti() {
    const colors = ['#e74c3c', '#1a5276', '#2e86c1', '#888', '#c0392b', '#154360', '#FFD700', '#C0C0C0'];
    for (let i = 0; i < 120; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = Math.random() * 10 + 6 + 'px';
        piece.style.height = Math.random() * 8 + 4 + 'px';
        piece.style.animationDuration = Math.random() * 3 + 2 + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.position = 'fixed';
        piece.style.top = '-10px';
        piece.style.zIndex = '9999';
        piece.style.pointerEvents = 'none';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
    }
}

function removeConfetti() {
    document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
}