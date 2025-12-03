/**
 * GAME.JS - Handles game logic, initialization, and controls
 */

let canvas;
let world;
let keyboard = new Keyboard();
let level1;
let audios = new Audios();

/**
 * Starts the game by hiding the start menu, initializing the level and creating the game world.
 * Also activates mobile controls when available.
 */
function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('backToMenuBtn').classList.remove('hidden');

  autoFullscreenForMobile();
  level1 = createLevel1();
  init();
  updateViewState();
}

/**
 * Returns to the main menu and cleans up the active game world.
 * Restores menu UI elements.
 */
function backToMenu() {
  if (world) {
    world.gameStateManager.cleanup();
    world = null;
  }
  document.getElementById('backToMenuBtn').classList.add('hidden');
  document.getElementById('mobileControls').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');

  if (!audios.isMuted) audios.playBackgroundMusic();
}

/**
 * Initializes the canvas and creates a new game world instance.
 */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard, audios);
}

/**
 * Initializes touch controls for mobile gameplay.
 */
function setupTouchControls() {
  const leftBtn = document.querySelector('.control-btn.left');
  const rightBtn = document.querySelector('.control-btn.right');
  const jumpBtn = document.querySelector('.control-btn.jump');
  const throwBtn = document.querySelector('.control-btn.throw');

  addTouchControl(leftBtn, 'LEFT');
  addTouchControl(rightBtn, 'RIGHT');
  addTouchControl(jumpBtn, 'SPACE');
  addTouchControl(throwBtn, 'D');
}

/**
 * Registers touch events on a control button that map to keyboard actions.
 * @param {HTMLElement} button - Visual touch button.
 * @param {string} key - Keyboard property to toggle.
 */
function addTouchControl(button, key) {
  button.addEventListener('touchstart', (e) => {
    keyboard[key] = true;
  });
  
  button.addEventListener('touchend', (e) => {
    keyboard[key] = false;
  });
  
  // Prevent context menu on long press
  button.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

/**
 * Handles keyboard keydown events and maps them to game controls.
 * @event keydown
 * @param {KeyboardEvent} e
 */
window.addEventListener('keydown', (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68 && world && world.character.bottleCount > 0) keyboard.D = true;
  if (e.keyCode == 82) keyboard.R = true;
});

/**
 * Handles keyboard keyup events and deactivates game control actions.
 * @event keyup
 * @param {KeyboardEvent} e
 */
window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
  if (e.keyCode == 82) keyboard.R = false;
});

// Initialize touch controls when DOM is ready
window.addEventListener('DOMContentLoaded', setupTouchControls);