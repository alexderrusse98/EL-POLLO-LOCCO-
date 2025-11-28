
function bottles(minCount, maxCount, minX, maxX) {
    const bottles = [];
    const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));

    for (let i = 0; i < count; i++) {
        const randomX = minX + Math.random() * (maxX - minX);
        bottles.push(new CollectableBottle(randomX));
    }

    return bottles;
}

function createLevel1() {
    return new Level(
        [
            new ChickenNormal(),
            new ChickenSmall(),
            new ChickenNormal(),
            new ChickenNormal(),
            new ChickenSmall(),
            new ChickenNormal(),
            new ChickenNormal(),
            new ChickenSmall(),
            new ChickenNormal(),
            new ChickenNormal(),
            new ChickenSmall(),
            new ChickenNormal(),
        ],

        [
            new Cloud('./img/img_pollo_locco/img/5_background/layers/4_clouds/1.png', 0),
            new Cloud('./img/img_pollo_locco/img/5_background/layers/4_clouds/2.png', 1000),
            new Cloud('./img/img_pollo_locco/img/5_background/layers/4_clouds/1.png', 600),
            new Cloud('./img/img_pollo_locco/img/5_background/layers/4_clouds/2.png', 2000),
            new Cloud('./img/img_pollo_locco/img/5_background/layers/4_clouds/1.png', 3500),
            new Cloud('./img/img_pollo_locco/img/5_background/layers/4_clouds/2.png', 2700),
        ],

        [
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/air.png', -720),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', -720),


            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/air.png', 0),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/air.png', 720),

            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 720),

            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/air.png', 720 * 2),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 720 * 2),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 720 * 2),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 720 * 2),

            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/air.png', 720 * 3),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 720 * 3),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 720 * 3),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 720 * 3),

            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/air.png', 720 * 4),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 720 * 4),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 720 * 4),
            new BackgroundObject('./img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 720 * 4),
        ],
        [
            new Coin(278, 73),
            new Coin(642, 112),
            new Coin(1034, 58),
            new Coin(1588, 169),
            new Coin(834, 144),
            new Coin(2476, 92),
            new Coin(1320, 198),
            new Coin(415, 151),
            new Coin(990, 67),
            new Coin(2104, 132),
            new Coin(2670, 88),
            new Coin(1856, 175),

        ],
        bottles(5, 10, 300, 3000)
    );
}