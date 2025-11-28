class ChickenBase extends MovableObject {
    height = 55;
    width = 70;
    y = 365;
    isDead = false;
    wasJumpKilled = false;

    intervals = [];


    constructor() {
        super();

        this.x = 300 + Math.random() * 2500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
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
        this.intervals.push(
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60)
        );

        // Animation
        this.intervals.push(
        setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100)
        );
    }
}