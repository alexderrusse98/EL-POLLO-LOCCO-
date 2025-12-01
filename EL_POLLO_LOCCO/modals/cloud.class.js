/**
 * Class representing a cloud that moves horizontally across the screen.
 * When the cloud goes off-screen, it respawns on the right side at a random position.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /** Vertical position of the cloud */
  y = 10;

  /** Height of the cloud */
  height = 350;

  /** Width of the cloud */
  width = 500;

  /** Speed at which the cloud moves left, randomized slightly */
  speed = 0.15 + Math.random() * 0.25;

  /** Array storing all intervals used for animating the cloud */
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
