/**
 * Manages all game state transitions such as game over and win conditions.
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
     * @constructor
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
        this.loadEndScreenImages();
    }

    /**
     * Loads the game over and win screen images.
     * @returns {void}
     */
    loadEndScreenImages() {
        this.gameOverImage = new Image();
        this.gameOverImage.src = './img/img_pollo_locco/img/You won, you lost/Game Over.png';

        this.winImage = new Image();
        this.winImage.src = './img/img_pollo_locco/img/You won, you lost/You Win A.png';
    }

    /**
     * Evaluates win or game over conditions and triggers appropriate handlers.
     * @returns {void}
     */
    checkGameOver() {
        if (this.isCharacterDead()) {
            this.handleGameOver();
        } else if (this.isBossDefeated()) {
            this.handleGameWin();
        }
    }

    /**
     * Determines whether the character is dead and game over not yet triggered.
     * @returns {boolean} True if character is dead and no game over processed.
     */
    isCharacterDead() {
        return this.world.character.isDead() && !this.gameOver;
    }

    /**
     * Determines whether the boss is defeated and game win not yet triggered.
     * @returns {boolean} True if the boss is defeated.
     */
    isBossDefeated() {
        return (
            this.world.endBoss &&
            this.world.endBoss.energy <= 0 &&
            !this.gameWin
        );
    }

    /**
     * Handles game over logic (cleanup, audio, UI, flags).
     * @returns {void}
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
            this.hideMobileControls();
        }, 2000);
    }

    /**
     * Handles game win logic (cleanup, audio, UI, flags).
     * @returns {void}
     */
    handleGameWin() {
        this.gameWinTriggered = true;

        clearInterval(this.world.intervals[0]);

        setTimeout(() => {
            this.gameWin = true;
            this.world.audios.stopBackgroundMusic();
            this.world.audios.playSound('winSound');
            this.world.stopGame();
            this.hideMobileControls();
        }, 2000);
    }

    /**
     * Draws the final screen image (win or game over) and restart text.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {HTMLCanvasElement} canvas - Canvas element used for rendering.
     * @returns {void}
     */
    showEndImg(ctx, canvas) {
        const imgToShow = this.gameOver ? this.gameOverImage : this.winImage;
        const imgDimensions = this.calculateImageDimensions(canvas);

        this.drawEndImage(ctx, imgToShow, imgDimensions);
        this.drawRestartText(ctx, canvas, imgDimensions);
    }

    /**
     * Computes properly scaled image dimensions for the end screen.
     * @param {HTMLCanvasElement} canvas - Canvas element.
     * @returns {{imgX:number, imgY:number, imgWidth:number, imgHeight:number}} Scaled dimensions.
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
     * Draws the end screen image.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {HTMLImageElement} img - Image to draw.
     * @param {{imgX:number,imgY:number,imgWidth:number,imgHeight:number}} dimensions - Image dimensions.
     * @returns {void}
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
     * Draws restart instructions depending on device type.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {HTMLCanvasElement} canvas - Canvas element.
     * @param {{imgY:number,imgHeight:number}} dimensions - Image geometry.
     * @returns {void}
     */
    drawRestartText(ctx, canvas, dimensions) {
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';

        const isMobile = window.innerWidth <= 1181;
        const restartMessage = isMobile ? 'Tap screen to restart' : 'Press R to restart';
        const textY = dimensions.imgY + dimensions.imgHeight + 50;

        ctx.strokeText(restartMessage, canvas.width / 2, textY);
        ctx.fillText(restartMessage, canvas.width / 2, textY);
    }

    /**
  * Fully cleans up running game systems before restart.
  * @returns {void}
  */
    cleanup() {
        this.stopGameLoops();
        this.cleanupAudio();
        this.resetWorldArrays();
        this.clearCanvas();
    }

    /**
     * Stops running game loops & animation frames.
     */
    stopGameLoops() {
        this.world.stopGame();

        if (this.world.animationFrameId) {
            cancelAnimationFrame(this.world.animationFrameId);
            this.world.animationFrameId = null;
        }
    }

    /**
     * Stops all audio playback.
     */
    cleanupAudio() {
        this.world.audios.stopBackgroundMusic();
        this.world.audios.stopAllSounds();
    }

    /**
     * Clears enemies, items, and thrown objects from the world.
     */
    resetWorldArrays() {
        this.world.throwAbleObjects = [];
        this.world.level.enemies = [];
        this.world.level.coins = [];
        this.world.level.bottles = [];
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
     * Restarts the entire game by resetting objects, bars, and systems.
     * @returns {void}
     */
    restartGame() {
        this.cleanup();
        this.resetGameState();
        this.resetGameObjects();
        this.resetStatusBars();
        this.restartGameSystems();
        this.showMobileControls();
    }

    /**
     * Hides mobile control UI.
     * @returns {void}
     */
    hideMobileControls() {
        const mobileControls = document.getElementById('mobileControls');
        if (mobileControls) {
            mobileControls.classList.add('hidden');
        }
    }

    /**
     * Shows mobile controls unless device orientation is portrait.
     * @returns {void}
     */
    showMobileControls() {
        const mobileControls = document.getElementById('mobileControls');
        const isPortrait = window.innerHeight > window.innerWidth;

        if (mobileControls && !isPortrait) {
            mobileControls.classList.remove('hidden');
        }
    }

    /**
     * Resets game state flags and camera.
     * @returns {void}
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
     * Resets all major game objects (character, enemies, items).
     * @returns {void}
     */
    resetGameObjects() {
        this.world.level = createLevel1();
        this.world.character = new Character();
        this.world.character.x = 120;
        this.world.endBoss = null;
        this.world.throwAbleObjects = [];
    }

    /**
     * Resets all HUD status bars to initial values.
     * @returns {void}
     */
    resetStatusBars() {
        this.world.statusBarHealth.setPercentage(100);
        this.world.statusBarCoins.setPercentage(0);
        this.world.statusBarBottles.setPercentage(0);
        this.world.statusBarBossHealth.setPercentage(100);
        this.world.statusBarBossHealth.visible = false;
    }

    /**
     * Restarts all game loops, world systems, and audio.
     * @returns {void}
     */
    restartGameSystems() {
        this.world.setWorld();
        this.world.run();
        this.world.audios.playBackgroundMusic();
        this.world.draw();
    }
}
