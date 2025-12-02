let canvas;
let world;
let keyboard = new Keyboard();
let level1;
let audios = new Audios();

/** Initializes app and sets up all event listeners. */
window.addEventListener('DOMContentLoaded', () => {
  detectTouchDevice();

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

  // Click outside to close
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
});

/** Starts game, initializes level and world. */
function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('backToMenuBtn').classList.remove('hidden');

  if (detectTouchDevice()) {
    document.getElementById('mobileControls').classList.remove('hidden');
    setupTouchControls();
  }

  autoFullscreenForMobile();
  level1 = createLevel1();
  init();
}

/** Returns to main menu and cleans up game world. */
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

/** Adjusts UI on window resize. */
window.addEventListener('resize', () => {
  detectTouchDevice();
  document.getElementById('fullscreenBtn').style.display =
    window.innerWidth <= 1000 ? 'none' : 'flex';
  updateStartScreenImage();
});

/** @returns {boolean} True if touch device with small screen. */
function detectTouchDevice() {
  const isTouchDevice = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  return isTouchDevice && window.innerWidth <= 1000;
}

/** Enters fullscreen on mobile devices. */
function autoFullscreenForMobile() {
  if (isMobileDevice()) {
    handleMobileFullscreen();
  } else {
    showFullscreenButton();
  }
}

/** @returns {boolean} True if mobile screen size. */
function isMobileDevice() {
  return window.innerWidth <= 1000;
}

function handleMobileFullscreen() {
  hideFullscreenButton();
  if (!isInFullscreen()) requestFullscreen();
}

function hideFullscreenButton() {
  document.getElementById('fullscreenBtn').style.display = 'none';
}

function showFullscreenButton() {
  document.getElementById('fullscreenBtn').style.display = 'flex';
}

function updateStartScreenImage() {
  const startScreenImg = document.getElementById('startScreenImg');
  if (window.innerWidth >= 800) {
    startScreenImg.src = './img/img_pollo_locco/img/9_intro_outro_screens/start/startscreen_2.png';
  } else {
    startScreenImg.src = './img/img_pollo_locco/img/background_full/desert.jpg';
  }
}

/** @returns {boolean} True if in fullscreen. */
function isInFullscreen() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

/** Requests fullscreen with browser compatibility. */
function requestFullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen();
  }
}

/** Sets up touch controls for mobile. */
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
 * @param {HTMLElement} button - Control button element.
 * @param {string} key - Keyboard property to control.
 */
function addTouchControl(button, key) {
  button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard[key] = true;
  });
  button.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard[key] = false;
  });
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

/** Initializes canvas and game world. */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard, audios);
}

/** Toggles audio mute/unmute. */
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

/** Toggles fullscreen mode. */
function toggleFullscreen() {
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
  if (!isFullscreen) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

/** Enters fullscreen with cross-browser support. */
function enterFullscreen() {
  const methods = ['requestFullscreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
  methods.forEach(method => {
    if (document.body[method]) document.body[method]();
  });
}

/** Exits fullscreen with cross-browser support. */
function exitFullscreen() {
  const methods = ['exitFullscreen', 'webkitExitFullscreen', 'msExitFullscreen'];
  methods.forEach(method => {
    if (document[method]) document[method]();
  });
}

/** Handles fullscreen state changes. */
function handleFullscreenChange() {
  const btn = document.getElementById('fullscreenBtn');
  const canvas = document.getElementById('canvas');
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

  updateFullscreenButton(btn, isFullscreen);
  updateCanvasSize(canvas, isFullscreen);
}

/**
 * @param {HTMLElement} btn - Fullscreen button.
 * @param {boolean} isFullscreen - Current fullscreen state.
 */
function updateFullscreenButton(btn, isFullscreen) {
  btn.textContent = '⛶';
  btn.classList.toggle('active', isFullscreen);
  btn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
}

/**
 * @param {HTMLElement} canvas - Canvas element.
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

/** Handles keydown events for game controls. */
window.addEventListener('keydown', (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68 && world && world.character.bottleCount > 0) keyboard.D = true;
  if (e.keyCode == 82) keyboard.R = true;
});

/** Handles keyup events for game controls. */
window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
  if (e.keyCode == 82) keyboard.R = false;
});

function showImpressum() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('characterInfoBtn').classList.add('hidden');
  document.getElementById('impressumSection').classList.remove('hidden');
}

function hideImpressum() {
  document.getElementById('impressumSection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
}