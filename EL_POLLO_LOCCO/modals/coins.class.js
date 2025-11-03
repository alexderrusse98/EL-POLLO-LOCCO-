class Coin extends MovableObject {
    
        constructor(x, y) {
        super();
        this.loadImage('./img/img_pollo_locco/img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
    }
}