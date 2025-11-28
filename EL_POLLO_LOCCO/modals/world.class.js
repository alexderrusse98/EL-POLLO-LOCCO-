class World {
    audios;

    character = new Character();
    endBoss = null;  // new Endboss();

    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    statusBarHealth;
    statusBarCoins;
    statusBarBottles;
    statusBarBossHealth;

    intervals = [];
    throwAbleObjects = [];
    coins = 0;
    bottles = 0;

    gameOver = false;
    gameWin = false;
    gameOverTriggered = false;
    gameWinTriggered = false;
    winImage;
    gameOverImage;

    constructor(canvas, keyboard, audioManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audios = audioManager;

        this.statusBarHealth = new StatusBar('health', 40, 0);
        this.statusBarCoins = new StatusBar('coin', 40, 60);
        this.statusBarBottles = new StatusBar('bottle', 40, 120);
        this.statusBarBossHealth = new StatusBar('endbossHealth', 40, 180);

        this.statusBarCoins.setPercentage(0);
        this.statusBarBottles.setPercentage(0);
        this.level = level1;
        this.draw();
        this.setWorld();
        this.run();
        this.audios.playBackgroundMusic();

        this.gameOverImage = new Image();
        this.gameOverImage.src = './img/img_pollo_locco/img/You won, you lost/Game Over.png';
        this.winImage = new Image();
        this.winImage.src = './img/img_pollo_locco/img/You won, you lost/You Win A.png';
    }


    setWorld() {
        this.character.world = this;
       /* this.endBoss.world = this;
        if (this.endBoss) {
            this.endBoss.world = this;
        }*/
    }

    run() {
        this.intervals.push(
            setInterval(() => {
                this.checkCollisions();
                this.checkEndBossAlert();
                this.checkGameOver();
            }, 200)
        );

        this.intervals.push(
            setInterval(() => {
                this.checkThrowObjects();
            }, 100)
        );
    }

    // Game Over

    stopGame() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];

        this.character.stopAllIntervals();

        this.endBoss?.stopAllIntervals();

        this.level.enemies.forEach(enemy => {
            enemy.stopAllIntervals();
        });
    }


    // kürze methode in mes..
    checkGameOver() {
        if (this.character.isDead() && !this.gameOver) {
            this.gameOverTriggered = true;
            this.audios.playSound('characterDeadSound');
            clearInterval(this.intervals[0]);
            setTimeout(() => {
                this.gameOver = true;
                this.audios.stopBackgroundMusic();
                this.audios.playSound('gameOverSound');
                this.stopGame();
            }, 2000);

        } else if (this.endBoss && this.endBoss.isDead && !this.gameWin) {
            this.gameWinTriggered = true;
            clearInterval(this.intervals[0]);
            setTimeout(() => {
                this.gameWin = true;
                this.audios.stopBackgroundMusic();
                this.audios.playSound('winSound');
                this.stopGame();
            }, 2000);
        }

    }

    showEndImg() {
        const imgToShow = this.gameOver ? this.gameOverImage : this.winImage;

        // Bild über das GANZE Canvas zeichnen
        this.ctx.drawImage(
            imgToShow,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Text darüber
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';

        // Text mit Umrandung
        this.ctx.strokeText('Press R to restart', this.canvas.width / 2, this.canvas.height - 50);
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height - 50);
    }

    // Game Restart

    cleanup() {
        this.stopGame();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.audios.stopBackgroundMusic();
        this.audios.stopAllSounds();
        this.throwAbleObjects = [];
        this.level.enemies = [];
        this.level.coins = [];
        this.level.bottles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    restartGame() {
        this.cleanup();

        this.gameOver = false;
        this.gameWin = false;
        this.gameOverTriggered = false;
        this.gameWinTriggered = false;
        this.camera_x = 0;

        this.level = createLevel1();

        this.character = new Character();
        this.character.x = 120;

        this.endBoss = new Endboss();
        this.throwAbleObjects = [];

        this.statusBarHealth.setPercentage(100);
        this.statusBarCoins.setPercentage(0);
        this.statusBarBottles.setPercentage(0);
        this.statusBarBossHealth.setPercentage(100);

        this.setWorld();
        this.run();
        this.audios.playBackgroundMusic();
        this.draw();
    }

    checkEndBossAlert() {
        if (!this.endBoss || this.endBoss.isDead) return;

        const distance = Math.abs(this.character.x - this.endBoss.x);

        // Zone 1: Attack-Reichweite
        if (distance < 150) {
            if (!this.endBoss.isAttackAnimation && this.endBoss.isAlerted) {
                this.endBoss.attack();
            }
        }
        // Zone 2: Alert-Reichweite
        else if (distance < 300) {
            if (!this.endBoss.isAlerted && !this.endBoss.isAttackAnimation) {
                this.audios.playSound('bossChickenStartSound');
                this.endBoss.isAlerted = true;
            }
        }
        // Zone 3: Außerhalb (> 300px)
        else {
            if (this.endBoss.isAlerted && !this.endBoss.isAttackAnimation) {
                this.endBoss.isAlerted = false;
            }
        }
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottleCount > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwAbleObjects.push(bottle);
            this.character.bottleCount--;
            this.audios.playSound('throw');
            this.statusBarBottles.setPercentage(
                Math.max(this.statusBarBottles.percentage - 20, 0)
            );
        }
    }

    checkCollisions() {
        this.checkJumpOnEnemyCollisions();
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkBottleEndBossCollisions();
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
                        this.audios.playSound('chickenDeadSound');
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
                    this.audios.playSound('chickenDeadSound');
                }
            }
        });
    }


    checkEnemyCollisions() {

        this.level.enemies.forEach((enemy) => {
            this.checkAllEnemiesCollisions(enemy);
        });

        if (this.endBoss) {
            this.checkAllEnemiesCollisions(this.endBoss);
        }
    }


    checkAllEnemiesCollisions(allEnemies) {
        if (this.character.isColliding(allEnemies) &&
            !allEnemies.isDead &&
            !allEnemies.wasJumpKilled &&
            !this.character.isHurt()) {

            const playerBottom = this.character.y + this.character.height;
            const allEnemiesTop = allEnemies.y;
            const isJumpingOnallEnemies = playerBottom >= allEnemiesTop &&
                playerBottom <= allEnemiesTop + 40 &&
                this.character.speedY < 0;

            if (!isJumpingOnallEnemies) {
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.energy);
            }
        }
    }


    checkBottleEndBossCollisions() {
        this.throwAbleObjects.forEach((bottle) => {
            if (!bottle.hasSplashed && this.endBoss) {

                if (!this.endBoss.isDead && bottle.isColliding(this.endBoss)) {
                    this.endBoss.hit();
                    this.statusBarBossHealth.setPercentage(this.endBoss.energy);
                    bottle.hasSplashed = true;
                    bottle.animateSplash();
                    this.audios.playSound('bossChickenHurtSound');


                    if (this.endBoss.energy <= 0 && !this.endBoss.isDead) {
                        this.endBoss.deadChicken();
                        this.audios.playSound('chickenDeadSound');
                    }
                }
            }
        });
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.audios.playSound('coinSound');
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
                this.audios.playSound('takeBottleSound');
                this.character.bottleCount++;
                this.statusBarBottles.setPercentage(
                    Math.min(this.statusBarBottles.percentage + 20, 100)
                );
                this.level.bottles.splice(index, 1);
            }
        });
    }

    draw() {
        if (this.handleRestart()) return;

        this.clearCanvas();
        this.drawGameWorld();
        this.drawEndScreen();
        this.scheduleNextFrame();
    }

    handleRestart() {
        if ((this.gameOver || this.gameWin) && this.keyboard.R) {
            this.restartGame();
            return true;
        }
        return false;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGameWorld() {
        this.drawBackground();
        this.drawCharacterAndEnemies();
        this.drawCollectables();
        this.drawStatusBars();
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawCharacterAndEnemies() {
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.cloud);

        this.drawEnemies();
        this.drawEndboss();
    }

    drawEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.markForDeletion);
        this.addObjectsToMap(this.level.enemies);
    }

    drawEndboss() {
        if (this.endBoss && !this.endBoss.markForDeletion) {
            this.addToMap(this.endBoss);
        } else if (this.endBoss && this.endBoss.markForDeletion) {
            this.endBoss = null;
        }
    }

    drawCollectables() {
        this.throwAbleObjects = this.throwAbleObjects.filter(bottle => !bottle.markForDeletion);
        this.addObjectsToMap(this.throwAbleObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.ctx.translate(-this.camera_x, 0);
    }

    drawStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarBossHealth);
    }

    drawEndScreen() {
        if (this.gameOver || this.gameWin) {
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.showEndImg();
            this.ctx.restore();
        }
    }

    scheduleNextFrame() {
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