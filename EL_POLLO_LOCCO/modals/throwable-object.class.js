class ThrowableObject extends MovableObject {
    
    IMAGES_ROTATION = [
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    
    constructor(x, y) {
        super();
        this.loadImage('./img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.throw();
        
    }
    
    throw(){
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
        this.animate();
    }

    animate(){
    setInterval(() => {
        this.playAnimation(this.IMAGES_ROTATION);
    }, 200);
}

}