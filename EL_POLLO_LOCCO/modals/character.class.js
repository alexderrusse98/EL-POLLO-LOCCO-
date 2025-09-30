class Character extends MovableObject {
    height = 250;
    y = 80;
    speed = 5;

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
                this.playAnimation(this.IMAGES_JUMPING);

            } else {

                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

    jump() {
        this.speedY = 30;
    }
}