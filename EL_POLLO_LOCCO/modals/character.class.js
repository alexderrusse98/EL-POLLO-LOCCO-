class Character extends MovableObject {
    height = 200;
    y = 220;
    speed = 5;
    bottleCount = 0;

    isJumpAnimationOn = false;


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
        this.applyGravity();
        this.animate();

    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.ortherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.ortherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);


        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            else if (this.isAboveGround()) {


            } else {

                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
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