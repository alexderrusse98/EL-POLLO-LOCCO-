/**
 * Represents the Endboss enemy.
 * Inherits from MovableObject and has multiple states: walking, alert, attacking, hurt, dead.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    height = 500;
    width = 250;
    y = -35;
    isDead = false;

    /** @type {boolean} Tracks if attack animation is currently playing */
    isAttackAnimation = false;

    /** @type {number[]} Holds all setIntervals for movement and animation */
    intervals = [];

    /** @type {string[]} Alert animation frames */
    IMAGES_ALERT = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /** @type {string[]} Walking animation frames */
    IMAGES_WALKING = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** @type {string[]} Attack animation frames */
    IMAGES_ATTACK = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    /** @type {string[]} Hurt animation frames */
    IMAGES_HURT = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} Death animation frames */
    IMAGES_DEAD = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates an Endboss instance.
     * Loads all animation images, sets initial position and movement properties.
     */
    constructor() {
        super().loadImage('./img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
        this.movingRight = true;
        this.isAlerted = false;
        this.deathAnimationStarted = false;
        this.attackCounter = 0;
    }

    /**
     * Stops and clears all active intervals.
     */
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    /**
     * Triggers the alert state and initiates attack if not already alerted or attacking.
     */
    playAlertAnimation() {
        if (!this.isAlerted && !this.isAttackAnimation) {
            this.isAlerted = true;
            this.attack();
        }
    }

    /**
     * Handles death state by marking the boss as dead and playing death animation.
     */
    deadChicken() {
        this.isDead = true;
        this.showDeadAnimation();
    }

    /**
     * Displays the first death frame and marks object for deletion after delay.
     */
    showDeadAnimation() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        setTimeout(() => { this.markForDeletion = true; }, 1000);
    }

    /**
     * Moves the boss to the right and reverses direction at boundary.
     */
    moveRightDirection() {
        this.moveRight();
        this.otherDirection = true;
        if (this.x >= 2700) this.movingRight = false;
    }

    /**
     * Moves the boss to the left and reverses direction at boundary.
     */
    moveLeftDirection() {
        this.moveLeft();
        this.otherDirection = false;
        if (this.x <= 2000) this.movingRight = true;
    }

    /**
     * Starts animation and movement intervals for the boss.
     */
    animate() {
        this.intervals.push(
            setInterval(() => { this.handleMovement(); }, 1000 / 60)
        );

        this.intervals.push(
            setInterval(() => { this.animateCharacter(); }, 100)
        );
    }

    /**
     * Main animation handler that switches between states based on current condition.
     */
    animateCharacter() {
        if (this.isDead) this.deathState();
        else if (this.isHurt()) this.hurtState();
        else if (this.isAttackAnimation) this.animateAttack();
        else if (this.isAlerted) this.alertState();
        else this.walkingState();
    }

    /**
     * Handles hurt state animation and clears alert timeout.
     */
    hurtState() {
        this.clearAlertTimeout();
        this.animateHurt();
    }

    /**
     * Handles alert state with direction change and animation.
     */
    alertState() {
        this.alertOtherDirection();
        this.animateAlert();
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
            this.alertwaiting = setTimeout(() => { this.otherDirection = false; }, 100);
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
        this.playAnimation(this.IMAGES_ALERT);
    }

    /**
     * Plays the hurt animation frames.
     */
    animateHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * Plays the walking animation frames.
     */
    animateWalking() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles death state by stopping vertical movement and playing death animation once.
     */
    deathState() {
        this.speedY = 0;
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.playAnimationOnce(this.IMAGES_DEAD, () => {
                this.markForDeletion = true;
            }, 150);
        }
    }

    /**
     * Initiates an attack sequence if not already attacking.
     */
    attack() {
        if (this.isAttackAnimation) return;
        this.startAttack();
        this.scheduleAttackExecution();
    }

    /**
     * Sets attack flag and increments attack counter.
     */
    startAttack() {
        this.isAttackAnimation = true;
        this.attackCounter++;
    }

    /**
     * Schedules the attack execution after a delay.
     */
    scheduleAttackExecution() {
        setTimeout(() => { this.executeAttack(); }, 1000);
    }

    /**
     * Executes the attack if boss is not dead and schedules attack end.
     */
    executeAttack() {
        if (this.isDead) return;
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
        setTimeout(() => { this.isAttackAnimation = false; }, 1500);
    }

    /**
     * Performs a normal attack with moderate jump and horizontal movement.
     */
    normalAttack() {
        this.speedY = 30;
        const direction = this.otherDirection ? 1 : -1;
        this.x += 50 * direction;
    }

    bigAttack() {
        this.speedY = 40;
        const direction = this.otherDirection ? 1 : -1;
        this.x += 100 * direction;
    }


    /**
     * Handles movement logic when boss is in walking state.
     * @returns {boolean} True if movement occurred, false otherwise.
     */
    handleMovement() {
        if (this.isDead) {
            return false;
        }
        if (this.isAlerted || this.isAttackAnimation) {
            this.followCharacter();
            return true;
        }
        this.movingRight ? this.moveRightDirection() : this.moveLeftDirection();
        return true;
    }

    /**
     * Plays the attack animation frames.
     */
    animateAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    /**
     * Folgt dem Character und passt die Richtung an
     */
    followCharacter() {
        if (!this.world || !this.world.character) return;

        const characterX = this.world.character.x;
        const bossX = this.x;
        if (characterX < bossX) {
            this.otherDirection = false;
            if (!this.isAttackAnimation) {
                this.x -= this.speed * 3;
            }
        } else {
            this.otherDirection = true;
            if (!this.isAttackAnimation) {
                this.x += this.speed * 3;
            }
        }
    }
}