class DrawableObject {
    x = 120;
    y = 340;
    height = 100;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


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
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof ChickenBase) {
            const hb = this.getHitbox();

            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';   // zeigt echte Hitbox
            ctx.rect(hb.x, hb.y, hb.width, hb.height);
            ctx.stroke();
        }
    }
}


