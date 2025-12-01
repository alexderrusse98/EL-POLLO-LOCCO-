/**
 * Represents a game level containing all game objects and boundaries.
 * Manages enemies, clouds, background objects, collectibles, and level dimensions.
 */
class Level {
    /** @type {Array} Array of enemy objects in the level */
    enemies;
    
    /** @type {Array} Array of cloud objects in the level */
    cloud;
    
    /** @type {Array} Array of background decoration objects */
    backgroundObjects;
    
    /** @type {number} The x-coordinate where the level ends */
    level_end_x = 3000;
    
    /** @type {Array} Array of collectible coin objects */
    coins;
    
    /** @type {Array} Array of collectible bottle objects */
    bottles;

    /**
     * Creates a Level instance with all game objects.
     * @param {Array} enemies - Array of enemy objects.
     * @param {Array} cloud - Array of cloud objects.
     * @param {Array} backgroundObjects - Array of background objects.
     * @param {Array} coins - Array of collectible coins.
     * @param {Array} bottles - Array of collectible bottles.
     */
    constructor(enemies, cloud, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.cloud = cloud;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}