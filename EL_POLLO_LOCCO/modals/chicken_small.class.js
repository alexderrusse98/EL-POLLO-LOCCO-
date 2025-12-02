/**
 * Represents a small chicken enemy.
 * Inherits from ChickenBase and defines its own walking and dead images.
 */
class ChickenSmall extends ChickenBase {

    IMAGES_WALKING = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    
    IMAGES_DEAD = [
        './img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    
    constructor() {
        super();

        this.loadImage('./img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }
}
