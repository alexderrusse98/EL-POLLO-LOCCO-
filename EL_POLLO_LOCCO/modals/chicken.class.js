class Chicken extends MovableObject {
    height = 55;
    width = 70;
    y = 365;
    isDead = false; 
    wasJumpKilled = false;

    IMAGES_WALKING = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('./img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD); 

        this.x = 200 + Math.random() * 700;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
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

    animate() {
        // Bewegung
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        // Animation
        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }
}