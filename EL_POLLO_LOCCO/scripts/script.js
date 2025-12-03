/**
 * GAME.JS - Handles game logic, initialization, and controls
 */
let canvas;
let world;
let keyboard = new Keyboard();
let level1;
let audios = new Audios();
let isTouchDevice = false;

/**
 * Detects if the device supports touch input
 * @returns {boolean} True if touch is supported
 */
function detectTouchDevice() {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}

/**
 * Initializes device detection on page load
 */
function initDeviceDetection() {
  isTouchDevice = detectTouchDevice();

  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      isTouchDevice = true;
      showMobileControls();
    }
  }, { once: true });
}

/**
 * Shows mobile controls if touch device is detected
 */
function showMobileControls() {
  const mobileControls = document.getElementById('mobileControls');
  if (mobileControls && isTouchDevice) {
    mobileControls.classList.remove('hidden');
  }
}

/**
 * Hides mobile controls
 */
function hideMobileControls() {
  const mobileControls = document.getElementById('mobileControls');
  if (mobileControls) {
    mobileControls.classList.add('hidden');
  }
}

/**
 * Starts the game by hiding the start menu, initializing the level and creating the game world.
 * Also handles canvas dimensions and activates mobile controls when available.
 */
function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('backToMenuBtn').classList.remove('hidden');

  if (!audios.isMuted) {
    audios.playBackgroundMusic();
  }

  if (isTouchDevice) {
    showMobileControls();
  }

  level1 = createLevel1();
  init();
  updateViewState();
  
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
  if (isFullscreen) {
    updateCanvasFullscreen(document.getElementById('canvas'));
  } else {
    updateCanvasResponsive();
  }
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
  hideMobileControls();
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
  if (!leftBtn || !rightBtn || !jumpBtn || !throwBtn) {
    console.warn('Touch control buttons not found');
    return;
  }
  addTouchControl(leftBtn, 'LEFT');
  addTouchControl(rightBtn, 'RIGHT');
  addTouchControl(jumpBtn, 'SPACE');
  addTouchControl(throwBtn, 'D');
}

/**
 * Registers all touch/pointer events for a control button.
 * @param {HTMLElement} button - Button element
 * @param {string} key - Keyboard key mapping
 */
function addTouchControl(button, key) {
  registerTouchStart(button, key);
  registerTouchEnd(button, key);
  registerPointerEvents(button, key);
  disableContextMenu(button);
}

/**
 * Handles touchstart event (activate key + button state)
 * @param {HTMLElement} button - Button element
 * @param {string} key - Keyboard key mapping
 */
function registerTouchStart(button, key) {
  button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard[key] = true;
    button.classList.add('active');
  });
}

/**
 * Handles touchend + touchcancel event (deactivate key + button state)
 * @param {HTMLElement} button - Button element
 * @param {string} key - Keyboard key mapping
 */
function registerTouchEnd(button, key) {
  const endHandler = (e) => {
    e.preventDefault();
    keyboard[key] = false;
    button.classList.remove('active');
  };
  button.addEventListener('touchend', endHandler);
  button.addEventListener('touchcancel', endHandler);
}

/**
 * Handles pointerdown/up for touch devices
 * @param {HTMLElement} button - Button element
 * @param {string} key - Keyboard key mapping
 */
function registerPointerEvents(button, key) {
  button.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      e.preventDefault();
      keyboard[key] = true;
      button.classList.add('active');
    }
  });
  button.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'touch') {
      e.preventDefault();
      keyboard[key] = false;
      button.classList.remove('active');
    }
  });
}

/**
 * Prevents long-press menu on touchscreen buttons
 * @param {HTMLElement} button - Button element
 */
function disableContextMenu(button) {
  button.addEventListener('contextmenu', (e) => e.preventDefault());
}

/**
 * Handles keyboard keydown events and maps them to game controls.
 * @event keydown
 * @param {KeyboardEvent} e - Keyboard event
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
 * @param {KeyboardEvent} e - Keyboard event
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

/**
 * Initialize device detection and touch controls when DOM is ready
 * @listens DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
  initDeviceDetection();
  setupTouchControls();
});