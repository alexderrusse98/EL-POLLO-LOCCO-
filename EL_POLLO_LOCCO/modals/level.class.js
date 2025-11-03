class Level{
    enemies;
    cloud;
    backgroundObjects;
    level_end_x = 2200;
    coins;
    
    constructor(enemies, cloud, backgroundObjects, coins) {
        this.enemies = enemies;
        this.cloud = cloud;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}
