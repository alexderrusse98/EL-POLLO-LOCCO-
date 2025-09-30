class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollision();
    }

    setWorld() {
        this.character.world = this;
    };

    checkCollision(){
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
               if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    console.log("energy",this.character.energy);
                    
               } 
            })
        }, 200);
    }


    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.cloud);
        this.addObjectsToMap(this.level.enemies);


        this.ctx.translate(-this.camera_x, 0);

        // Draw wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.ortherDirection) {
            this.flippImage(mo);
        }

        mo.draw(this.ctx)
        mo.drawFrame(this.ctx);


        if (mo.ortherDirection) {
            this.flippImageBack(mo)
        }

    }
    flippImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }
    flippImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}