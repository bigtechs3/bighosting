// ─── NEON MATRIX RAIN (Black background, Grey/Black/Red) ───
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
    // Black background with slight trail
    mctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    mctx.font = `${fontSize}px 'Courier New', monospace`;
    mctx.textAlign = 'center';

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize + fontSize / 2;

        // Colors: Grey, Black (almost dark), Red accents
        const rand = Math.random();
        let r, g, b;
        if (rand < 0.05) {
            // Red accent
            r = 200 + Math.random() * 55;
            g = 20 + Math.random() * 20;
            b = 20 + Math.random() * 20;
        } else if (rand < 0.3) {
            // Dark grey / almost black
            const dark = 30 + Math.random() * 40;
            r = dark;
            g = dark;
            b = dark + 10;
        } else {
            // Grey
            const grey = 100 + Math.random() * 100;
            r = grey;
            g = grey - 10;
            b = grey - 20;
        }

        const brightness = 0.5 + Math.random() * 0.5;
        mctx.shadowColor = `rgba(100, 100, 100, ${0.2 * brightness})`;
        mctx.shadowBlur = 10;
        mctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.6 + 0.4 * brightness})`;
        mctx.fillText(char, x, y);
        mctx.shadowBlur = 0;

        if (y > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);