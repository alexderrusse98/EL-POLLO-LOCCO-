/**
 * Base class for all chicken-type enemies.
 * Handles movement, animations, and death behavior.
 */
class ChickenBase extends MovableObject {
    height = 55;
    width = 70;
    y = 375;
    isDead = false;
    wasJumpKilled = false;

    intervals = [];
    static lastSpawnX = 300;
    static minDistance = 200;

    constructor() {
        super();
        this.x = ChickenBase.lastSpawnX + ChickenBase.minDistance + Math.random() * 300;
        ChickenBase.lastSpawnX = this.x;
        this.x = 300 + Math.random() * 2500;

        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Stops all intervals (used when removing the chicken or resetting the game)
     */
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    /**
     * Marks the chicken as dead and triggers dead animation
     */
    deadChicken() {
        this.isDead = true;
        this.showDeadAnimation();
    }

    /**
     * Displays the dead chicken image and marks it for deletion after 1 second
     */
    showDeadAnimation() {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];

        setTimeout(() => {
            this.markForDeletion = true;
        }, 1000);
    }

    /**
     * Starts movement and walking animation loops
     */
    animate() {
        this.intervals.push(
            setInterval(() => {
                if (!this.isDead) {
                    this.moveLeft();
                }
            }, 1000 / 60)
        );
        this.intervals.push(
            setInterval(() => {
                if (!this.isDead) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }, 100)
        );
    }
}
