class Character extends MovableObject {
   height = 250;
   y = 180;
   speed = 5;

IMAGES_WALKING = [
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        './img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png',
    ];
world;



constructor(){
    super().loadImage('./img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
}

animate(){

     setInterval(() => {
         if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.ortherDirection = false;
        }  

        if (this.world.keyboard.LEFT && this.x >= 0) {
            this.x -= this.speed;
            this.ortherDirection = true;
        }
        this.world.camera_x = -this.x + 100;
    }, 1000 / 60);


    setInterval(() => {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
    }
    }, 50);
    
}

    jump(){

    }
}