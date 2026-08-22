// ─── MATRIX RAIN (Deep Blue / Grey / Red) ───
const matrixCanvas = document.getElementById('matrixCanvas');
const mctx = matrixCanvas.getContext('2d');

const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&£¢€¥π×∆✓°¢^~+{$$:#+#&$#(✓¢=%";
const chars = symbols.split('');

let drops = [];
const fontSize = 20;
let columns;

function resizeMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    columns = Math.floor(matrixCanvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

function drawMatrix() {
    mctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
    mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    mctx.font = `${fontSize}px 'Courier New', monospace`;
    mctx.textAlign = 'center';

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize + fontSize / 2;

        // Mix of deep blue, grey, and occasional red
        const rand = Math.random();
        let r, g, b;
        if (rand < 0.05) {
            // Red accent
            r = 200 + Math.random() * 55;
            g = 30 + Math.random() * 30;
            b = 30 + Math.random() * 30;
        } else if (rand < 0.4) {
            // Deep blue
            r = 20 + Math.random() * 40;
            g = 60 + Math.random() * 60;
            b = 120 + Math.random() * 80;
        } else {
            // Grey
            const grey = 120 + Math.random() * 80;
            r = grey;
            g = grey - 10;
            b = grey - 20;
        }

        const brightness = 0.6 + Math.random() * 0.4;
        mctx.shadowColor = `rgba(26, 82, 118, ${0.3 * brightness})`;
        mctx.shadowBlur = 15;
        mctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.7 + 0.3 * brightness})`;
        mctx.fillText(char, x, y);
        mctx.shadowBlur = 0;

        if (y > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);