/**
 * Represents a throwable bottle object with rotation and splash animations.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {

    /** @type {number[]} Array of active interval IDs for cleanup */
    intervals = [];

    /** @type {string[]} Bottle rotation animation images */
    IMAGES_ROTATION = [
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    /** @type {string[]} Bottle splash animation images */
    IMAGES_SPLASH = [
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a ThrowableObject instance at the specified position.
     * Automatically initiates the throw animation.
     * @param {number} x - The x-coordinate position of the bottle.
     * @param {number} y - The y-coordinate position of the bottle.
     */
    constructor(x, y, throwDirection) {
        super();
        this.loadImage('./img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.hasSplashed = false;
        this.throwDirection = throwDirection;
        this.throw();
    }

    /**
     * Stops and clears all active intervals.
     */
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    /**
     * Initiates the throw action with upward velocity and horizontal movement.
     * Applies gravity and starts animation intervals.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.intervals.push(
            setInterval(() => {
                if (!this.hasSplashed) {
                    this.x += 7 * this.throwDirection;
                }
            }, 25)
        );

        this.animate();
    }

    /**
     * Starts the rotation animation while the bottle is in flight.
     */
    animate() {
        this.intervals.push(
            setInterval(() => {
                if (!this.hasSplashed) {
                    this.playAnimation(this.IMAGES_ROTATION);
                }
            }, 200)
        );
    }

    /**
     * Plays the splash animation when the bottle hits the ground.
     * Stops all movement and marks the object for deletion after animation completes.
     */
    animateSplash() {
        this.speedY = 0;
        this.acceleration = 0;
        this.y += 30;
        let i = 0;
        const splashInterval = setInterval(() => {
            if (i < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[i]];
                i++;
            } else {
                clearInterval(splashInterval);
                this.markForDeletion = true;
            }
        }, 100);
        this.intervals.push(splashInterval);
    }
}