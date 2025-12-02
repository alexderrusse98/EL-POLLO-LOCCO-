/**
 * Class representing a cloud that moves horizontally across the screen.
 * When the cloud goes off-screen, it respawns on the right side at a random position.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 10;
  height = 350;
  width = 500;
  speed = 0.15 + Math.random() * 0.25;

  intervals = [];

  /**
   * Creates a cloud instance.
   * @param {string} imgPath - The path to the cloud image.
   * @param {number} startX - The starting horizontal position of the cloud.
   */
  constructor(imgPath, startX) {
    super();
    this.loadImage(imgPath);
    this.x = startX;
    this.animate();
  }

  /**
   * Stops all animation intervals for this cloud.
   */
  stopAllIntervals() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  /**
   * Animates the cloud movement.
   * Moves the cloud left continuously and respawns it on the right
   * when it goes off-screen.
   */
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
