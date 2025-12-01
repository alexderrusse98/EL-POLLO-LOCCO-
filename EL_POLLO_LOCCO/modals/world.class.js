/**
 * Main game world class that coordinates all game systems.
 */
class World {
    /** @type {AudioManager} Audio manager instance */
    audios;

    /** @type {Character} Player character */
    character = new Character();

    /** @type {Endboss} End boss enemy */
    endBoss = null;

    /** @type {boolean} Whether boss has been spawned */
    bossSpawned = false;

    /** @type {Level} Current game level */
    level;

    /** @type {HTMLCanvasElement} Canvas element */
    canvas;

    /** @type {CanvasRenderingContext2D} Canvas context */
    ctx;

    /** @type {Keyboard} Keyboard input handler */
    keyboard;

    /** @type {number} Camera x position */
    camera_x = 0;

    /** @type {StatusBar} Health status bar */
    statusBarHealth;

    /** @type {StatusBar} Coins status bar */
    statusBarCoins;

    /** @type {StatusBar} Bottles status bar */
    statusBarBottles;

    /** @type {StatusBar} Boss health status bar */
    statusBarBossHealth;

    /** @type {number[]} Array of active interval IDs */
    intervals = [];

    /** @type {Array} Array of thrown bottle objects */
    throwAbleObjects = [];

    /** @type {number} Number of collected coins */
    coins = 0;

    /** @type {number} Number of collected bottles */
    bottles = 0;

    /** @type {number} Timestamp of last throw action */
    lastThrowTime = 0;

    /**
     * Creates a World instance and initializes all game systems.
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering.
     * @param {Keyboard} keyboard - Keyboard input handler.
     * @param {AudioManager} audioManager - Audio manager instance.
     */
    constructor(canvas, keyboard, audioManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audios = audioManager;

        this.initializeManagers();
        this.initializeStatusBars();
        this.initializeTouchControls();
        this.startGame();
    }

    /**
     * Initializes all manager instances.
     */
    initializeManagers() {
        this.collisionManager = new CollisionManager(this);
        this.gameStateManager = new GameStateManager(this);
        this.renderer = new WorldRenderer(this);
    }

    /**
     * Initializes all status bars.
     */
    initializeStatusBars() {
        this.statusBarHealth = new StatusBar('health', 40, 0);
        this.statusBarCoins = new StatusBar('coin', 40, 60);
        this.statusBarBottles = new StatusBar('bottle', 40, 120);
        this.statusBarBossHealth = new StatusBar('endbossHealth', 480, 0);

        this.statusBarBossHealth.visible = false;
        this.statusBarCoins.setPercentage(0);
        this.statusBarBottles.setPercentage(0);
    }

    /**
     * Cleans up game resources (delegates to GameStateManager).
     */
    cleanup() {
        this.gameStateManager.cleanup();
    }

    /**
     * Restarts the game (delegates to GameStateManager).
     */
    restartGame() {
        this.gameStateManager.restartGame();
    }

    /**
     * Initializes touch controls for mobile devices.
     */
    initializeTouchControls() {
        this.canvas.addEventListener('touchstart', () => {
            if (this.isMobileRestartCondition()) {
                this.gameStateManager.restartGame();
            }
        });
    }

    /**
     * Checks if mobile restart condition is met.
     * @returns {boolean} True if should restart on mobile.
     */
    isMobileRestartCondition() {
        return (this.gameStateManager.gameOver ||
            this.gameStateManager.gameWin) &&
            window.innerWidth <= 1000;
    }

    /**
     * Starts the game by initializing level and systems.
     */
    startGame() {
        this.level = level1;
        this.setWorld();
        this.run();
        this.audios.playBackgroundMusic();
        this.renderer.draw();
    }

    /**
     * Sets world reference in character and boss.
     */
    setWorld() {
        this.character.world = this;
        if (this.endBoss) {
            this.endBoss.world = this;
        }
    }

    /**
     * Spawns the endboss if not already spawned.
     */
    spawnEndboss() {
        if (!this.bossSpawned) {
            this.endBoss = new Endboss();
            this.endBoss.world = this;
            this.bossSpawned = true;
        }
    }

    /**
     * Checks if endboss should spawn based on character position.
     */
    checkEndBossSpawn() {
        if (this.character.x >= 2000 && !this.bossSpawned) {
            this.spawnEndboss();
        }
    }

    /**
     * Starts the main game loop intervals.
     */
    run() {
        this.intervals.push(
            setInterval(() => {
                this.checkEndBossSpawn();
                this.checkEndBossAlert();
                this.gameStateManager.checkGameOver();
            }, 200)
        );

        this.intervals.push(
            setInterval(() => {
                this.checkThrowObjects();
            }, 100)
        );
    }

    /**
     * Stops all game intervals and clears them.
     */
    stopGame() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];

        this.character.stopAllIntervals();

        if (this.endBoss) {
            this.endBoss.stopAllIntervals();
        }

        this.level.enemies.forEach(enemy => {
            enemy.stopAllIntervals();
        });
    }

    /**
     * Checks endboss alert state based on distance to character.
     */
    checkEndBossAlert() {
        if (!this.endBoss || this.endBoss.energy <= 0) return;

        const distance = Math.abs(this.character.x - this.endBoss.x);

        if (distance < 150) {
            this.handleCloseRange();
        } else if (distance < 300) {
            this.handleMediumRange();
        } else {
            this.handleFarRange();
        }
    }

    /**
     * Handles boss behavior when character is very close.
     */
    handleCloseRange() {
        if (!this.endBoss.isAttackAnimation && this.endBoss.isAlerted) {
            this.endBoss.attack();
        }
    }

    /**
     * Handles boss behavior when character is at medium distance.
     */
    handleMediumRange() {
        if (!this.endBoss.isAlerted && !this.endBoss.isAttackAnimation) {
            this.audios.playSound('bossChickenStartSound');
            this.endBoss.isAlerted = true;
            this.statusBarBossHealth.visible = true;
        }
    }

    /**
     * Handles boss behavior when character is far away.
     */
    handleFarRange() {
        if (this.endBoss.isAlerted && !this.endBoss.isAttackAnimation) {
            this.endBoss.isAlerted = false;
        }
    }

    /**
     * Checks if character should throw a bottle.
     */
    checkThrowObjects() {
        const now = new Date().getTime();
        const timeSinceLastThrow = now - this.lastThrowTime;

        if (this.canThrowBottle(timeSinceLastThrow)) {
            this.throwBottle();
        }
    }

    /**
     * Checks if character can throw a bottle.
     * @param {number} timeSinceLastThrow - Time since last throw in ms.
     * @returns {boolean} True if can throw.
     */
    canThrowBottle(timeSinceLastThrow) {
        return this.keyboard.D &&
            this.character.bottleCount > 0 &&
            timeSinceLastThrow >= 500;
    }

    /**
     * Throws a bottle and updates game state.
     */
    throwBottle() {
        const bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100
        );
        this.throwAbleObjects.push(bottle);
        this.character.bottleCount--;
        this.audios.playSound('throw');
        this.statusBarBottles.setPercentage(
            Math.max(this.statusBarBottles.percentage - 20, 0)
        );
        this.lastThrowTime = new Date().getTime();
    }

    /**
     * Main draw method delegated to renderer.
     */
    draw() {
        this.renderer.draw();
    }
}