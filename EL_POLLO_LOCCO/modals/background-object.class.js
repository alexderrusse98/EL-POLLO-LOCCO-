/**
 * Class representing a background object in the game.
 * Extends MovableObject to allow movement and positioning.
 */
class BackgroundObject extends MovableObject {
    /** Default width of the background object */
    width = 720;

    /** Default height of the background object */
    height = 480;

    /**
     * Creates a background object with a specific image and horizontal position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);

        /** Horizontal position of the background object */
        this.x = x;

        /** Vertical position, anchored to the bottom of the canvas */
        this.y = 480 - this.height;
    }
}
