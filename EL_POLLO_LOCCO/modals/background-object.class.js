/**
 * Class representing a background object in the game.
 * Extends MovableObject to allow movement and positioning.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a background object with a specific image and horizontal position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
