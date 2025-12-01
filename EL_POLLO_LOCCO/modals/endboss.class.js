/**
 * Represents the Endboss enemy.
 * Inherits from MovableObject and has multiple states: walking, alert, attacking, hurt, dead.
 */
class Endboss extends MovableObject {
    height = 500;
    width = 250;
    y = -35;
    isDead = false;

    isAttackAnimation = false; // Tracks if attack animation is currently playing
    intervals = [];            // Holds all setIntervals for movement and animation

    // Animation frames
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

    IMAGES_WALKING = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

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

    IMAGES_HURT = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        './img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage('./img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png');

        // Load all animation frames
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;                          // Spawn position
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();                          // Start intervals for movement & animation
        this.movingRight = true;                 // Initial movement direction
        this.isAlerted = false;
        this.deathAnimationStarted = false;
        this.attackCounter = 0;                  // Counter to manage normal vs big attack
    }

    // Clears all intervals when needed
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    // Start alerting the boss if player is near
    playAlertAnimation() {
        if (!this.isAlerted && !this.isAttackAnimation) {
            this.isAlerted = true;
            this.attack();
        }
    }

    // Handle death
    deadChicken() {
        this.isDead = true;
        this.showDeadAnimation();
    }

    showDeadAnimation() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        setTimeout(() => { this.markForDeletion = true; }, 1000);
    }

    // Movement logic
    moveRightDirection() {
        this.moveRight();
        this.otherDirection = true;
        if (this.x >= 2700) this.movingRight = false;
    }

    moveLeftDirection() {
        this.moveLeft();
        this.otherDirection = false;
        if (this.x <= 2000) this.movingRight = true;
    }

    // Start animation intervals
    animate() {
        // Movement
        this.intervals.push(
            setInterval(() => { this.handleMovement(); }, 1000 / 60)
        );

        // Animation
        this.intervals.push(
            setInterval(() => { this.animateCharacter(); }, 100)
        );
    }

    // Main animation handler based on state
    animateCharacter() {
        if (this.isDead) this.deathState();
        else if (this.isHurt()) this.hurtState();
        else if (this.isAttackAnimation) this.animateAttack();
        else if (this.isAlerted) this.alertState();
        else this.walkingState();
    }

    hurtState() {
        this.clearAlertTimeout();
        this.animateHurt();
    }

    alertState() {
        this.alertOtherDirection();
        this.animateAlert();
    }

    walkingState() {
        this.clearAlertTimeout();
        this.animateWalking();
    }

    // Alert animation: briefly look to the other direction
    alertOtherDirection() {
        if (!this.alertwaiting) {
            this.alertwaiting = setTimeout(() => { this.otherDirection = false; }, 100);
        }
    }

    clearAlertTimeout() {
        if (this.alertwaiting) {
            clearTimeout(this.alertwaiting);
            this.alertwaiting = null;
        }
    }

    animateAlert() { this.playAnimation(this.IMAGES_ALERT); }
    animateHurt() { this.playAnimation(this.IMAGES_HURT); }
    animateWalking() { this.playAnimation(this.IMAGES_WALKING); }

    deathState() {
        this.speedY = 0;
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.playAnimationOnce(this.IMAGES_DEAD, () => { this.markForDeletion = true; }, 150);
        }
    }

    // Attack logic
    attack() {
        if (this.isAttackAnimation) return;
        this.startAttack();
        this.scheduleAttackExecution();
    }

    startAttack() {
        this.isAttackAnimation = true;
        this.attackCounter++;
    }

    scheduleAttackExecution() {
        setTimeout(() => { this.executeAttack(); }, 2000);
    }

    executeAttack() {
        if (this.isDead) return;
        this.performAttackType();
        this.scheduleAttackEnd();
    }

    performAttackType() {
        if (this.attackCounter % 3 === 0) this.bigAttack();
        else this.normalAttack();
    }

    scheduleAttackEnd() {
        setTimeout(() => { this.isAttackAnimation = false; }, 2000);
    }

    normalAttack() {
        this.speedY = 20;
        this.otherDirection ? this.x += 100 : this.x -= 100;
    }

    bigAttack() {
        this.speedY = 30;
        this.otherDirection ? this.x += 200 : this.x -= 200;
    }

    // Movement handler: disabled during attack, alert, hurt, or death
    handleMovement() {
        if (this.isDead || this.isAlerted || this.isAttackAnimation || this.isHurt()) return false;
        this.movingRight ? this.moveRightDirection() : this.moveLeftDirection();
        return true;
    }

    animateAttack() { this.playAnimation(this.IMAGES_ATTACK); }
}
