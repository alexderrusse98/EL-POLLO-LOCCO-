class CollectableBottle extends MovableObject {
    width = 70;
    height = 80;
    y = 500;

    constructor(x) {
        super();
        this.loadImage('img/6_salsa_bottles/1_salsa_bottle/green_bottle.png');
        this.x = x
    }
}