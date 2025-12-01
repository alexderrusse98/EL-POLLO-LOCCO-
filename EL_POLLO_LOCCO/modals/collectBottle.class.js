/**
 * Represents a collectible bottle that can be picked up by the player.
 * @extends MovableObject
 */
class CollectableBottle extends MovableObject {
    /** @type {number} Width of the bottle */
    width = 70;
    
    /** @type {number} Height of the bottle */
    height = 80;
    
    /** @type {number} Vertical position of the bottle */
    y = 200;

    /**
     * Creates a CollectableBottle instance at the specified horizontal position.
     * @param {number} x - The x-coordinate position of the bottle.
     */
    constructor(x) {
        super();
        this.loadImage('./img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = 350;
    }
}