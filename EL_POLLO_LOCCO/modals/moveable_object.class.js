class MovableObject extends DrawableObject {
   speed = 0.15;
   otherDirection = false;
   speedY = 0;
   acceleration = 2.5;
   energy = 100;
   lastHit = 0;

   intervals = [];

   stopAllIntervals() {
      this.intervals.forEach(clearInterval);
      this.intervals = [];
   }


   applyGravity() {
      this.intervals.push(
         setInterval(() => {

            if (this.isDead && this.isDead()) return;

            if (!this.isAboveGround()) {
               if (this instanceof ThrowableObject && !this.hasSplashed) {
                  this.hasSplashed = true;
                  this.animateSplash();
                  return;
               }

            }
            // Character is above ground
            if (this.isAboveGround() || this.speedY > 0) {
               this.y -= this.speedY;
               this.speedY -= this.acceleration;
            }
         }, 1000 / 25)
      );
   }


   isAboveGround() {
      const ground = 220;

      if (this instanceof ThrowableObject) {
         return this.y < 350;
      }

      return this.y < ground;
   }


   // verbessern und deutlicher machen
   playAnimationOnce(images, callback, intervalTime = 100) {
      let i = 0;

      if (this.idleInterval) { clearInterval(this.idleInterval); this.idleInterval = null; }
      if (this.longIdleInterval) { clearInterval(this.longIdleInterval); this.longIdleInterval = null; }

      const interval = setInterval(() => {
         this.img = this.imageCache[images[i]];
         i++;
         if (i >= images.length) {
            clearInterval(interval);
            callback?.();
         }
      }, intervalTime);
      this.intervals.push(interval);
      if (images === this.IMAGES_IDLE) this.idleInterval = interval;
      if (images === this.IMAGES_LONGIDLE) this.longIdleInterval = interval;
   }


   playAnimation(images) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
   }


   moveRight() {
      this.x += this.speed;
   }

   moveLeft() {
      this.x -= this.speed;
   }

   // Character hitbox
   getHitbox() {
      let offset = {
         left: 20,
         right: 20,
         top: 20,
         bottom: 20
      };

      if (this instanceof Character) {
         offset = {
            left: 25,
            right: 25,
            top: 5,
            bottom: 10
         };
      }
      if (this instanceof ChickenBase) {
         offset = {
            left: 10,
            right: 10, 
            top: 0,
            bottom: 0,
         };
      }
      return {
         x: this.x + offset.left,
         y: this.y + offset.top,
         width: this.width - offset.left - offset.right,
         height: this.height - offset.top - offset.bottom
      };
   }
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


   hit() {
      this.energy -= 20;
      if (this.energy < 0) {
         this.energy = 0;

      } else {
         this.lastHit = new Date().getTime();
      }
      if (this.energy > 0 && this.world && this.world.audios && this instanceof Character) {
         this.world.audios.playSound('characterHurtSound');
      }
   }

   isHurt() {
      let timepassed = new Date().getTime() - this.lastHit;
      timepassed = timepassed / 1000; // Differnce in sek
      return timepassed < 1.5;
   }

   isDead() {
      return this.energy == 0;
   }
}