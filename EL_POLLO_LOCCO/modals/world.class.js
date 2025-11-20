class World {
    character = new Character();
    endBoss = new Endboss();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    statusBarHealth;
    statusBarCoins;
    statusBarBottles;

    statusBarBossHealth;

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
        this.statusBarBossHealth = new StatusBar('endbossHealth', 40, 180);
        
        this.statusBarCoins.setPercentage(0);
        this.statusBarBottles.setPercentage(0);

        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.endBoss.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 200);

        setInterval(() => {
            this.checkThrowObjects();
        }, 100);
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

    checkCollisions() {
        this.checkJumpOnEnemyCollisions();
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }


    checkBottleEnemyCollisions() {
        this.throwAbleObjects.forEach((bottle) => {
            if (!bottle.hasSplashed) {
                this.level.enemies.forEach((enemy) => {
                    if (!enemy.isDead && bottle.isColliding(enemy)) {
                        enemy.deadChicken();
                        bottle.hasSplashed = true;
                        bottle.animateSplash();
                    }
                });
            }
        });
    }


    // Jump-Kollision
    checkJumpOnEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.speedY < 0) {
                const wasKilled = this.character.checkJumpOnEnemy(enemy);
                if (wasKilled) {
                    enemy.wasJumpKilled = true;
                }
            }
        });
    }


    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.isDead && !enemy.wasJumpKilled) {

                const playerBottom = this.character.y + this.character.height;
                const enemyTop = enemy.y;
                const isJumpingOnEnemy = playerBottom >= enemyTop &&
                    playerBottom <= enemyTop + 40 &&
                    this.character.speedY < 0;


                if (!isJumpingOnEnemy) {
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);
                }
            }
        });
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.statusBarCoins.setPercentage(
                    Math.min(this.statusBarCoins.percentage + 20, 100)
                );
                this.level.coins.splice(index, 1);
            }
        });
    }

    checkBottleCollisions() {
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
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        
        this.addObjectsToMap(this.level.cloud);

        //Enemies 
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.markForDeletion);
        this.addObjectsToMap(this.level.enemies);

        //Endboss
        this.addToMap(this.endBoss);


        this.throwAbleObjects = this.throwAbleObjects.filter(bottle => !bottle.markForDeletion);
        this.addObjectsToMap(this.throwAbleObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarBossHealth);

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
        if (mo.otherDirection) {
            this.flippImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame?.(this.ctx);

        if (mo.otherDirection) {
            this.flippImageBack(mo);
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