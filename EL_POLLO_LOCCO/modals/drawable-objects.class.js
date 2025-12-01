/**
 * Base class for all drawable objects in the game.
 * Handles image loading, caching, and rendering.
 */
class DrawableObject {
    /** @type {number} Horizontal position of the object */
    x = 120;
    
    /** @type {number} Vertical position of the object */
    y = 340;
    
    /** @type {number} Height of the object */
    height = 100;
    
    /** @type {number} Width of the object */
    width = 100;
    
    /** @type {HTMLImageElement} Current image element */
    img;
    
    /** @type {Object.<string, HTMLImageElement>} Cache for preloaded images */
    imageCache = {};
    
    /** @type {number} Index of the current animation frame */
    currentImage = 0;

    /**
     * Loads a single image from the specified path.
     * @param {string} path - The file path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images and stores them in the image cache.
     * @param {string[]} arr - Array of image file paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object's current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a debug frame around the object's hitbox.
     * Only renders for Character and ChickenBase instances.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof ChickenBase) {
            const hb = this.getHitbox();

            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';
            ctx.rect(hb.x, hb.y, hb.width, hb.height);
            ctx.stroke();
        }
    }
}