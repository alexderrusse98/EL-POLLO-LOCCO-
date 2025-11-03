class Level{
    enemies;
    cloud;
    backgroundObjects;
    level_end_x = 2200;
    coins;
    bottle;
    
    constructor(enemies, cloud, backgroundObjects, coins, bottle) {
        this.enemies = enemies;
        this.cloud = cloud;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottle = bottle;
    }
}
