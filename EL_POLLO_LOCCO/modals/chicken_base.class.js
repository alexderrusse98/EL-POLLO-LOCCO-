/**
 * Base class for all chicken-type enemies.
 * Handles movement, animations, and death behavior.
 * Can be instantiated as normal or small chicken via type parameter.
 */
class Chicken extends MovableObject {
    height = 55;
    width = 70;
    y = 375;
    isDead = false;
    wasJumpKilled = false;

    intervals = [];
    static lastSpawnX = 300;
    static minDistance = 200;

    IMAGES_WALKING_NORMAL = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD_NORMAL = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    IMAGES_WALKING_SMALL = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD_SMALL = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new chicken enemy
     * @param {string} type - Type of chicken: 'normal' or 'small' (default: 'normal')
     */
    constructor(type = 'normal') {
        super();
        
        this.type = type;
        this.IMAGES_WALKING = type === 'small' ? this.IMAGES_WALKING_SMALL : this.IMAGES_WALKING_NORMAL;
        this.IMAGES_DEAD = type === 'small' ? this.IMAGES_DEAD_SMALL : this.IMAGES_DEAD_NORMAL;

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = Chicken.lastSpawnX + Chicken.minDistance + Math.random() * 300;
        Chicken.lastSpawnX = this.x;
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