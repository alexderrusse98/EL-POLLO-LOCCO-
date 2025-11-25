class Cloud extends MovableObject {
  y = 10;
  height = 350;
  width = 500;
  speed = 0.15 + Math.random() * 0.25;

  intervals = [];

  constructor(imgPath, startX) {
    super();
    this.loadImage(imgPath);
    this.x = startX;
    this.animate();
  }

  stopAllIntervals() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  animate() {
    this.intervals.push(
    setInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        this.x = 750 + Math.random() * 500;
      }
    }, 1000 / 60)
    );
  }

}
