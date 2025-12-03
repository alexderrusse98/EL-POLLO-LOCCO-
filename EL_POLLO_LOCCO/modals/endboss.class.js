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
        this.speed = 0.15 + Math.random() * 0.5;
        this.movingRight = true;
        this.isAlerted = false;

        this.animator = new EndbossAnimator(this);
        this.animate();
    }

    /**
     * Stops and clears all active intervals.
     */
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
        this.animator.cleanup();
    }

    /**
     * Triggers the alert state and initiates attack if not already alerted or attacking.
     */
    playAlertAnimation() {
        this.animator.playAlertAnimation();
    }

    /**
     * Handles death state by marking the boss as dead and playing death animation.
     */
    deadChicken() {
        this.isDead = true;
        this.animator.showDeadAnimation();
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
            setInterval(() => { this.animator.animateCharacter(); }, 100)
        );
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
     * Main method: handles following logic
     */
    followCharacter() {
        if (!this.canFollowCharacter()) return;

        const characterX = this.world.character.x;
        const bossX = this.x;

        this.updateDirection(characterX, bossX);
        this.moveTowardsCharacter();
    }

    /**
     * Prevents errors by checking references
     * @returns {boolean} True if world and character exist
     */
    canFollowCharacter() {
        return this.world && this.world.character;
    }

    /**
     * Updates facing direction based on character's position
     * @param {number} characterX - Character's X position
     * @param {number} bossX - Boss's X position
     */
    updateDirection(characterX, bossX) {
        this.otherDirection = !(characterX < bossX);
    }

    /**
     * Moves the boss depending on its direction & attack state
     */
    moveTowardsCharacter() {
        if (this.animator.dashInterval) return;

        const moveSpeed = this.speed * 3;
        if (this.otherDirection) {
            this.x += moveSpeed;
        } else {
            this.x -= moveSpeed;
        }
    }
}