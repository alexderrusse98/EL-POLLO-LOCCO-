/**
 * Class responsible for handling all character animations.
 * Separates animation logic from character movement logic.
 */
class CharacterAnimator {
    /**
     * @param {Character} character - Reference to the character object
     */
    constructor(character) {
        this.character = character;

        this.isJumpAnimationOn = false;
        this.isDeadAnimationOn = false;
        this.isIdleAnimationOn = false;
        this.isLongIdleAnimationOn = false;
        this.deathAnimationStarted = false;
    }

    /**
     * Main animation function called every animation frame.
     * Determines which animation to play based on character state.
     */
    animateCharacter() {
        if (this.character.isBouncing) {
            if (this.isJumpAnimationOn) {
                this.handleJumpEnd();
            }
            return;
        }

        if (this.character.isDead()) {
            this.animateDeath();
        } else if (this.character.isAboveGround() && this.isJumpAnimationOn) {
            this.animateJump();
        } else if (this.character.isHurt() && !this.character.isAboveGround()) {
            this.animateHurt();
        } else if (!this.character.isAboveGround()) {
            const kbd = this.character.world.keyboard;
            if (kbd.RIGHT || kbd.LEFT) {
                this.animateWalking();
            } else {
                this.handleResting();
            }
        }
    }

    /**
     * Handles the jump animation sequence
     */
    animateJump() {
        this.setJumpImage();
        this.handleJumpEnd();
    }

    /**
     * Updates the character image based on current jump frame
     */
    setJumpImage() {
        const frame = this.getJumpFrame();
        this.character.img = this.character.imageCache[
            this.character.IMAGES_JUMPING[frame]
        ];
    }

    /**
     * Determines which jump frame to use based on vertical speed
     */
    getJumpFrame() {
        const speed = this.character.speedY;

        if (speed > 25) return 0;
        if (speed > 24) return 1;
        if (speed > 23) return 2;
        if (speed > 10) return 3;
        if (speed > -1) return 4;
        if (speed > -15) return 5;
        if (speed > -20) return 6;
        if (speed > -25) return 7;
        return 8;
    }

    /**
     * Ends jump animation when landing
     */
    handleJumpEnd() {
        const frame = this.getJumpFrame();
        const landed = !this.character.isAboveGround() &&
            this.character.speedY <= 0;
        if (frame === 8 || landed) {
            this.isJumpAnimationOn = false;
        }
    }

    /**
     * Handles death animation sequence
     */
    animateDeath() {
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.isDeadAnimationOn = true;

            this.character.speedY = 0;
            this.deathSpeedX = 2;
        }

        this.setDeathImage();
        this.updateDeathPhysics();
    }

    /**
     * Sets character image to appropriate death frame
     */
    setDeathImage() {
        const frame = this.getDeathFrame();
        this.character.img = this.character.imageCache[
            this.character.IMAGES_DEAD[frame]
        ];
    }

    /**
     * Determines which death frame to show based on Y position
     */
    getDeathFrame() {
        const yPos = this.character.y;

        if (yPos < 140) return 0;
        if (yPos < 180) return 1;
        if (yPos < 220) return 2;
        if (yPos < 280) return 3;
        if (yPos < 350) return 4;
        if (yPos < 420) return 5;
        return 6;
    }

    /**
     * Updates physics for death animation (falling and sliding)
     * Manuelle Physik weil die normale Gravity hier nicht greift
     */
    updateDeathPhysics() {
        if (this.character.y < 500) {
            this.character.y += 2;
            this.character.x += 2;
        } else {
            this.character.y = 500;
        }
    }
    /** Plays hurt animation */
    animateHurt() {
        this.character.playAnimation(this.character.IMAGES_HURT);
    }

    /** Plays walking animation */
    animateWalking() {
        this.character.clearIdleIntervals();
        this.isIdleAnimationOn = false;
        this.isLongIdleAnimationOn = false;
        this.character.playAnimation(this.character.IMAGES_WALKING);
    }

    /**
    * Handles idle and long idle animations based on last movement time
    */
    handleResting() {
        // Setze sofort das erste Idle-Frame beim ersten Aufruf
        this.ensureIdleFrame();

        const now = new Date().getTime();
        const idleTime = (now - this.character.lastMoveTime) / 1000;

        if (idleTime >= 0.1 && idleTime < 8) {
            this.handleIdleAnimation();
        }

        if (idleTime >= 8) {
            this.handleLongIdleAnimation();
        }
    }

    /**
     * Ensures character shows idle frame when not animating
     */
    ensureIdleFrame() {
        if (!this.isIdleAnimationOn && !this.isLongIdleAnimationOn) {
            this.character.img = this.character.imageCache[this.character.IMAGES_IDLE[0]];
        }
    }

    /**
     * Plays the short idle animation once
     */
    handleIdleAnimation() {
        if (!this.isIdleAnimationOn) {
            this.isIdleAnimationOn = true;
            this.isLongIdleAnimationOn = false;
            this.character.playAnimationOnce(
                this.character.IMAGES_IDLE,
                () => {
                    this.isIdleAnimationOn = false;
                },
                200
            );
        }
    }

    /**
     * Plays the long idle animation in a loop
     */
    handleLongIdleAnimation() {
        if (!this.isLongIdleAnimationOn) {
            this.character.world.audios.playLoopSound('longIdleSound');
            this.isIdleAnimationOn = false;
            this.isLongIdleAnimationOn = true;
            this.character.playAnimationOnce(
                this.character.IMAGES_LONGIDLE,
                () => { this.isLongIdleAnimationOn = false; },
                250
            );
        }
    }
}