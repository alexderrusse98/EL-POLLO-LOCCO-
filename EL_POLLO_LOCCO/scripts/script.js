let canvas;
let world;
let keyboard = new Keyboard();


window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('controllsBtn').addEventListener('click', showControls);
  document.getElementById('closeControlsBtn').addEventListener('click', hideControls);
  // close outside click
  document.getElementById('controllsSection').addEventListener('click', (e) => {
        
        if (e.target.id === 'controllsSection') {
            hideControls();
        }
    });
});

function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  init();
}

function showControls() {
    document.getElementById('startContent').classList.add('hidden');
    document.getElementById('controllsSection').classList.remove('hidden');
}

function hideControls() {
    document.getElementById('controllsSection').classList.add('hidden');
    document.getElementById('startContent').classList.remove('hidden');
}

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (e) => {

  if (e.keyCode == 39) {
    keyboard.RIGHT = true
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true
  }
  if (e.keyCode == 38) {
    keyboard.UP = true
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true
  }
  if (e.keyCode == 68 && world.character.bottleCount > 0) {
    keyboard.D = true
  }
  if (e.keyCode == 82 && world && (world.gameOver || world.gameWin)) {
    world.stopGame();
    world = new World(canvas, keyboard);
  }
});

window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false
  }
  if (e.keyCode == 38) {
    keyboard.UP = false
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false
  }
  if (e.keyCode == 68) {
    keyboard.D = false
  }
  if (e.keyCode == 82) {
    keyboard.R = false;
  }
});