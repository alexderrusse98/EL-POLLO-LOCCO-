class Cloud extends MovableObject {
    y = 10;
    height = 350;
    width = 500;
    speed = 0.15 + Math.random() * 0.25;

    constructor(imgPath, startX) {
        super();
        this.loadImage(imgPath);
        this.x = startX;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();

            if (this.x + this.width < 0) {
                this.x = 750 + Math.random() * 500;
            }
        }, 1000 / 60);
    }

}
