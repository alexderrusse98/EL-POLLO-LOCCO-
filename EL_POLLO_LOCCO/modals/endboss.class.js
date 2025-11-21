class Endboss extends MovableObject {
    height = 500;
    width = 250;
    y = -35;
    isDead = false;


    IMAGES_ALERT = [
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        ' ./img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png',
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
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 400;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
        this.movingRight = true;
    }


    deadChicken() {
        this.isDead = true;
        this.showDeadAnimation();
    }


    showDeadAnimation() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        setTimeout(() => {
            this.markForDeletion = true;
        }, 1000);
    }


    handleMovement() {
        if (this.isDead) return false;

        if (this.movingRight) {
            this.moveRightDirection();
        } else {
            this.moveLeftDirection();
        }
        return true;
    }


    moveRightDirection() {
        this.moveRight();
        this.otherDirection = true;

        if (this.x >= 500) {
            this.movingRight = false;
        }
    }


    moveLeftDirection() {
        this.moveLeft();
        this.otherDirection = false;

        if (this.x <= 350) {
            this.movingRight = true;
        }
    }


    animate() {
        setInterval(() => {
            this.handleMovement();
        }, 1000 / 60);

        setInterval(() => {
            this.animateCharacter();
        }, 50);
    }


    animateCharacter() {
        if (this.isDead) {
            this.speedY = 0;
            this.animateDeath();
        } else if (this.isHurt()) {
            this.animateHurt();
        } else {
            this.animateWalking();
        }
    }


    animateHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }


    animateWalking() {
        this.playAnimation(this.IMAGES_WALKING);
    }


    animateDeath() {
        this.playAnimation(this.IMAGES_DEAD);
    }
}