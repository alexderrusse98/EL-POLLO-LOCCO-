/**
 * Represents a small chicken enemy.
 * Inherits from ChickenBase and defines its own walking and dead images.
 */
class ChickenSmall extends ChickenBase {

    // Walking animation frames for small chicken
    IMAGES_WALKING = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    // Dead image for small chicken (single frame)
    IMAGES_DEAD = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    
    constructor() {
        super(); // Call the base constructor to set position, speed, and spawn logic

        // Load initial image for rendering immediately
        this.loadImage('./img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        // Preload walking and dead images for animation
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }
}
