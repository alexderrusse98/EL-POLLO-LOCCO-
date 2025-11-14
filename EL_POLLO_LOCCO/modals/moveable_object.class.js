class MovableObject extends DrawableObject {
   speed = 0.15;
   ortherDirection = false;
   speedY = 0;
   acceleration = 2.5;
   energy = 100;
   lastHit = 0;

   applyGravity() {
      setInterval(() => {

         if (this.isDead && this.isDead()) return;

         if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
         }
      }, 1000 / 25);
   }


   isAboveGround() {
      if (this instanceof ThrowableObject) {
         return true
      } else {
         return this.y < 220;
      }

   }


   playAnimationOnce(images, callback, intervalTime = 200) {
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


   isColliding(mo) {
      const offsetX = 20;
      const offsetY = 60;
      const offsetWidth = 40;
      const offsetHeight = 20;

      return (
         this.x + offsetX + (this.width - offsetWidth) > mo.x &&
         this.y + offsetY + (this.height - offsetHeight) > mo.y &&
         this.x + offsetX < mo.x + mo.width &&
         this.y + offsetY < mo.y + mo.height
      );
   }


   hit() {
      this.energy -= 5;
      if (this.energy < 0) {
         this.energy = 0;
      } else {
         this.lastHit = new Date().getTime();
      }
   }

   isHurt() {
      let timepassed = new Date().getTime() - this.lastHit;
      timepassed = timepassed / 1000; // Differnce in sek
      return timepassed < 1;
   }

   isDead() {
      return this.energy == 0;
   }
}