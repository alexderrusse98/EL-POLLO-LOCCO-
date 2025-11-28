class Character extends MovableObject {
    audios;
    height = 200;
    y = 120;
    speed = 5;
    bottleCount = 0;
    isJumpAnimationOn = false;
    isThrowingBottle = false;
    isDeadAnimationOn = false;

    intervals = [];

    lastMoveTime = new Date().getTime();

    isIdleAnimationOn = false;
    isLongIdleAnimationOn = false;

    idleInterval = null;
    longIdleInterval = null;


    IMAGES_WALKING = [
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        './img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
        './img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
        './img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONGIDLE = [
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    world;

    constructor() {
        super().loadImage('./img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.applyGravity();
        this.animate();
        this.previousBottom = this.y + this.height;
    }

    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }


    resting() {
        const now = new Date().getTime();
        const idleTime = (now - this.lastMoveTime) / 1000;


        if (idleTime >= 0, 1 && idleTime < 8) {
            if (!this.isIdleAnimationOn) {
                this.isIdleAnimationOn = true;
                this.isLongIdleAnimationOn = false;
                this.playAnimationOnce(this.IMAGES_IDLE, () => {
                    this.isIdleAnimationOn = false;
                }, 200);
            }
        }
        this.restingLong(idleTime);
    }


    restingLong(idleTime) {
        if (idleTime >= 8) {
            if (!this.isLongIdleAnimationOn) {
                this.world.audios.playLoopSound('longIdleSound');
                this.isIdleAnimationOn = false;
                this.isLongIdleAnimationOn = true;
                this.playAnimationOnce(this.IMAGES_LONGIDLE, () => {
                    this.isLongIdleAnimationOn = false;
                }, 250);
            }
        }
    }


    // 1. Prüft Tasteneingaben und bewegt den Charakter
    handleMovement() {
        if (this.isDead()) return false;

        return this.handleRightMovement() |
            this.handleLeftMovement() |
            this.handleJump() |
            this.handleThrow();
    }


    handleRightMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            return true;
        }
        return false;
    }


    handleLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            return true;
        }
        return false;
    }


    handleThrow() {
        if (this.world.keyboard.D && this.bottleCount > 0) {
            this.isThrowingBottle = true;
            return true;
        }
        return false;
    }


    updateCamera() {
        if (!this.isDead()) {
            const cameraStartX = 300;
            const cameraOffset = 300;

            if (this.x > cameraStartX) {
                this.world.camera_x = -this.x + cameraOffset;
            } else {
                this.world.camera_x = 0;
            }
        }
    }


    // 3. Idle-/LongIdle-Zustand und Intervalle prüfen
    checkMovementState(moved) {
        if (moved) {
            this.lastMoveTime = new Date().getTime();
            this.isIdleAnimationOn = false;
            this.isLongIdleAnimationOn = false;
            if (this.world && this.world.audios) {
                this.world.audios.stopLoopSound();
            }

            if (this.idleInterval) { clearInterval(this.idleInterval); this.idleInterval = null; }
            if (this.longIdleInterval) { clearInterval(this.longIdleInterval); this.longIdleInterval = null; }
        }
    }



    animateHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }



    animateWalking() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }



    animate() {
        this.intervals.push(
            setInterval(() => {
                const moved = this.handleMovement();
                this.updateCamera();
                this.checkMovementState(moved);
            }, 1000 / 60)
        );

        this.intervals.push(
            setInterval(() => {
                this.animateCharacter();
            }, 50)
        );
    }

    // Jumping Animation

    jump() {
        if (!this.isJumpAnimationOn) {
            this.isJumpAnimationOn = true;
            this.speedY = 30;
            this.jumpStartY = this.y;
        }
    }

    // kürzen und verbessern
    checkJumpOnEnemy(enemy) {
        if (this.speedY >= 0 || enemy.isDead) return false;

        const xTolerance = 60;
        const yTolerance = 50;

        const playerLeft = this.x - xTolerance;
        const playerRight = this.x + this.width + xTolerance;
        const playerBottom = this.y + this.height;

        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;
        const enemyTop = enemy.y;

        const horizontalHit = playerRight > enemyLeft && playerLeft < enemyRight;
        const verticalHit = playerBottom >= enemyTop &&
            playerBottom <= enemyTop + yTolerance;

        if (horizontalHit && verticalHit) {
            enemy.deadChicken();
            this.speedY = 15;
            return true;
        }
        return false;
    }


    handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround() && !this.isJumpAnimationOn) {
        this.jump();
        if (this.world && this.world.audios) {
            this.world.audios.playSound('jumpSound');
        }
        return true;
    }
    return false;
}


    isJumpingOnEnemy(enemy) {
        const playerBottom = this.y + this.height;
        const enemyTop = enemy.y;
        return playerBottom >= enemyTop &&
            playerBottom <= enemyTop + 30 &&
            this.speedY < 0;
    }


    animateJump() {
        this.setJumpImage();
        this.handleJumpEnd();
    }


    setJumpImage() {
        const frame = this.getJumpFrame();
        this.img = this.imageCache[this.IMAGES_JUMPING[frame]];
    }


    getJumpFrame() {
        if (this.speedY > 25) return 0;
        if (this.speedY > 24) return 1;
        if (this.speedY > 23) return 2;
        if (this.speedY > 10) return 3;
        if (this.speedY > -1) return 4;
        if (this.speedY > -15) return 5;
        if (this.speedY > -20) return 6;
        if (this.speedY > -25) return 7;
        return 8;
    }


    handleJumpEnd() {
        const frame = this.getJumpFrame();
        const landed = !this.isAboveGround() && this.speedY <= 0;
        if (frame === 8 || landed) this.isJumpAnimationOn = false;
    }

    animateCharacter() {
        this.resting();

        if (this.isDead()) {
            this.speedY = 0;
            this.animateDeath();
        } else if (this.isAboveGround() && this.isJumpAnimationOn) {
            this.animateJump();
        } else if (this.isHurt() && !this.isAboveGround()) {
            this.animateHurt();
        } else if (!this.isAboveGround()) {
            this.animateWalking();
        }
    }

    // Death Animation

    animateDeath() {
        this.setDeathImage();
        this.updateDeathPhysics();
    }

    setDeathImage() {
        this.img = this.imageCache[this.IMAGES_DEAD[this.getDeathFrame()]];
    }

    getDeathFrame() {
        const fallDown = Math.max(0, this.y - 80);
        if (fallDown < 10) return 0;
        if (fallDown < 10) return 1;
        if (fallDown < 50) return 2;
        if (fallDown < 100) return 3;
        if (fallDown < 150) return 4;
        if (fallDown < 300) return 5;
        return 6;
    }

    updateDeathPhysics() {
        if (!this.speedY) this.speedY = 10;
        if (this.y < 500) {
            this.y += this.speedY;
            this.speedY += 0.8;
            this.x += 10;
        } else {
            this.y = 500;
            this.speedY = 0;
        }
    }
}
