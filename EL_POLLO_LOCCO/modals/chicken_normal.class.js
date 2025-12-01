/**
 * Represents a normal chicken enemy.
 * Inherits from ChickenBase and sets specific images for walking and death.
 */
class ChickenNormal extends ChickenBase {

    // Walking animation frames for normal chicken
    IMAGES_WALKING = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    // Dead image for normal chicken (single frame)
    IMAGES_DEAD = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super(); // Call the base constructor (spawns the chicken, sets speed, etc.)

        // Load initial image
        this.loadImage('./img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        // Load all walking and dead images into the cache
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }
}
