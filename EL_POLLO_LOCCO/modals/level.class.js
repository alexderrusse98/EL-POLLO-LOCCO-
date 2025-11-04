class Level{
    enemies;
    cloud;
    backgroundObjects;
    level_end_x = 2200;
    coins;
    bottles;
    
    constructor(enemies, cloud, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.cloud = cloud;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
