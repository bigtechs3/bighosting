// ─── Plan Data ───
const plans = [
    { id: 1, name: "1GB Server", price: 1500 },
    { id: 2, name: "2GB Server", price: 3000 },
    { id: 3, name: "3GB Server", price: 4500 },
    { id: 4, name: "4GB Server", price: 6000 },
    { id: 5, name: "5GB Server", price: 7500 },
    { id: 6, name: "6GB Server", price: 9000 },
    { id: 7, name: "7GB Server", price: 10500 },
    { id: 8, name: "8GB Server", price: 12000 },
    { id: 9, name: "9GB Server", price: 13500 },
    { id: 10, name: "10GB Server", price: 15000 },
    { id: 11, name: "Unlimited", price: 25000 }
];

let selectedPlanId = null;

// ─── Render Plans ───
const grid = document.getElementById('planGrid');
if (grid) {
    plans.forEach(p => {
        const card = document.createElement('div');
        card.className = 'plan-card';
        card.dataset.id = p.id;
        card.innerHTML = `
            <h3>${p.name}</h3>
            <p>RAM: ${p.ram || (p.id === 11 ? '16GB' : `${p.id}GB`)}</p>
            <p class="price">${p.price.toLocaleString()} TZS</p>
        `;
        card.onclick = () => selectPlan(p.id);
        grid.appendChild(card);
    });
}

// ─── Populate Select ───
const select = document.getElementById('plan');
if (select) {
    plans.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} – ${p.price.toLocaleString()} TZS`;
        select.appendChild(opt);
    });
}

// ─── Select Plan ───
function selectPlan(id) {
    selectedPlanId = id;
    document.querySelectorAll('.plan-card').forEach(el => {
        el.classList.toggle('selected', parseInt(el.dataset.id) === id);
    });
    if (select) select.value = id;
    playClick();
}

// ─── DOM ───
const form = document.getElementById('purchaseForm');
const orderForm = document.getElementById('orderForm');
const processing = document.getElementById('processing');
const success = document.getElementById('success');

// ─── Purchase Handler ───
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = document.getElementById('phone').value.trim();
        const planId = parseInt(select.value);

        if (!phone || !planId) {
            alert('Please fill in all fields!');
            return;
        }

        if (!/^255[0-9]{9}$/.test(phone)) {
            alert('Enter a valid Tanzania number (e.g., 255XXXXXXXXX)');
            return;
        }

        const plan = plans.find(p => p.id === planId);
        if (!plan) { alert('Invalid plan'); return; }

        orderForm.style.display = 'none';
        processing.style.display = 'block';
        success.style.display = 'none';

        try {
            const res = await fetch('/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, planId: plan.id })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Purchase failed');

            // Show credentials
            document.getElementById('srvUser').textContent = data.credentials.username;
            document.getElementById('srvPass').textContent = data.credentials.password;
            document.getElementById('srvPanel').textContent = data.credentials.panelUrl;
            document.getElementById('srvLink').href = data.credentials.panelUrl;

            processing.style.display = 'none';
            success.style.display = 'block';
            playSuccess();

            // Confetti
            launchConfetti();

        } catch (err) {
            alert(`❌ Error: ${err.message}`);
            orderForm.style.display = 'block';
            processing.style.display = 'none';
        }
    });
}

// ─── Reset ───
function resetPurchase() {
    success.style.display = 'none';
    orderForm.style.display = 'block';
    document.getElementById('phone').value = '';
    select.value = '';
    document.querySelectorAll('.plan-card').forEach(el => el.classList.remove('selected'));
    removeConfetti();
}
window.resetPurchase = resetPurchase;

// ─── Confetti ───
function launchConfetti() {
    const colors = ['#e74c3c', '#1a5276', '#2e86c1', '#888', '#c0392b', '#154360'];
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
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
    }
}

function removeConfetti() {
    document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
}