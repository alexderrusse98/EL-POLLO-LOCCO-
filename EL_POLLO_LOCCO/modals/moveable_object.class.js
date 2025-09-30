class MovableObject {
   x = 120;
   y = 340;
   img;
   height = 100;
   width = 100;
   imageCache = {};
   currentImage = 0;
   speed = 0.15;
   ortherDirection = false;
   speedY = 0;
   acceleration = 1;


   applyGravity() {
      setInterval(() => {
         if (this.y < 180) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
         }
      }, 1000 / 25)
   }

   loadImage(path) {
      this.img = new Image();
      this.img.src = path;
   }

   loadImages(arr) {
      arr.forEach((path) => {
         let img = new Image();
         img.src = path
         this.imageCache[path] = img;
      });
   }

   playAnimation(images) {
      let i = this.currentImage % this.IMAGES_WALKING.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
   }

   moveRight() {

   }

   moveLeft() {
      setInterval(() => {
         this.x -= this.speed;

         if (this.x + this.width < 0) {
            this.x = 1000 + Math.random() * 500;
         }
      }, 1000 / 60);
   }

}
