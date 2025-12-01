/**
 * Class representing the main character in the game.
 * Extends MovableObject to use physics, movement, and collisions.
 */
class Character extends MovableObject {
    /** Reference to the game's audio manager */
    audios;

    /** Character's height in pixels */
    height = 200;

    /** Character's vertical position */
    y = 120;

    /** Horizontal movement speed */
    speed = 5;

    /** Number of bottles the character currently has */
    bottleCount = 0;

    /** Whether the character is currently throwing a bottle */
    isThrowingBottle = false;

    /** Timestamp of last bottle throw */
    lastThrowTime = 0;

    /** Minimum cooldown between throws in milliseconds */
    throwCooldown = 500;

    /** Holds all active intervals for animations and logic updates */
    intervals = [];

    /** Timestamp of the last movement for idle animations */
    lastMoveTime = new Date().getTime();

    /** Arrays of image paths for character animations */
    IMAGES_WALKING = [ /* walking frames */];
    IMAGES_JUMPING = [ /* jumping frames */];
    IMAGES_DEAD = [ /* death frames */];
    IMAGES_HURT = [ /* hurt frames */];
    IMAGES_IDLE = [ /* idle frames */];
    IMAGES_LONGIDLE = [ /* long idle frames */];

    /** Reference to the game world */
    world;

    /**
     * Constructor loads images, applies gravity, and initializes the animator.
     */
    constructor() {
        // Load default walking image
        super().loadImage('./img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');

        // Load all animation images
        this.loadAllImages();

        // Enable gravity for the character
        this.applyGravity();

        // Create a CharacterAnimator to handle animations
        this.animator = new CharacterAnimator(this);

        // Start game logic and animation intervals
        this.animate();

        // Store initial bottom position
        this.previousBottom = this.y + this.height;
    }

    /** Loads all animation images for the character */
    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
    }

    /** Stops all intervals to pause animations and game logic */
    stopAllIntervals() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }

    /**
     * Handles movement input from the keyboard.
     * @returns {boolean} True if the character moved or acted this frame
     */
    handleMovement() {
        if (this.isDead()) return false;

        return this.handleRightMovement() |
            this.handleLeftMovement() |
            this.handleJump() |
            this.handleThrow();
    }

    /** Moves the character right if the RIGHT key is pressed */
    handleRightMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            return true;
        }
        return false;
    }

    /** Moves the character left if the LEFT key is pressed */
    handleLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            return true;
        }
        return false;
    }

    /**
     * Handles throwing bottles with cooldown.
     * @returns {boolean} True if a bottle was thrown this frame
     */
    handleThrow() {
        const now = new Date().getTime();
        const timeSinceLastThrow = now - this.lastThrowTime;

        if (this.world.keyboard.D &&
            this.bottleCount > 0 &&
            timeSinceLastThrow >= this.throwCooldown) {

            this.isThrowingBottle = true;
            this.lastThrowTime = now;
            return true;
        }
        return false;
    }

    /**
     * Updates the camera position based on the character's x position.
     */
    updateCamera() {
        if (!this.isDead()) {
            const cameraStartX = 300;
            const cameraOffset = 300;

            if (this.x > cameraStartX) {
                this.world.camera_x = -this.x + cameraOffset;
            } else {
                this.world.camera_x = 0;
            }
        }
    }

    /**
     * Resets idle states when the character moves.
     * Stops long idle sounds and animations.
     * @param {boolean} moved - Whether the character moved this frame
     */
    checkMovementState(moved) {
        if (moved) {
            this.lastMoveTime = new Date().getTime();
            this.animator.isIdleAnimationOn = false;
            this.animator.isLongIdleAnimationOn = false;

            if (this.world && this.world.audios) {
                this.world.audios.stopLoopSound();
            }
        }
    }

    /**
     * Starts the main animation and game logic intervals.
     * Runs 60 times per second for movement and 20 times per second for animations.
     */
    animate() {
        this.intervals.push(
            setInterval(() => this.updateGameLogic(), 1000 / 60)
        );

        this.intervals.push(
            setInterval(() => this.animator.animateCharacter(), 50)
        );
    }

    /** Handles the per-frame game logic */
    updateGameLogic() {
        const moved = this.handleMovement();
        this.updateCamera();
        this.checkMovementState(moved);
    }

    /**
     * Initiates a jump if the character is not already jumping
     */
    jump() {
        if (!this.animator.isJumpAnimationOn) {
            this.animator.isJumpAnimationOn = true;
            this.speedY = 30;
            this.jumpStartY = this.y;
        }
    }

    /**
     * Checks if the character landed on an enemy from above.
     * @param {Object} enemy - Enemy object to check collision with
     * @returns {boolean} True if the enemy was hit
     */
    checkJumpOnEnemy(enemy) {
        if (this.speedY >= 0 || enemy.isDead) return false;

        const playerBounds = this.getPlayerJumpBounds();
        const enemyBounds = this.getEnemyBounds(enemy);

        if (this.isJumpHit(playerBounds, enemyBounds)) {
            this.executeJumpKill(enemy);
            return true;
        }
        return false;
    }

    /** Returns the bounding box of the character for jumping */
    getPlayerJumpBounds() {
        const xTolerance = 60;
        return {
            left: this.x - xTolerance,
            right: this.x + this.width + xTolerance,
            bottom: this.y + this.height
        };
    }

    /** Returns the bounding box of an enemy for collision detection */
    getEnemyBounds(enemy) {
        return {
            left: enemy.x,
            right: enemy.x + enemy.width,
            top: enemy.y
        };
    }

    /**
     * Determines if the character is hitting an enemy from above
     * @param {Object} playerBounds - Bounding box of the player
     * @param {Object} enemyBounds - Bounding box of the enemy
     * @returns {boolean} True if collision occurs
     */
    isJumpHit(playerBounds, enemyBounds) {
        const yTolerance = 50;
        const horizontalHit = playerBounds.right > enemyBounds.left &&
            playerBounds.left < enemyBounds.right;
        const verticalHit = playerBounds.bottom >= enemyBounds.top &&
            playerBounds.bottom <= enemyBounds.top + yTolerance;
        return horizontalHit && verticalHit;
    }

    /**
     * Executes the enemy death logic when jumped on
     * @param {Object} enemy - Enemy object
     */
    executeJumpKill(enemy) {
        enemy.deadChicken();
        this.speedY = 15;
    }

    /**
     * Handles jump input and initiates jump animation
     * @returns {boolean} True if a jump was performed
     */
    handleJump() {
        if (this.world.keyboard.SPACE &&
            !this.isAboveGround() &&
            !this.animator.isJumpAnimationOn) {
            this.jump();
            if (this.world && this.world.audios) {
                this.world.audios.playSound('jumpSound');
            }
            return true;
        }
        return false;
    }
}
