class Character extends MovableObject {

    height = 200;
    y = 220;
    speed = 5;
    bottleCount = 0;
    isJumpAnimationOn = false;

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
        let moved = false;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.ortherDirection = false;
            moved = true;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.ortherDirection = true;
            moved = true;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            moved = true;
        }


        return moved;
    }


    // 2. Kamera aktualisieren
    updateCamera() {
        if (!this.isDead()) {
            this.world.camera_x = -this.x + 100;
        }
    }



    // 3. Idle-/LongIdle-Zustand und Intervalle prüfen
    checkMovementState(moved) {
        if (moved) {
            this.lastMoveTime = new Date().getTime();
            this.isIdleAnimationOn = false;
            this.isLongIdleAnimationOn = false;

            if (this.idleInterval) { clearInterval(this.idleInterval); this.idleInterval = null; }
            if (this.longIdleInterval) { clearInterval(this.longIdleInterval); this.longIdleInterval = null; }
        }
    }


    // 4. Animationen für Dead, Hurt, Walking und Idle prüfen
    // Hauptfunktion, die alle Animationszustände prüft
    animateCharacter() {
        this.resting();

        if (this.isDead()) {
            this.speedY = 0;
            this.animateDeath();
        } else if (this.isHurt()) {
            this.animateHurt();
        } else if (!this.isAboveGround()) {
            this.animateWalking();
        }
    }


    // Animation bei Tod
    animateDeath() {
        this.playAnimation(this.IMAGES_DEAD);

        if (this.currentImage >= 2) {
            if (!this.speedY) this.speedY = 10;


            if (this.y < 500) {
                this.y += this.speedY;
                this.speedY += 0.5;
                this.x += 7;
            } else {
                this.y = 500;
            }
        }
    }




    // Animation bei Treffer
    animateHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }


    // Animation beim Laufen (nur wenn auf dem Boden)
    animateWalking() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    // 5. Hauptanimate-Funktion
    animate() {

        setInterval(() => {
            const moved = this.handleMovement();
            this.updateCamera();
            this.checkMovementState(moved);
        }, 1000 / 60);


        setInterval(() => {
            this.animateCharacter();
        }, 50);
    }


    jump() {
        if (!this.isJumpAnimationOn) {
            this.isJumpAnimationOn = true;
            this.speedY = 30;

            let i = 0;
            const jumpInterval = setInterval(() => {
                this.img = this.imageCache[this.IMAGES_JUMPING[i]];
                i++;
                if (i >= this.IMAGES_JUMPING.length) {
                    clearInterval(jumpInterval);
                    this.isJumpAnimationOn = false;
                }
            }, 90);
        }
    }
}
