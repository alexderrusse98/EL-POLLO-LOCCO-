let canvas;
let world;
let keyboard = new Keyboard();
let level1;
let audios = new Audios();

/**
 * Initializes the application once the DOM is fully loaded.
 * Sets up UI event listeners and updates the start screen image.
 * @event DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
  updateViewState();
  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('controllsBtn').addEventListener('click', showControls);
  document.getElementById('closeControlsBtn').addEventListener('click', hideControls);
  document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
  document.getElementById('audioBtn').addEventListener('click', toggleAudio);
  document.getElementById('characterInfoBtn').addEventListener('click', showCharacterStory);
  document.getElementById('closeStoryBtn').addEventListener('click', hideCharacterStory);
  document.getElementById('impressumBtn').addEventListener('click', showImpressum);
  document.getElementById('closeImpressumBtn').addEventListener('click', hideImpressum);
  document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);

  // Close overlays when clicking outside
  document.getElementById('controllsSection').addEventListener('click', (e) => {
    if (e.target.id === 'controllsSection') hideControls();
  });
  document.getElementById('characterStorySection').addEventListener('click', (e) => {
    if (e.target.id === 'characterStorySection') hideCharacterStory();
  });
  document.getElementById('impressumSection').addEventListener('click', (e) => {
    if (e.target.id === 'impressumSection') hideImpressum();
  });

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  updateStartScreenImage();
  setupTouchControls();
});

window.addEventListener('orientationchange', updateViewState);

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
  updateViewState(); // Update controls visibility when game starts
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
 * Handles window resize events to adjust layout and UI visibility.
 * @event resize
 */
window.addEventListener('resize', () => {
  updateViewState();
  document.getElementById('fullscreenBtn').style.display =
    window.innerWidth <= 1000 ? 'none' : 'flex';
  updateStartScreenImage();
});

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

function updateViewState() {
  const body = document.body;
  const mobileControls = document.getElementById('mobileControls');
  const startScreen = document.getElementById('startScreen');
  const portrait = isPortrait();
  const isGameActive = startScreen.classList.contains('hidden');
  const screenWidth = window.innerWidth;

  // Show portrait warning only in portrait mode
  if (portrait) {
    body.classList.add('portrait-warning');
  } else {
    body.classList.remove('portrait-warning');
  }

  // Show mobile controls only when:
  // 1. Game is active (not in start screen)
  // 2. NOT in portrait mode
  // 3. Screen width is <= 500px OR already in landscape with wider screen
  if (isGameActive && !portrait) {
    if (screenWidth <= 500 || screenWidth > 500) {
      mobileControls.classList.remove('hidden');
    } else {
      mobileControls.classList.add('hidden');
    }
  } else {
    mobileControls.classList.add('hidden');
  }
}

/**
 * Automatically activates fullscreen mode on mobile devices.
 */
function autoFullscreenForMobile() {
  if (isMobileDevice()) {
    handleMobileFullscreen();
  } else {
    showFullscreenButton();
  }
}

/**
 * Checks if the screen size qualifies as mobile.
 * @returns {boolean} True if width is ≤ 1000px.
 */
function isMobileDevice() {
  return window.innerWidth <= 1000;
}

/**
 * Enables fullscreen on mobile and hides the fullscreen button.
 */
function handleMobileFullscreen() {
  hideFullscreenButton();
  if (!isInFullscreen()) requestFullscreen();
}

/**
 * Hides the fullscreen toggle button.
 */
function hideFullscreenButton() {
  document.getElementById('fullscreenBtn').style.display = 'none';
}

/**
 * Shows the fullscreen toggle button.
 */
function showFullscreenButton() {
  document.getElementById('fullscreenBtn').style.display = 'flex';
}

/**
 * Updates the start screen background image depending on screen size.
 */
function updateStartScreenImage() {
  const startScreenImg = document.getElementById('startScreenImg');
  if (window.innerWidth >= 900) {
    startScreenImg.src = './img/img_pollo_locco/img/9_intro_outro_screens/start/startscreen_2.png';
  } else {
    startScreenImg.src = './img/img_pollo_locco/img/background_full/desert.jpg';
  }
}

/**
 * Checks if the browser is currently displaying fullscreen.
 * @returns {boolean} True if fullscreen active.
 */
function isInFullscreen() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

/**
 * Requests fullscreen mode using cross-browser methods.
 */
function requestFullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen();
  }
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
 * Shows the controls section in the start menu.
 */
function showControls() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('controllsSection').classList.remove('hidden');
}

/**
 * Hides the controls section.
 */
function hideControls() {
  document.getElementById('controllsSection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
}

/**
 * Displays the character story screen.
 */
function showCharacterStory() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('characterInfoBtn').classList.add('hidden');
  document.getElementById('characterStorySection').classList.remove('hidden');
}

/**
 * Hides the character story screen.
 */
function hideCharacterStory() {
  document.getElementById('characterStorySection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
}

/**
 * Initializes the canvas and creates a new game world instance.
 */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard, audios);
}

/**
 * Toggles game audio mute/unmute and updates the audio button state.
 */
function toggleAudio() {
  const btn = document.getElementById('audioBtn');
  const isMuted = audios.toggleMute();

  if (isMuted) {
    btn.textContent = '🔇';
    btn.classList.add('muted');
  } else {
    btn.textContent = '🔊';
    btn.classList.remove('muted');
    audios.playBackgroundMusic();
  }
}

/**
 * Toggles between fullscreen and windowed mode.
 */
function toggleFullscreen() {
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
  if (!isFullscreen) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

/**
 * Requests fullscreen using cross-browser compatibility methods.
 */
function enterFullscreen() {
  const methods = ['requestFullscreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
  methods.forEach(method => {
    if (document.body[method]) document.body[method]();
  });
}

/**
 * Exits fullscreen mode using cross-browser compatibility.
 */
function exitFullscreen() {
  const methods = ['exitFullscreen', 'webkitExitFullscreen', 'msExitFullscreen'];
  methods.forEach(method => {
    if (document[method]) document[method]();
  });
}

/**
 * Handles updates to UI when fullscreen mode changes.
 */
function handleFullscreenChange() {
  const btn = document.getElementById('fullscreenBtn');
  const canvas = document.getElementById('canvas');
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

  updateFullscreenButton(btn, isFullscreen);
  updateCanvasSize(canvas, isFullscreen);
}

/**
 * Updates fullscreen button visuals.
 * @param {HTMLElement} btn - Fullscreen toggle button.
 * @param {boolean} isFullscreen - Fullscreen state.
 */
function updateFullscreenButton(btn, isFullscreen) {
  btn.textContent = '⛶';
  btn.classList.toggle('active', isFullscreen);
  btn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
}

/**
 * Adjusts the canvas display size based on fullscreen mode and aspect ratio.
 * @param {HTMLElement} canvas - Canvas DOM element.
 * @param {boolean} isFullscreen - Current fullscreen state.
 */
function updateCanvasSize(canvas, isFullscreen) {
  if (!isFullscreen) {
    canvas.style.width = '720px';
    canvas.style.height = '480px';
    canvas.style.maxWidth = canvas.style.maxHeight = '';
  } else {
    const aspectRatio = 720 / 480;
    const screenRatio = window.innerWidth / window.innerHeight;

    if (screenRatio > aspectRatio) {
      canvas.style.height = '100vh';
      canvas.style.width = (window.innerHeight * aspectRatio) + 'px';
    } else {
      canvas.style.width = '100vw';
      canvas.style.height = (window.innerWidth / aspectRatio) + 'px';
    }
  }
}

/**
 * Dynamically resizes the canvas to fit within the screen while maintaining aspect ratio.
 */
function resizeCanvas() {
  const canvas = document.getElementById('canvas');
  const container = canvas.parentElement;
  const aspectRatio = 720 / 480;
  let width = window.innerWidth * 0.9;
  let height = width / aspectRatio;

  if (height > window.innerHeight * 0.8) {
    height = window.innerHeight * 0.8;
    width = height * aspectRatio;
  }

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
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

/**
 * Shows the "Impressum" section.
 */
function showImpressum() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('characterInfoBtn').classList.add('hidden');
  document.getElementById('impressumSection').classList.remove('hidden');
}

/**
 * Hides the "Impressum" section.
 */
function hideImpressum() {
  document.getElementById('impressumSection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
}