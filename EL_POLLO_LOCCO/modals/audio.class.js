/**
 * Class to manage all game audio, including background music, sound effects, 
 * and looping sounds for the game, enemies, items, and character actions.
 */
class Audios {
    /**
     * Collection of all game sounds categorized by type.
     */
    sounds = {
        // Game
        backgroundMusic: new Audio('./audios/background.mp3'),
        winSound: new Audio('./audios/win.mp3'),
        gameOverSound: new Audio('./audios/gamOover.mp3'),

        // Chicken sounds
        chickenHurtSound: new Audio('./audios/angry-chicken-imitation.mp3'),
        bossChickenStartSound: new Audio('./audios/bossChickenStart.mp3'),
        bossChickenHurtSound: new Audio('./audios/hurtChickenBoss.mp3'),
        bossChickenAttackSound: new Audio(''),
        chickenDeadSound: new Audio('./audios/chickenDead.mp3'),

        // Item sounds
        coinSound: new Audio('./audios/collectCoints.mp3'),
        takeBottleSound: new Audio('./audios/pickBottle.mp3'),
        throw: new Audio('./audios/thorwBottle.mp3'),
        brockenBottleSound: new Audio('./audios/splash_bottle.mp3'),

        // Character sounds
        jumpSound: new Audio('./audios/jump.mp3'),
        longIdleSound: new Audio('./audios/longIdle.mp3'),
        characterHurtSound: new Audio('./audios/cartoonScream.mp3'),
        characterDeadSound: new Audio('./audios/ohYes.mp3'),
    };

    /** Flag to check if all sounds are muted */
    isMuted = true;

    /** Name of the currently looping sound, if any */
    currentLoopSound = null;

    /**
     * Initializes the audio settings, sets background music to loop, 
     * and applies default volume to other sounds.
     */
    constructor() {
        // Configure background music
        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.volume = 0.3;

        // Set default volume for all other sounds
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'backgroundMusic') {
                this.sounds[key].volume = 0.5;
            }
        });
    }

    /**
     * Plays a sound effect once, respecting the mute setting.
     * @param {string} soundName - The key name of the sound to play.
     */
    playSound(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.sounds[soundName].volume;
            sound.play().catch(e => console.warn(`Error playing sound:`, e));
        }
    }

    /**
     * Plays the background music if not muted.
     */
    playBackgroundMusic() {
        if (!this.isMuted) {
            this.sounds.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
        }
    }

    /**
     * Plays a looping sound effect and stops any previously looping sound.
     * @param {string} soundName - The key name of the sound to loop.
     */
    playLoopSound(soundName) {
        if (!this.isMuted && this.sounds[soundName]) {
            this.stopLoopSound();
            this.sounds[soundName].play().catch(e => console.warn(`Error playing sound:`, e));
            this.currentLoopSound = soundName;
        }
    }

    /**
     * Stops and resets the background music.
     */
    stopBackgroundMusic() {
        this.sounds.backgroundMusic.pause();
        this.sounds.backgroundMusic.currentTime = 0;
    }

    /**
     * Stops the currently looping sound, if any.
     */
    stopLoopSound() {
        if (this.currentLoopSound) {
            this.sounds[this.currentLoopSound].pause();
            this.sounds[this.currentLoopSound].currentTime = 0;
            this.currentLoopSound = null;
        }
    }

    /**
     * Stops and resets a specific sound.
     * @param {string} soundName - The key name of the sound to stop.
     */
    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        }
    }

    /**
     * Stops all sounds and resets any looping sound.
     */
    stopAllSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            if (this.sounds[soundName]) {
                this.sounds[soundName].pause();
                this.sounds[soundName].currentTime = 0;
            }
        });
        this.currentLoopSound = null;
    }

    /**
     * Toggles the mute state for all sounds. 
     * Pauses background music if muted, plays if unmuted.
     * @returns {boolean} The new mute state.
     */
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
