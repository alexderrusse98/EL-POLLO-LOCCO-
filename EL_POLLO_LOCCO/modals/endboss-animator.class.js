/**
 * Handles all Endboss animations and attack logic.
 * Separates animation and attack logic from movement logic.
 */
class EndbossAnimator {
    /**
     * @param {Endboss} endboss - Reference to the endboss object
     */
    constructor(endboss) {
        this.endboss = endboss;
        this.alertwaiting = null;
        this.deathAnimationStarted = false;
        this.attackCounter = 0;
        this.dashInterval = null;
        this.isDashing = false;
        this.isPlayingAttackAnimation = false;
    }

    /**
     * Main animation handler that switches between states based on current condition.
     */
    animateCharacter() {
        if (this.endboss.isDead) {
            this.deathState();
        } else if (this.endboss.isHurt()) {
            this.hurtState();
        } else if (this.isPlayingAttackAnimation && !this.isDashing) {
            // Nur Attack-Animation wenn nicht am Dashen
            this.animateAttack();
        } else if (this.endboss.isAlerted) {
            // Immer Walking wenn alerted (außer bei Attack-Animation oben)
            this.animateWalking();
        } else {
            this.walkingState();
        }
    }

    /**
     * Handles hurt state animation and clears alert timeout.
     */
    hurtState() {
        this.clearAlertTimeout();
        this.animateHurt();
    }

    /**
     * Handles walking state and clears alert timeout.
     */
    walkingState() {
        this.clearAlertTimeout();
        this.animateWalking();
    }

    /**
     * Briefly changes direction during alert animation.
     */
    alertOtherDirection() {
        if (!this.alertwaiting) {
            this.alertwaiting = setTimeout(() => {
                this.endboss.otherDirection = false;
            }, 100);
        }
    }

    /**
     * Clears the alert direction timeout if it exists.
     */
    clearAlertTimeout() {
        if (this.alertwaiting) {
            clearTimeout(this.alertwaiting);
            this.alertwaiting = null;
        }
    }

    /**
     * Plays the alert animation frames.
     */
    animateAlert() {
        this.endboss.playAnimation(this.endboss.IMAGES_ALERT);
    }

    /**
     * Plays the hurt animation frames.
     */
    animateHurt() {
        this.endboss.playAnimation(this.endboss.IMAGES_HURT);
    }

    /**
     * Plays the walking animation frames.
     */
    animateWalking() {
        this.endboss.playAnimation(this.endboss.IMAGES_WALKING);
    }

    /**
     * Plays the attack animation frames.
     */
    animateAttack() {
        this.endboss.playAnimation(this.endboss.IMAGES_ATTACK);
    }

    /**
     * Handles death state by stopping vertical movement and playing death animation once.
     */
    deathState() {
        this.endboss.speedY = 0;
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.endboss.playAnimationOnce(this.endboss.IMAGES_DEAD, () => {
                this.endboss.markForDeletion = true;
            }, 150);
        }
    }

    /**
     * Displays the first death frame and marks object for deletion after delay.
     */
    showDeadAnimation() {
        this.endboss.img = this.endboss.imageCache[this.endboss.IMAGES_DEAD[0]];
        setTimeout(() => {
            this.endboss.markForDeletion = true;
        }, 1000);
    }

    /**
     * Triggers the alert state and initiates attack if not already alerted or attacking.
     */
    playAlertAnimation() {
        if (!this.endboss.isAlerted && !this.endboss.isAttackAnimation) {
            this.endboss.isAlerted = true;
            // Spiele einmalig die Alert-Animation
            this.playAlertSequence();
            // Starte dann die Attacks
            setTimeout(() => {
                this.attack();
            }, 800);
        }
    }

    /**
     * Plays the alert animation sequence once
     */
    playAlertSequence() {
        this.alertOtherDirection();
        let alertFrameCount = 0;
        const alertInterval = setInterval(() => {
            this.animateAlert();
            alertFrameCount++;
            if (alertFrameCount >= this.endboss.IMAGES_ALERT.length) {
                clearInterval(alertInterval);
            }
        }, 100);
    }

    /**
     * Initiates an attack sequence if not already attacking.
     */
    attack() {
        if (this.endboss.isAttackAnimation) return;
        this.startAttack();
        this.scheduleAttackExecution();
    }

    /**
     * Sets attack flag and increments attack counter.
     */
    startAttack() {
        this.endboss.isAttackAnimation = true;
        this.isPlayingAttackAnimation = true;
        this.attackCounter++;
    }

    /**
     * Schedules the attack execution after a delay.
     */
    scheduleAttackExecution() {
        setTimeout(() => { this.executeAttack(); }, 500);
    }

    /**
     * Executes the attack if boss is not dead and schedules attack end.
     */
    executeAttack() {
        if (this.endboss.isDead) return;
        this.performAttackType();
        this.scheduleAttackEnd();
    }

    /**
     * Determines attack type based on counter (big attack every 3rd time).
     */
    performAttackType() {
        if (this.attackCounter % 3 === 0) this.bigAttack();
        else this.normalAttack();
    }

    /**
     * Schedules the end of attack animation after delay.
     */
    scheduleAttackEnd() {
        setTimeout(() => {
            this.endboss.isAttackAnimation = false;
            this.isPlayingAttackAnimation = false;
        }, 1000);
    }

    /**
     * Performs a normal attack with moderate jump and horizontal movement.
     */
    normalAttack() {
        this.endboss.speedY = 45;
        this.startDash(50, 300);
    }

    /**
     * Performs a big attack with high jump and fast dash movement.
     */
    bigAttack() {
        this.endboss.speedY = 60;
        this.startDash(100, 400);
    }

    /**
     * Initiates a smooth dash movement over time
     * @param {number} distance - Total distance to travel in pixels
     * @param {number} duration - Duration of the dash in milliseconds
     */
    startDash(distance, duration) {
        if (this.isDashActive()) return;

        this.isDashing = true;
        this.isPlayingAttackAnimation = false; // Während Dash: Walking Animation
        const dashData = this.prepareDashData(distance);
        this.executeDash(dashData, duration);
    }

    /**
     * Checks if a dash is currently active
     * @returns {boolean} True if dash is already running
     */
    isDashActive() {
        return this.dashInterval !== null;
    }

    /**
     * Prepares all necessary data for the dash movement
     * @param {number} distance - Total distance to travel
     * @returns {{direction: number, startTime: number, startX: number, targetX: number}} Dash configuration data
     */
    prepareDashData(distance) {
        const direction = this.endboss.otherDirection ? 1 : -1;
        const startTime = Date.now();
        const startX = this.endboss.x;
        const targetX = startX + (distance * direction);

        return { direction, startTime, startX, targetX };
    }

    /**
     * Executes the dash movement with smooth interpolation
     * @param {{direction: number, startTime: number, startX: number, targetX: number}} dashData - Dash configuration
     * @param {number} duration - Duration of the dash in milliseconds
     */
    executeDash(dashData, duration) {
        const distance = Math.abs(dashData.targetX - dashData.startX);

        this.dashInterval = setInterval(() => {
            const progress = this.calculateDashProgress(dashData.startTime, duration);
            this.updateDashPosition(dashData.startX, distance, dashData.direction, progress);

            if (this.isDashComplete(progress)) {
                this.endDash();
            }
        }, 1000 / 60);
    }

    /**
     * Calculates current progress of the dash (0 to 1)
     * @param {number} startTime - Timestamp when dash started
     * @param {number} duration - Total duration of dash
     * @returns {number} Progress value between 0 and 1
     */
    calculateDashProgress(startTime, duration) {
        const elapsed = Date.now() - startTime;
        return Math.min(elapsed / duration, 1);
    }

    /**
     * Updates character position during dash
     * @param {number} startX - Starting X position
     * @param {number} distance - Total distance to travel
     * @param {number} direction - Direction multiplier (1 or -1)
     * @param {number} progress - Current progress (0 to 1)
     */
    updateDashPosition(startX, distance, direction, progress) {
        this.endboss.x = startX + (distance * direction * progress);
    }

    /**
     * Checks if dash movement is complete
     * @param {number} progress - Current progress value
     * @returns {boolean} True if dash has finished
     */
    isDashComplete(progress) {
        return progress >= 1;
    }

    /**
     * Ends the dash and clears the interval
     */
    endDash() {
        clearInterval(this.dashInterval);
        this.dashInterval = null;
        this.isDashing = false;
    }

    /**
     * Cleans up all animation and attack timeouts/intervals
     */
    cleanup() {
        this.clearAlertTimeout();
        if (this.dashInterval) {
            clearInterval(this.dashInterval);
            this.dashInterval = null;
            this.isDashing = false;
        }
    }
}