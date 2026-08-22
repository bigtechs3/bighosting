// ─── Purchase Handler (with success sound) ───
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

            // 🔊 Play success sound
            if (typeof playSuccess === 'function') {
                playSuccess();
            }

            // 🎉 Launch confetti
            launchConfetti();

        } catch (err) {
            alert(`❌ Error: ${err.message}`);
            orderForm.style.display = 'block';
            processing.style.display = 'none';
        }
    });
}