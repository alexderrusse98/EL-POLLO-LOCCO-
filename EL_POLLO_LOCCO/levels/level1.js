const level1 = new Level(
    [
   // new Chicken(), 
    //new Chicken(), 
    //new Chicken(), 
    new Endboss(),
],

    [
    new Cloud()
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
],
[
    new Coin(350, 100),
    new Coin(300, 100),
    new Coin(450, 100),
    new Coin(500, 100),
    new Coin(550, 100),
    new Coin(700, 100),
    new Coin(900, 100),
],
[
    new ThrowableObject(400, 300),
    new ThrowableObject(600, 200),
    new ThrowableObject(800, 200),  
]
);