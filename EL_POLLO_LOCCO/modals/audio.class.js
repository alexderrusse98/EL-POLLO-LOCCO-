class Audios {
    sounds = {
        // Game
        backgroundMusic: new Audio('./audios/background.mp3'),
        winSound: new Audio('./audios/win.mp3'),
        gameOverSound: new Audio('./audios/gamOover.mp3'),

        // Chicken
        chickenHurtSound: new Audio('./audios/angry-chicken-imitation.mp3'),
        bossChickenStartSound: new Audio('./audios/bossChickenStart.mp3'),
        bossChickenHurtSound: new Audio('./audios/hurtChickenBoss.mp3'),
        bossChickenAttackSound: new Audio(''),
        chickenDeadSound: new Audio('./audios/chickenDead.mp3'),

        // Items
        coinSound: new Audio('./audios/collectCoints.mp3'),
        takeBottleSound: new Audio('./audios/pickBottle.mp3'),

        throw: new Audio('./audios/thorwBottle.mp3'),
        brockenBottleSound: new Audio('./audios/splash_bottle.mp3'),
        // Character
        jumpSound: new Audio('./audios/jump.mp3'),
        longIdleSound: new Audio('./audios/longIdle.mp3'),
        characterHurtSound: new Audio('./audios/cartoonScream.mp3'),
        characterDeadSound: new Audio('./audios/ohYes.mp3'),

    };


    isMuted = false;

    constructor() {
        // background music
        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.volume = 0.3;
        // other sounds volume
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'backgroundMusic') {
                this.sounds[key].volume = 0.5;
            }
        });
    }


    playSound(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            let sound = this.sounds[soundName].cloneNode();
            sound.volume = this.sounds[soundName].volume;
            sound.play().catch(e => console.warn(`Error playing sound`, e));
        }
    }

    playBackgroundMusic() {
        if (!this.isMuted) {
            this.sounds.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
        }
    }

    stopBackgroundMusic() {
        this.sounds.backgroundMusic.pause();
        this.sounds.backgroundMusic.currentTime = 0;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.sounds.backgroundMusic.pause();
        } else {
            this.sounds.backgroundMusic.play();
        }

        return this.isMuted;
    }
}