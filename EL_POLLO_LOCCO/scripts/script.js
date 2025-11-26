let canvas;
let world;
let keyboard = new Keyboard();
let level1;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('controllsBtn').addEventListener('click', showControls);
  document.getElementById('closeControlsBtn').addEventListener('click', hideControls);

  // Character Info Button
  document.getElementById('characterInfoBtn').addEventListener('click', showCharacterStory);
  document.getElementById('closeStoryBtn').addEventListener('click', hideCharacterStory);

  // close outside click
  document.getElementById('controllsSection').addEventListener('click', (e) => {

    if (e.target.id === 'controllsSection') {
      hideControls();
    }
  });
  document.getElementById('characterStorySection').addEventListener('click', (e) => {
    if (e.target.id === 'characterStorySection') {
      hideCharacterStory();
    }
  });
});

function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  level1 = createLevel1();
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

function showCharacterStory() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('characterInfoBtn').classList.add('hidden');
  document.getElementById('characterStorySection').classList.remove('hidden');
}

function hideCharacterStory() {
  document.getElementById('characterStorySection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
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