/**
 * Manages game state including game over and win conditions.
 */
class GameStateManager {
    /** @type {boolean} Whether game over has been triggered */
    gameOver = false;

    /** @type {boolean} Whether game win has been triggered */
    gameWin = false;

    /** @type {boolean} Whether game over event was already processed */
    gameOverTriggered = false;

    /** @type {boolean} Whether game win event was already processed */
    gameWinTriggered = false;

    /** @type {HTMLImageElement} Win screen image */
    winImage;

    /** @type {HTMLImageElement} Game over screen image */
    gameOverImage;

    /**
     * Creates a GameStateManager instance.
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
        this.loadEndScreenImages();
    }

    /**
     * Loads the game over and win screen images.
     */
    loadEndScreenImages() {
        this.gameOverImage = new Image();
        this.gameOverImage.src = './img/img_pollo_locco/img/You won, you lost/Game Over.png';
        this.winImage = new Image();
        this.winImage.src = './img/img_pollo_locco/img/You won, you lost/You Win A.png';
    }

    /**
     * Checks game over and win conditions.
     */
    checkGameOver() {
        if (this.isCharacterDead()) {
            this.handleGameOver();
        } else if (this.isBossDefeated()) {
            this.handleGameWin();
        }
    }

    /**
     * Checks if character is dead and game over not yet triggered.
     * @returns {boolean} True if character is dead.
     */
    isCharacterDead() {
        return this.world.character.isDead() && !this.gameOver;
    }

    /**
     * Checks if boss is defeated and game not yet won.
     * @returns {boolean} True if boss is defeated.
     */
    isBossDefeated() {
        return this.world.endBoss &&
            this.world.endBoss.energy <= 0 &&
            !this.gameWin;
    }

    /**
     * Handles game over sequence.
     */
    handleGameOver() {
        this.gameOverTriggered = true;
        this.world.audios.playSound('characterDeadSound');
        clearInterval(this.world.intervals[0]);

        setTimeout(() => {
            this.gameOver = true;
            this.world.audios.stopBackgroundMusic();
            this.world.audios.playSound('gameOverSound');
            this.world.stopGame();
        }, 2000);
    }

    /**
     * Handles game win sequence.
     */
    handleGameWin() {
        this.gameWinTriggered = true;
        clearInterval(this.world.intervals[0]);

        setTimeout(() => {
            this.gameWin = true;
            this.world.audios.stopBackgroundMusic();
            this.world.audios.playSound('winSound');
            this.world.stopGame();
        }, 2000);
    }

    /**
     * Displays the end game image (win or game over).
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @param {HTMLCanvasElement} canvas - Canvas element.
     */
    showEndImg(ctx, canvas) {
        const imgToShow = this.gameOver ? this.gameOverImage : this.winImage;
        const imgDimensions = this.calculateImageDimensions(canvas);

        this.drawEndImage(ctx, imgToShow, imgDimensions);
        this.drawRestartText(ctx, canvas, imgDimensions);
    }

    /**
     * Calculates scaled image dimensions.
     * @param {HTMLCanvasElement} canvas - Canvas element.
     * @returns {Object} Image dimensions and position.
     */
    calculateImageDimensions(canvas) {
        const scaleFactor = 0.6;
        const imgWidth = canvas.width * scaleFactor;
        const imgHeight = canvas.height * scaleFactor;
        const offsetY = -40;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = (canvas.height - imgHeight) / 2 + offsetY;

        return { imgX, imgY, imgWidth, imgHeight };
    }

    /**
     * Draws the end game image.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @param {HTMLImageElement} img - Image to draw.
     * @param {Object} dimensions - Image dimensions.
     */
    drawEndImage(ctx, img, dimensions) {
        ctx.drawImage(
            img,
            dimensions.imgX,
            dimensions.imgY,
            dimensions.imgWidth,
            dimensions.imgHeight
        );
    }

    /**
     * Draws restart instruction text.
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @param {HTMLCanvasElement} canvas - Canvas element.
     * @param {Object} dimensions - Image dimensions.
     */
    drawRestartText(ctx, canvas, dimensions) {
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';

        const isMobile = window.innerWidth <= 1181;
        const restartMessage = isMobile ?
            'Tap screen to restart' :
            'Press R to restart';
        const textY = dimensions.imgY + dimensions.imgHeight + 50;

        ctx.strokeText(restartMessage, canvas.width / 2, textY);
        ctx.fillText(restartMessage, canvas.width / 2, textY);
    }

    /**
 * Cleans up game resources.
 */
    cleanup() {
        this.world.stopGame();
        if (this.world.animationFrameId) {
            cancelAnimationFrame(this.world.animationFrameId);
            this.world.animationFrameId = null;
        }
        this.world.audios.stopBackgroundMusic();
        this.world.audios.stopAllSounds();
        this.world.throwAbleObjects = [];
        this.world.level.enemies = [];
        this.world.level.coins = [];
        this.world.level.bottles = [];
        this.world.ctx.clearRect(0, 0,
            this.world.canvas.width,
            this.world.canvas.height
        );
    }

    /**
     * Restarts the game by resetting all states.
     */
    restartGame() {
        this.cleanup();
        this.resetGameState();
        this.resetGameObjects();
        this.resetStatusBars();
        this.restartGameSystems();
    }

    /**
     * Resets game state flags.
     */
    resetGameState() {
        this.gameOver = false;
        this.gameWin = false;
        this.gameOverTriggered = false;
        this.gameWinTriggered = false;
        this.world.camera_x = 0;
        this.world.bossSpawned = false;
    }

    /**
     * Resets game objects to initial state.
     */
    resetGameObjects() {
        this.world.level = createLevel1();
        this.world.character = new Character();
        this.world.character.x = 120;
        this.world.endBoss = null;
        this.world.throwAbleObjects = [];
    }

    /**
     * Resets all status bars to initial values.
     */
    resetStatusBars() {
        this.world.statusBarHealth.setPercentage(100);
        this.world.statusBarCoins.setPercentage(0);
        this.world.statusBarBottles.setPercentage(0);
        this.world.statusBarBossHealth.setPercentage(100);
        this.world.statusBarBossHealth.visible = false;
    }

    /**
     * Restarts game systems and loops.
     */
    restartGameSystems() {
        this.world.setWorld();
        this.world.run();
        this.world.audios.playBackgroundMusic();
        this.world.draw();
    }
}