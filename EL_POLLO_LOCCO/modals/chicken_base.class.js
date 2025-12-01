/**
 * Base class for all chicken-type enemies.
 * Handles movement, animations, and death behavior.
 */
class ChickenBase extends MovableObject {
    // Chicken size and position
    height = 55;
    width = 70;
    y = 365;

    // Status flags
    isDead = false;        // Whether the chicken is dead
    wasJumpKilled = false; // If chicken was killed by player jumping on it

    // Holds references to all intervals for animations and movement
    intervals = [];

    // Static properties to control spawn positions and spacing between chickens
    static lastSpawnX = 300;     // X-coordinate of the last spawned chicken
    static minDistance = 200;    // Minimum distance between consecutive chickens

    constructor() {
        super();

        // Calculate a random X position based on last spawn position and random offset
        this.x = ChickenBase.lastSpawnX + ChickenBase.minDistance + Math.random() * 300;
        ChickenBase.lastSpawnX = this.x;

        // Optional random positioning override
        this.x = 300 + Math.random() * 2500;

        // Set a random movement speed
        this.speed = 0.15 + Math.random() * 0.25;

        // Start movement and animation loops
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
        // Set image to the first frame of the dead animation
        this.img = this.imageCache[this.IMAGES_DEAD[0]];

        // Remove chicken from game after 1 second
        setTimeout(() => {
            this.markForDeletion = true;
        }, 1000);
    }

    /**
     * Starts movement and walking animation loops
     */
    animate() {
        // Movement loop: moves the chicken left if not dead
        this.intervals.push(
            setInterval(() => {
                if (!this.isDead) {
                    this.moveLeft();
                }
            }, 1000 / 60) // ~60 FPS
        );

        // Animation loop: cycles through walking images if not dead
        this.intervals.push(
            setInterval(() => {
                if (!this.isDead) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }, 100) // Every 100 ms
        );
    }
}
