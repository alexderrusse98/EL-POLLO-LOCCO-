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

        // Flags to control different animation states
        this.isJumpAnimationOn = false;
        this.isDeadAnimationOn = false;
        this.isIdleAnimationOn = false;
        this.isLongIdleAnimationOn = false;
    }

    /**
     * Main animation function called every animation frame.
     * Determines which animation to play based on character state.
     */
    animateCharacter() {
        // Check for idle/long idle animations
        this.handleResting();

        // Handle different animation states
        if (this.character.isDead()) {
            // Character is dead -> play death animation
            this.character.speedY = 0;
            this.animateDeath();
        } else if (this.character.isAboveGround() && this.isJumpAnimationOn) {
            // Character is jumping -> play jump animation
            this.animateJump();
        } else if (this.character.isHurt() && !this.character.isAboveGround()) {
            // Character got hurt on the ground -> play hurt animation
            this.animateHurt();
        } else if (!this.character.isAboveGround()) {
            // Character is on the ground -> play walking animation if moving
            this.animateWalking();
        }
    }

    /**
     * Handles the jump animation sequence
     */
    animateJump() {
        this.setJumpImage();      // Set image according to vertical speed
        this.handleJumpEnd();     // Check if jump animation should stop
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
        return 8; // Falling / landing frame
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
     * Determines which death frame to show based on how far character has fallen
     */
    getDeathFrame() {
        const fallDown = Math.max(0, this.character.y - 80);

        if (fallDown < 10) return 0;
        if (fallDown < 50) return 2;
        if (fallDown < 100) return 3;
        if (fallDown < 150) return 4;
        if (fallDown < 300) return 5;
        return 6; // Final death frame on the ground
    }

    /**
     * Updates physics for death animation (falling and sliding)
     */
    updateDeathPhysics() {
        if (!this.character.speedY) this.character.speedY = 10;

        if (this.character.y < 500) {
            this.character.y += this.character.speedY;
            this.character.speedY += 0.8; // gravity effect
            this.character.x += 10;       // sliding forward
        } else {
            this.character.y = 500;       // stop at ground
            this.character.speedY = 0;
        }
    }

    /** Plays hurt animation */
    animateHurt() {
        this.character.playAnimation(this.character.IMAGES_HURT);
    }

    /** Plays walking animation if moving left or right */
    animateWalking() {
        const kbd = this.character.world.keyboard;
        if (kbd.RIGHT || kbd.LEFT) {
            this.character.playAnimation(this.character.IMAGES_WALKING);
        }
    }

    /**
     * Handles idle and long idle animations based on last movement time
     */
    handleResting() {
        const now = new Date().getTime();
        const idleTime = (now - this.character.lastMoveTime) / 1000;

        // Idle animation for short periods of inactivity
        if (idleTime >= 0.1 && idleTime < 8) {
            this.handleIdleAnimation();
        }

        // Long idle animation after longer inactivity
        if (idleTime >= 8) {
            this.handleLongIdleAnimation();
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
                () => { this.isIdleAnimationOn = false; },
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
