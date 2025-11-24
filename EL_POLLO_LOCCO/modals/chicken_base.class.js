class ChickenBase extends MovableObject {
    height = 55;
    width = 70;
    y = 365;
    isDead = false;
    wasJumpKilled = false;



    constructor() {
        super();

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