/**
 * Manages all rendering operations for the game world.
 */
class WorldRenderer {
    /**
     * Creates a WorldRenderer instance.
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Main draw loop that handles all rendering.
     */
    draw() {
        if (this.handleRestart()) return;

        this.world.collisionManager.checkCollisions();

        this.clearCanvas();
        this.drawGameWorld();
        this.drawEndScreen();
        this.scheduleNextFrame();
    }

    /**
     * Handles restart input check.
     * @returns {boolean} True if game was restarted.
     */
    handleRestart() {
        const shouldRestart = (this.world.gameStateManager.gameOver ||
            this.world.gameStateManager.gameWin) &&
            this.world.keyboard.R;

        if (shouldRestart) {
            this.world.gameStateManager.restartGame();
            return true;
        }
        return false;
    }

    /**
     * Clears the entire canvas.
     */
    clearCanvas() {
        this.world.ctx.clearRect(
            0,
            0,
            this.world.canvas.width,
            this.world.canvas.height
        );
    }

    /**
     * Draws all game world elements.
     */
    drawGameWorld() {
        this.drawBackground();
        this.drawCharacterAndEnemies();
        this.drawCollectables();
        this.drawStatusBars();
    }

    /**
     * Draws the background objects.
     */
    drawBackground() {
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /**
 * Draws character, clouds, and enemies with proper depth sorting.
 * Objects are sorted by their bottom Y position to create correct layering.
 * @returns {void}
 */
    drawCharacterAndEnemies() {
        this.world.ctx.translate(this.world.camera_x, 0);
        this.addObjectsToMap(this.world.level.cloud);

        const objectsToSort = this.collectGameObjects();
        const sortedObjects = this.sortObjectsByDepth(objectsToSort);

        this.drawSortedObjects(sortedObjects);
    }

    /**
     * Collects all game objects that need depth sorting.
     * Filters out objects marked for deletion.
     * @returns {Array<Object>} Array of game objects to be rendered
     */
    collectGameObjects() {
        const objects = [];

        objects.push(this.world.character);
        this.filterAndAddEnemies(objects);
        this.addEndBossIfActive(objects);

        return objects;
    }

    /**
     * Filters enemies marked for deletion and adds valid ones to the collection.
     * @param {Array<Object>} objects - Target array for valid enemies
     * @returns {void}
     */
    filterAndAddEnemies(objects) {
        this.world.level.enemies = this.world.level.enemies.filter(
            enemy => !enemy.markForDeletion
        );
        objects.push(...this.world.level.enemies);
    }

    /**
     * Adds the end boss to the object collection if it exists and is active.
     * Removes the end boss reference if marked for deletion.
     * @param {Array<Object>} objects - Target array for the end boss
     * @returns {void}
     */
    addEndBossIfActive(objects) {
        if (this.world.endBoss && !this.world.endBoss.markForDeletion) {
            objects.push(this.world.endBoss);
        } else if (this.world.endBoss && this.world.endBoss.markForDeletion) {
            this.world.endBoss = null;
        }
    }

    /**
     * Sorts game objects by their bottom Y position for correct depth rendering.
     * Objects with higher Y values are drawn later, appearing in front.
     * @param {Array<Object>} objects - Objects to sort
     * @returns {Array<Object>} Sorted array of objects
     */
    sortObjectsByDepth(objects) {
        return objects.sort((a, b) => {
            const aBottom = a.y + a.height;
            const bBottom = b.y + b.height;
            return aBottom - bBottom;
        });
    }

    /**
     * Draws all objects in the provided array to the canvas.
     * @param {Array<Object>} objects - Sorted objects to render
     * @returns {void}
     */
    drawSortedObjects(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }
    
    /**
     * Draws all collectable items (bottles, coins).
     */
    drawCollectables() {
        this.world.throwAbleObjects = this.world.throwAbleObjects.filter(
            bottle => !bottle.markForDeletion
        );
        this.addObjectsToMap(this.world.throwAbleObjects);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottles);

        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Draws all status bars.
     */
    drawStatusBars() {
        this.addToMap(this.world.statusBarHealth);
        this.addToMap(this.world.statusBarCoins);
        this.addToMap(this.world.statusBarBottles);

        if (this.world.statusBarBossHealth.visible) {
            this.addToMap(this.world.statusBarBossHealth);
        }
    }

    /**
     * Draws the end screen if game is over or won.
     */
    drawEndScreen() {
        if (this.world.gameStateManager.gameOver ||
            this.world.gameStateManager.gameWin) {
            this.world.ctx.save();
            this.world.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.world.gameStateManager.showEndImg(
                this.world.ctx,
                this.world.canvas
            );
            this.world.ctx.restore();
        }
    }

    /**
     * Schedules the next animation frame.
     */
    scheduleNextFrame() {
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * Adds multiple objects to the map.
     * @param {Array} objects - Array of objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the map with proper flipping.
     * @param {Object} mo - Movable object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flippImage(mo);
        }

        mo.draw(this.world.ctx);
        mo.drawFrame?.(this.world.ctx);

        if (mo.otherDirection) {
            this.flippImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally for objects facing left.
     * @param {Object} mo - Movable object to flip.
     */
    flippImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the image after flipping.
     * @param {Object} mo - Movable object to restore.
     */
    flippImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }
}