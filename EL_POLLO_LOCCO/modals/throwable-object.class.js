class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];


    constructor(x, y) {
        super();
        this.loadImage('./img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.throw();
        this.hasSplashed = false;


    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            if (!this.hasSplashed) {
                this.x += 10;
            }
        }, 25);

        this.animate();
    }

    animate() {
        setInterval(() => {

            if (!this.hasSplashed) {
         
            this.playAnimation(this.IMAGES_ROTATION);
        }
        
        }, 200);
    }

    animateSplash() {
        this.speedY = 0;
        this.acceleration = 0;
        this.y = 220;
        
         clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        
        this.playAnimationOnce(this.IMAGES_SPLASH, () => {
            this.markForDeletion = true;
        });
    }

} 