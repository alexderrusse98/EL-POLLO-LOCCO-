class CollectableBottle extends MovableObject {
    width = 70;
    height = 80;
    y = 200;

    constructor(x) {
        super();
        this.loadImage('./img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x
    }
}