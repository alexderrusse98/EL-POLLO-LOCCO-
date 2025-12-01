/**
 * Represents a collectible coin in the game.
 * @extends MovableObject
 */
class Coin extends MovableObject {

    /**
     * Creates a Coin instance at the specified position.
     * @param {number} x - The x-coordinate position of the coin.
     * @param {number} y - The y-coordinate position of the coin.
     */
    constructor(x, y) {
        super();
        this.loadImage('./img/img_pollo_locco/img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
    }
}