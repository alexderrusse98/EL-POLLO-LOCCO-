class Endboss extends MovableObject {
    height = 500;
    width = 250;
    y = -35;
    isDead = false;

    isAttackAnimation = false;

     intervals = [];

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
        this.isAlerted = false;
        this.deathAnimationStarted = false;
        this.attackCounter = 0;
    }

    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    playAlertAnimation() {
        if (!this.isAlerted && !this.isAttackAnimation) {
            this.isAlerted = true;

           // console.log('alert + attacke');

            this.attack();

        }
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

    moveRightDirection() {
        this.moveRight();
        this.otherDirection = true;

        if (this.x >= 1500) {
            this.movingRight = false;
        }
    }

    moveLeftDirection() {
        this.moveLeft();
        this.otherDirection = false;

        if (this.x <= 500) {
            this.movingRight = true;
        }
    }

    animate() {
        
        this.intervals.push(
        setInterval(() => {
            this.handleMovement();
        }, 1000 / 60)
        );

        this.intervals.push(
        setInterval(() => {
            this.animateCharacter();
        }, 100)
        );
    }

    animateCharacter() {
        if (this.isDead) {
            this.deathState();
        } else if (this.isHurt()) {
            this.hurtState();
        } else if (this.isAttackAnimation) {
            this.animateAttack();
        } else if (this.isAlerted) {
            this.alertState();
        } else {
            this.walkingState();
        }
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

    alertOtherDirection() {
        if (!this.alertwaiting) {
            this.alertwaiting = setTimeout(() => {
                this.otherDirection = false;
            }, 100);
        }
    }

    clearAlertTimeout() {
        if (this.alertwaiting) {
            clearTimeout(this.alertwaiting);
            this.alertwaiting = null;
        }
    }

    animateAlert() {
        this.playAnimation(this.IMAGES_ALERT);
    }

    animateHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }

    animateWalking() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    deathState() {
        this.speedY = 0;

        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.playAnimationOnce(this.IMAGES_DEAD, () => {

                this.markForDeletion = true;
            }, 150);
        }
    }

    // attack   
    attack() {
        if (!this.isAttackAnimation) {
            this.isAttackAnimation = true;
            this.attackCounter++;

           // console.log(`Attack #${this.attackCounter}`);

            setTimeout(() => {
                if (!this.isDead) {
                   // console.log("Springe jetzt!");


                    if (this.attackCounter % 3 === 0) {
                       // console.log("GROSSER SPRUNG!");
                        this.bigAttack();
                    } else {
                      //  console.log("Normaler Attack");
                        this.normalAttack();
                    }

                    setTimeout(() => {
                        this.isAttackAnimation = false;
                      // console.log("Attack beendet");
                    }, 2000);
                }
            }, 2000);
        }
    }

    normalAttack() {
        this.speedY = 20;

        if (this.otherDirection) {
            this.x += 100;
        } else {
            this.x -= 100;
        }
    }

    bigAttack() {
        this.speedY = 30;

        if (this.otherDirection) {
            this.x += 200;
        } else {
            this.x -= 200;
        }
    }

    handleMovement() {
        if (this.isDead) return false;
        if (this.isAlerted) return false;
        if (this.isAttackAnimation) return false;
        if (this.isHurt()) return false;

        if (this.movingRight) {
            this.moveRightDirection();
        } else {
            this.moveLeftDirection();
        }
        return true;
    }

    animateAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }
}