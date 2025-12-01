/**
 * Manages all collision detection in the game world.
 */
class CollisionManager {
    /**
     * Creates a CollisionManager instance.
     * @param {World} world - Reference to the main world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks all types of collisions in the game.
     */
    checkCollisions() {
        this.checkJumpOnEnemyCollisions();
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkBottleEndBossCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }

    /**
     * Checks if character is jumping on enemies.
     */
    checkJumpOnEnemyCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            if (enemy.isDead) return;
            
            const currentBottom = this.world.character.y + this.world.character.height;
            const prevBottom = this.world.character.previousBottom ?? currentBottom;

            if (this.world.character.speedY < 0) {
                if (this.isJumpingOnEnemy(enemy, currentBottom, prevBottom)) {
                    this.handleJumpKill(enemy);
                }
            }
        });
    }

    /**
     * Checks if character is currently jumping on an enemy.
     * @param {Object} enemy - The enemy to check.
     * @param {number} currentBottom - Current bottom position of character.
     * @param {number} prevBottom - Previous bottom position of character.
     * @returns {boolean} True if jumping on enemy.
     */
    isJumpingOnEnemy(enemy, currentBottom, prevBottom) {
        const crossedTop = (prevBottom <= enemy.y + 5) && 
                          (currentBottom >= enemy.y);
        const horizOverlap = this.hasHorizontalOverlap(
            this.world.character, 
            enemy
        );
        return crossedTop && horizOverlap;
    }

    /**
     * Checks horizontal overlap between two objects.
     * @param {Object} obj1 - First object.
     * @param {Object} obj2 - Second object.
     * @returns {boolean} True if objects overlap horizontally.
     */
    hasHorizontalOverlap(obj1, obj2) {
        const hb1 = obj1.getHitbox();
        const hb2 = obj2.getHitbox();
        return hb1.x < hb2.x + hb2.width && 
               hb1.x + hb1.width > hb2.x;
    }

    /**
     * Handles jump kill of an enemy.
     * @param {Object} enemy - The enemy to kill.
     */
    handleJumpKill(enemy) {
        const wasKilled = this.world.character.checkJumpOnEnemy(enemy);
        if (wasKilled) {
            enemy.wasJumpKilled = true;
            this.world.audios.playSound('chickenDeadSound');
        }
    }

    /**
     * Checks collisions between character and all enemies.
     */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            this.checkAllEnemiesCollisions(enemy);
        });
        if (this.world.endBoss) {
            this.checkAllEnemiesCollisions(this.world.endBoss);
        }
    }

    /**
     * Checks collision with a specific enemy.
     * @param {Object} enemy - The enemy to check collision with.
     */
    checkAllEnemiesCollisions(enemy) {
        if (this.shouldDamageCharacter(enemy)) {
            if (!this.isCharacterJumpingOnEnemy(enemy)) {
                this.world.character.hit();
                this.world.statusBarHealth.setPercentage(
                    this.world.character.energy
                );
            }
        }
    }

    /**
     * Checks if character should take damage from enemy.
     * @param {Object} enemy - The enemy to check.
     * @returns {boolean} True if character should be damaged.
     */
    shouldDamageCharacter(enemy) {
        return this.world.character.isColliding(enemy) &&
               enemy.energy > 0 &&
               !enemy.wasJumpKilled &&
               !this.world.character.isHurt();
    }

    /**
     * Checks if character is jumping on enemy.
     * @param {Object} enemy - The enemy to check.
     * @returns {boolean} True if character is jumping on enemy.
     */
    isCharacterJumpingOnEnemy(enemy) {
        const playerBottom = this.world.character.y + 
                           this.world.character.height;
        const enemyTop = enemy.y;
        return playerBottom >= enemyTop &&
               playerBottom <= enemyTop + 40 &&
               this.world.character.speedY < 0;
    }

    /**
     * Checks collisions between bottles and regular enemies.
     */
    checkBottleEnemyCollisions() {
        this.world.throwAbleObjects.forEach((bottle) => {
            if (bottle.hasSplashed) return;
            
            this.world.level.enemies.forEach((enemy) => {
                if (this.shouldBottleHitEnemy(bottle, enemy)) {
                    this.handleBottleHitEnemy(enemy, bottle);
                }
            });
        });
    }

    /**
     * Checks if bottle should hit enemy.
     * @param {Object} bottle - The bottle to check.
     * @param {Object} enemy - The enemy to check.
     * @returns {boolean} True if bottle hits enemy.
     */
    shouldBottleHitEnemy(bottle, enemy) {
        return !enemy.isDead && bottle.isColliding(enemy);
    }

    /**
     * Handles bottle hitting an enemy.
     * @param {Object} enemy - The enemy that was hit.
     * @param {Object} bottle - The bottle that hit.
     */
    handleBottleHitEnemy(enemy, bottle) {
        enemy.deadChicken();
        bottle.hasSplashed = true;
        bottle.animateSplash();
        this.world.audios.playSound('chickenDeadSound');
    }

    /**
     * Checks collisions between bottles and endboss.
     */
    checkBottleEndBossCollisions() {
        if (!this.world.endBoss) return;

        this.world.throwAbleObjects.forEach((bottle) => {
            if (this.shouldBottleHitBoss(bottle)) {
                this.handleBottleHitBoss(bottle);
            }
        });
    }

    /**
     * Checks if bottle should hit boss.
     * @param {Object} bottle - The bottle to check.
     * @returns {boolean} True if bottle hits boss.
     */
    shouldBottleHitBoss(bottle) {
        return !bottle.hasSplashed &&
               this.world.endBoss.energy > 0 &&
               bottle.isColliding(this.world.endBoss);
    }

    /**
     * Handles bottle hitting the endboss.
     * @param {Object} bottle - The bottle that hit.
     */
    handleBottleHitBoss(bottle) {
        this.world.endBoss.hit();
        this.world.statusBarBossHealth.setPercentage(
            this.world.endBoss.energy
        );
        bottle.hasSplashed = true;
        bottle.animateSplash();
        this.world.audios.playSound('bossChickenHurtSound');

        if (this.world.endBoss.energy <= 0) {
            this.world.endBoss.deadChicken();
            this.world.audios.playSound('chickenDeadSound');
        }
    }

    /**
     * Checks collisions between character and coins.
     */
    checkCoinCollisions() {
        this.world.level.coins.forEach((coin, index) => {
            if (this.shouldCollectCoin(coin)) {
                this.handleCoinCollection(index);
            }
        });
    }

    /**
     * Checks if coin should be collected.
     * @param {Object} coin - The coin to check.
     * @returns {boolean} True if coin should be collected.
     */
    shouldCollectCoin(coin) {
        return this.world.character.isColliding(coin) &&
               this.world.statusBarCoins.percentage < 100;
    }

    /**
     * Handles coin collection.
     * @param {number} index - Index of the coin in the array.
     */
    handleCoinCollection(index) {
        this.world.audios.playSound('coinSound');
        this.world.statusBarCoins.setPercentage(
            Math.min(this.world.statusBarCoins.percentage + 20, 100)
        );
        this.world.level.coins.splice(index, 1);
    }

    /**
     * Checks collisions between character and bottles.
     */
    checkBottleCollisions() {
        this.world.level.bottles.forEach((bottle, index) => {
            if (this.shouldCollectBottle(bottle)) {
                this.handleBottleCollection(index);
            }
        });
    }

    /**
     * Checks if bottle should be collected.
     * @param {Object} bottle - The bottle to check.
     * @returns {boolean} True if bottle should be collected.
     */
    shouldCollectBottle(bottle) {
        return this.world.character.isColliding(bottle) &&
               this.world.statusBarBottles.percentage < 100;
    }

    /**
     * Handles bottle collection.
     * @param {number} index - Index of the bottle in the array.
     */
    handleBottleCollection(index) {
        this.world.audios.playSound('takeBottleSound');
        this.world.character.bottleCount++;
        this.world.statusBarBottles.setPercentage(
            Math.min(this.world.statusBarBottles.percentage + 20, 100)
        );
        this.world.level.bottles.splice(index, 1);
    }
}