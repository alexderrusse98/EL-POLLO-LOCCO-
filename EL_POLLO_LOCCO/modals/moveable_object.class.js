/**
 * Base class for all movable objects in the game.
 * Extends DrawableObject with movement, physics, collision, and animation capabilities.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
   /** @type {number} Movement speed of the object */
   speed = 0.15;

   /** @type {boolean} Whether the object is facing the opposite direction */
   otherDirection = false;

   /** @type {number} Vertical speed for jumping and falling */
   speedY = 0;

   /** @type {number} Gravity acceleration rate */
   acceleration = 2.5;

   /** @type {number} Health/energy of the object (0-100) */
   energy = 100;

   /** @type {number} Timestamp of the last hit received */
   lastHit = 0;

   /** @type {number[]} Array of active interval IDs for cleanup */
   intervals = [];

   /**
    * Stops and clears all active intervals.
    */
   stopAllIntervals() {
      this.intervals.forEach(clearInterval);
      this.intervals = [];
   }

   /**
    * Applies gravity to the object by starting a gravity interval.
    */
   applyGravity() {
      this.intervals.push(
         setInterval(() => {
            this.updateGravity();
         }, 1000 / 25)
      );
   }

   /**
    * Updates the object's position and velocity based on gravity.
    */
   updateGravity() {
      if (this.shouldSkipGravity()) return;

      if (this.shouldHandleSplash()) {
         this.handleSplash();
         return;
      }

      if (this.shouldApplyFalling()) {
         this.applyFalling();
      }
   }

   /**
    * Checks if gravity update should be skipped (e.g., when dead).
    * @returns {boolean} True if gravity should be skipped.
    */
   shouldSkipGravity() {
      return this.isDead && this.isDead();
   }

   /**
    * Checks if object should handle splash animation.
    * @returns {boolean} True if splash should be handled.
    */
   shouldHandleSplash() {
      return !this.isAboveGround() &&
         this instanceof ThrowableObject &&
         !this.hasSplashed;
   }

   /**
    * Handles the splash animation for throwable objects.
    */
   handleSplash() {
      this.hasSplashed = true;
      this.animateSplash();
   }

   /**
    * Checks if falling physics should be applied.
    * @returns {boolean} True if object should fall.
    */
   shouldApplyFalling() {
      return this.isAboveGround() || this.speedY > 0;
   }

   /**
    * Applies falling physics by updating position and speed.
    */
   applyFalling() {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
   }

   /**
    * Checks if the object is above the ground level.
    * @returns {boolean} True if object is above ground.
    */
   isAboveGround() {
      const ground = 220;

      if (this instanceof ThrowableObject) {
         return this.y < 350;
      }

      return this.y < ground;
   }

   /**
    * Plays an animation sequence once and executes a callback when finished.
    * @param {string[]} images - Array of image paths for the animation.
    * @param {Function} [callback] - Optional callback function to execute after animation.
    * @param {number} [intervalTime=100] - Time between frames in milliseconds.
    */
   playAnimationOnce(images, callback, intervalTime = 100) {
      this.clearIdleIntervals();
      const interval = this.createAnimationInterval(images, callback, intervalTime);
      this.storeInterval(interval, images);
   }

   /**
    * Clears any active idle animation intervals.
    */
   clearIdleIntervals() {
      if (this.idleInterval) {
         clearInterval(this.idleInterval);
         this.idleInterval = null;
      }
      if (this.longIdleInterval) {
         clearInterval(this.longIdleInterval);
         this.longIdleInterval = null;
      }
   }

   /**
 * Creates an interval for playing animation frames sequentially.
 * @param {string[]} images - Array of image paths for the animation.
 * @param {Function} [callback] - Optional callback function to execute after animation.
 * @param {number} intervalTime - Time between frames in milliseconds.
 * @returns {number} The interval ID.
 */
   createAnimationInterval(images, callback, intervalTime) {
      let i = 0;
      const interval = setInterval(() => {
         this.updateAnimationFrame(images, i);
         i++;
         if (this.isAnimationComplete(i, images.length)) {
            clearInterval(interval);
            callback?.();
         }
      }, intervalTime);
      return interval;
   }

   /**
    * Updates the current animation frame.
    * @param {string[]} images - Array of image paths.
    * @param {number} index - Current frame index.
    */
   updateAnimationFrame(images, index) {
      this.img = this.imageCache[images[index]];
   }

   /**
    * Checks if the animation has completed all frames.
    * @param {number} currentIndex - Current frame index.
    * @param {number} totalFrames - Total number of frames.
    * @returns {boolean} True if animation is complete.
    */
   isAnimationComplete(currentIndex, totalFrames) {
      return currentIndex >= totalFrames;
   }

   /**
    * Finishes the animation by clearing the interval and executing callback.
    * @param {Function} [callback] - Optional callback function to execute.
    */
   finishAnimation(callback) {
      clearInterval(event.target);
      callback?.();
   }

   /**
    * Stores the interval reference for tracking and cleanup.
    * @param {number} interval - The interval ID.
    * @param {string[]} images - Array of image paths to identify animation type.
    */
   storeInterval(interval, images) {
      this.intervals.push(interval);
      if (images === this.IMAGES_IDLE) this.idleInterval = interval;
      if (images === this.IMAGES_LONGIDLE) this.longIdleInterval = interval;
   }

   /**
    * Plays a looping animation by cycling through image frames.
    * @param {string[]} images - Array of image paths for the animation.
    */
   playAnimation(images) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
   }

   /**
    * Moves the object to the right by its speed value.
    */
   moveRight() {
      this.x += this.speed;
   }

   /**
    * Moves the object to the left by its speed value.
    */
   moveLeft() {
      this.x -= this.speed;
   }

   /**
    * Gets the hitbox dimensions for collision detection.
    * @returns {Object} Hitbox with x, y, width, and height properties.
    */
   getHitbox() {
      const offset = this.getHitboxOffset();
      return this.calculateHitbox(offset);
   }

   /**
    * Determines the hitbox offset based on object type.
    * @returns {Object} Offset values for left, right, top, and bottom.
    */
   getHitboxOffset() {
      if (this instanceof Character) {
         return this.getCharacterOffset();
      }
      if (this instanceof ChickenBase) {
         return this.getChickenOffset();
      }
      return this.getDefaultOffset();
   }

   /**
    * Returns default hitbox offset values.
    * @returns {Object} Default offset with left, right, top, bottom properties.
    */
   getDefaultOffset() {
      return {
         left: 20,
         right: 20,
         top: 20,
         bottom: 20
      };
   }

   /**
    * Returns hitbox offset values for Character objects.
    * @returns {Object} Character offset with left, right, top, bottom properties.
    */
   getCharacterOffset() {
      return {
         left: 25,
         right: 25,
         top: 75,
         bottom: 10
      };
   }

   /**
    * Returns hitbox offset values for ChickenBase objects.
    * @returns {Object} Chicken offset with left, right, top, bottom properties.
    */
   getChickenOffset() {
      return {
         left: 10,
         right: 10,
         top: 15,
         bottom: 15,
      };
   }

   /**
    * Calculates the final hitbox position and dimensions.
    * @param {Object} offset - Offset values for all sides.
    * @returns {Object} Hitbox with x, y, width, and height.
    */
   calculateHitbox(offset) {
      return {
         x: this.x + offset.left,
         y: this.y + offset.top,
         width: this.width - offset.left - offset.right,
         height: this.height - offset.top - offset.bottom
      };
   }

   /**
    * Checks if this object is colliding with another movable object.
    * @param {MovableObject} mo - The other movable object to check collision with.
    * @returns {boolean} True if objects are colliding.
    */
   isColliding(mo) {
      const a = this.getHitbox();
      const b = mo.getHitbox();

      return (
         a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y
      );
   }

   /**
    * Applies damage to the object by reducing energy.
    * Updates lastHit timestamp and plays hurt sound for Character instances.
    */
   hit() {
      this.energy -= 20;
      if (this.energy < 0) {
         this.energy = 0;

      } else {
         this.lastHit = new Date().getTime();
      }

      setTimeout(() => {
         if (!this.isAttackAnimation && this.energy > 0 && !this.isHurt()) {
            this.attack();
         }
      }, 600);

      if (this.energy > 0 && this.world && this.world.audios && this instanceof Character) {
         this.world.audios.playSound('characterHurtSound');
      }
   }

   /**
    * Checks if the object was recently hurt (within last 1.5 seconds).
    * @returns {boolean} True if object is in hurt state.
    */
   isHurt() {
      let timepassed = new Date().getTime() - this.lastHit;
      timepassed = timepassed / 1000;
      return timepassed < 1.5;
   }

   /**
    * Checks if the object is dead (energy depleted).
    * @returns {boolean} True if object's energy is 0.
    */
   isDead() {
      return this.energy == 0;
   }
}