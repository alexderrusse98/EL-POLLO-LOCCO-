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
    IMAGES_WALKING = [
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        './img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
    ];
    
    IMAGES_DEAD = [
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
        './img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        './img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
        './img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
        './img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONGIDLE = [
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

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
