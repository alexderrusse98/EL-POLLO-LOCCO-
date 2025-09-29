class Cloud extends MovableObject {
    y = 20;
    height = 150;
    width = 500;

 constructor(){
    super().loadImage('./img/img_pollo_locco/img/5_background/layers/4_clouds/1.png');

    this.x = 0 + Math.random() * 750;
    this.animate();
}

 animate() {
       this.moveLeft();
    }

}