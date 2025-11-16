class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth;
    statusBarCoins;
    statusBarBottles;
    throwAbleObjects = [];
    coins = 0;
    bottles = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.statusBarHealth = new StatusBar('health', 40, 0);
        this.statusBarCoins = new StatusBar('coin', 40, 60);
        this.statusBarBottles = new StatusBar('bottle', 40, 120);
        this.statusBarCoins.setPercentage(0);
        this.statusBarBottles.setPercentage(0);

        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    };

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottleCount > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwAbleObjects.push(bottle);
            this.character.bottleCount--;
            this.statusBarBottles.setPercentage(
                Math.max(this.statusBarBottles.percentage - 20, 0)
            );
        }
    }


    //auf jeden fall hier kürzen
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.energy);
            }
        });

        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.statusBarCoins.setPercentage(
                    Math.min(this.statusBarCoins.percentage + 20, 100)
                );
                this.level.coins.splice(index, 1);
            }
        });

        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottleCount++;
                this.statusBarBottles.setPercentage(
                    Math.min(this.statusBarBottles.percentage + 20, 100)
                );
                this.level.bottles.splice(index, 1);
            }
        });

    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        //-----Space for fixed objects-----
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.cloud);
        this.addObjectsToMap(this.level.enemies);
         this.throwAbleObjects = this.throwAbleObjects.filter(bottle => !bottle.markForDeletion);
        this.addObjectsToMap(this.throwAbleObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

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
        mo.drawFrame?.(this.ctx);


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