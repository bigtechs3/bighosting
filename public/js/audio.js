// ─── Audio Controller ───
class AudioController {
    constructor() {
        this.bgMusic = document.getElementById('bgMusic');
        this.successSound = document.getElementById('successSound');
        this.clickSound = document.getElementById('clickSound');
        this.isMuted = false;
        this.isPlaying = false;
        this.bgVolume = 0.3;
        this.successVolume = 0.5;
        this.clickVolume = 0.4;
        
        this.init();
    }

    init() {
        // ─── Setup background music ───
        if (this.bgMusic) {
            this.bgMusic.volume = this.bgVolume;
            this.bgMusic.loop = true;
            
            // Try to autoplay (may be blocked by browser)
            this.bgMusic.play().catch(() => {
                console.log('Autoplay blocked – waiting for user interaction');
            });
        }

        // ─── Setup success sound ───
        if (this.successSound) {
            this.successSound.volume = this.successVolume;
            this.successSound.loop = false;
        }

        // ─── Setup click sound ───
        if (this.clickSound) {
            this.clickSound.volume = this.clickVolume;
            this.clickSound.loop = false;
        }

        // ─── Click anywhere to start audio (bypass autoplay block) ───
        document.addEventListener('click', () => this.startAudio(), { once: true });
        document.addEventListener('touchstart', () => this.startAudio(), { once: true });

        // ─── Create mute button ───
        this.createMuteButton();
    }

    startAudio() {
        if (!this.isPlaying && this.bgMusic) {
            this.bgMusic.play().catch(() => {});
            this.isPlaying = true;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgMusic) {
            this.bgMusic.volume = this.isMuted ? 0 : this.bgVolume;
        }
        // Update button icon
        const btn = document.getElementById('muteBtn');
        if (btn) {
            btn.innerHTML = this.isMuted ? '🔇' : '🔊';
            btn.title = this.isMuted ? 'Unmute' : 'Mute';
        }
    }

    createMuteButton() {
        const btn = document.createElement('button');
        btn.id = 'muteBtn';
        btn.className = 'mute-btn';
        btn.innerHTML = '🔊';
        btn.title = 'Mute';
        btn.onclick = () => this.toggleMute();
        document.body.appendChild(btn);

        // ─── Style the button ───
        const style = document.createElement('style');
        style.textContent = `
            .mute-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(10, 10, 15, 0.85);
                border: 2px solid #1a5276;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 24px;
                color: #2e86c1;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 30px rgba(26, 82, 118, 0.2);
            }
            .mute-btn:hover {
                transform: scale(1.1);
                border-color: #e74c3c;
                box-shadow: 0 0 40px rgba(26, 82, 118, 0.3);
            }
            @media (max-width: 480px) {
                .mute-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                    bottom: 15px;
                    right: 15px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    playSuccess() {
        if (this.successSound) {
            this.successSound.currentTime = 0;
            // Lower background volume temporarily
            if (this.bgMusic && !this.isMuted) {
                this.bgMusic.volume = 0.1;
                setTimeout(() => {
                    if (!this.isMuted) this.bgMusic.volume = this.bgVolume;
                }, 4000);
            }
            this.successSound.play().catch(() => {});
        }
    }

    playClick() {
        if (this.clickSound && !this.isMuted) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(() => {});
        }
    }
}

// ─── Initialize Audio ───
let audioController;

document.addEventListener('DOMContentLoaded', () => {
    audioController = new AudioController();
    
    // ─── Expose to global scope ───
    window.audioController = audioController;
    window.playSuccess = () => audioController.playSuccess();
    window.playClick = () => audioController.playClick();
    window.toggleMute = () => audioController.toggleMute();
});