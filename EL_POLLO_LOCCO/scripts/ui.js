/**
 * UI.JS - Handles UI elements, canvas sizing, modals, and visual states
 */

/**
 * Initializes UI components once the DOM is fully loaded.
 * Sets up all event listeners for buttons and modals.
 * @listens DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
  initializeAudioButton();
  initStartScreenCanvas();
  updateViewState();
  updateCanvasResponsive();

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
});

/**
 * Updates view state when device orientation changes.
 * @listens orientationchange
 */
window.addEventListener('orientationchange', updateViewState);

/**
 * Handles window resize events to adjust layout and UI visibility.
 * @listens resize
 */
window.addEventListener('resize', () => {
  updateViewState();
  updateCanvasResponsive();
});

/**
 * Checks if the device is in portrait orientation.
 * @returns {boolean} True if device height is greater than width
 */
function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

/**
 * Updates the view state based on orientation and screen size.
 * Manages portrait warning and mobile controls visibility.
 */
function updateViewState() {
  const viewData = getViewStateData();
  updatePortraitWarning(viewData.body, viewData.portrait);
  updateMobileControlsVisibility(viewData);
}

/**
 * Collects current view state data including orientation and element states.
 * @returns {{body: HTMLElement, mobileControls: HTMLElement, startScreen: HTMLElement, portrait: boolean, isGameActive: boolean, screenWidth: number}} View state data object
 */
function getViewStateData() {
  const startScreen = document.getElementById('startScreen');
  return {
    body: document.body,
    mobileControls: document.getElementById('mobileControls'),
    startScreen: startScreen,
    portrait: isPortrait(),
    isGameActive: startScreen.classList.contains('hidden'),
    screenWidth: window.innerWidth
  };
}

/**
 * Toggles the portrait warning class on the body element.
 * @param {HTMLElement} body - Body element
 * @param {boolean} isPortrait - Whether device is in portrait mode
 */
function updatePortraitWarning(body, isPortrait) {
  if (isPortrait) {
    body.classList.add('portrait-warning');
  } else {
    body.classList.remove('portrait-warning');
  }
}

/**
 * Updates mobile controls visibility based on game state and orientation.
 * @param {{mobileControls: HTMLElement, isGameActive: boolean, portrait: boolean}} viewData - View state data
 */
function updateMobileControlsVisibility(viewData) {
  const shouldShow = viewData.isGameActive && !viewData.portrait;
  if (shouldShow) {
    viewData.mobileControls.classList.remove('hidden');
  } else {
    viewData.mobileControls.classList.add('hidden');
  }
}

/**
 * Gets current canvas dimensions based on fullscreen state.
 * @returns {{width: number, height: number}} Canvas dimensions
 */
function getCanvasDimensions() {
  const width = document.fullscreenElement ? window.screen.width : window.innerWidth;
  const height = document.fullscreenElement ? window.screen.height : window.innerHeight;
  return { width, height };
}

/**
 * Draws a blurred and darkened background image on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} img - Image element to draw
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function drawBlurredBackground(ctx, img, canvas) {
  const bgScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const bgX = (canvas.width - img.width * bgScale) / 2;
  const bgY = (canvas.height - img.height * bgScale) / 2;

  ctx.filter = 'blur(20px) brightness(0.7)';
  ctx.drawImage(img, bgX, bgY, img.width * bgScale, img.height * bgScale);
  ctx.filter = 'none';
}

/**
 * Draws the image centered on the canvas while maintaining aspect ratio.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} img - Image element to draw
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function drawCenteredImage(ctx, img, canvas) {
  const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;

  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

/**
 * Draws the complete start screen with blurred background and centered image.
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} img - Image element to draw
 */
function drawStartScreen(canvas, ctx, img) {
  const { width, height } = getCanvasDimensions();
  canvas.width = width;
  canvas.height = height;

  drawBlurredBackground(ctx, img, canvas);
  drawCenteredImage(ctx, img, canvas);
}

/**
 * Initializes the start screen canvas and sets up event listeners.
 * Handles responsive drawing on resize and fullscreen changes.
 */
function initStartScreenCanvas() {
  const canvas = document.getElementById('startScreenCanvas');
  const ctx = canvas.getContext('2d');
  const img = document.getElementById('startScreenImg');
  const draw = () => drawStartScreen(canvas, ctx, img);

  document.addEventListener('fullscreenchange', draw);
  document.addEventListener('webkitfullscreenchange', draw);
  window.addEventListener('resize', draw);

  img.complete ? draw() : img.addEventListener('load', draw);
}

/**
 * Checks if the browser is currently in fullscreen mode.
 * @returns {boolean} True if in fullscreen mode
 */
function isInFullscreen() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

/**
 * Applies mobile-specific canvas styling for screens 720px or smaller.
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function setMobileCanvasStyle(canvas) {
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  canvas.style.maxWidth = '720px';
}

/**
 * Applies desktop-specific canvas styling for screens larger than 720px.
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function setDesktopCanvasStyle(canvas) {
  canvas.style.width = '720px';
  canvas.style.height = '480px';
  canvas.style.maxWidth = '';
}

/**
 * Updates canvas dimensions and styling based on screen size and fullscreen state.
 */
function updateCanvasResponsive() {
  const canvas = document.getElementById('canvas');

  if (isInFullscreen()) {
    updateCanvasFullscreen(canvas);
    return;
  }

  const screenWidth = window.innerWidth;
  screenWidth <= 720 ? setMobileCanvasStyle(canvas) : setDesktopCanvasStyle(canvas);
}

/**
 * Updates canvas dimensions for fullscreen mode while maintaining aspect ratio.
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function updateCanvasFullscreen(canvas) {
  const aspectRatio = 720 / 480;
  const screenRatio = window.innerWidth / window.innerHeight;

  if (screenRatio > aspectRatio) {
    canvas.style.height = '100vh';
    canvas.style.width = (window.innerHeight * aspectRatio) + 'px';
  } else {
    canvas.style.width = '100vw';
    canvas.style.height = (window.innerWidth / aspectRatio) + 'px';
  }

  canvas.style.maxWidth = '';
}

/**
 * Shows the controls section in the start menu.
 * Hides the main start content.
 */
function showControls() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('controllsSection').classList.remove('hidden');
}

/**
 * Hides the controls section and shows the main start content.
 */
function hideControls() {
  document.getElementById('controllsSection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
}

/**
 * Displays the character story screen.
 * Hides the main start content and character info button.
 */
function showCharacterStory() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('characterInfoBtn').classList.add('hidden');
  document.getElementById('characterStorySection').classList.remove('hidden');
}

/**
 * Hides the character story screen.
 * Shows the main start content and character info button.
 */
function hideCharacterStory() {
  document.getElementById('characterStorySection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
}

/**
 * Shows the "Impressum" section.
 * Hides the main start content and character info button.
 */
function showImpressum() {
  document.getElementById('startContent').classList.add('hidden');
  document.getElementById('characterInfoBtn').classList.add('hidden');
  document.getElementById('impressumSection').classList.remove('hidden');
}

/**
 * Hides the "Impressum" section.
 * Shows the main start content and character info button.
 */
function hideImpressum() {
  document.getElementById('impressumSection').classList.add('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
}

/**
 * Initializes the audio button state based on saved localStorage preference.
 * Updates button icon and styling based on mute state.
 */
function initializeAudioButton() {
  const btn = document.getElementById('audioBtn');
  const isMuted = audios.isMuted;

  if (isMuted) {
    btn.textContent = '🔇';
    btn.classList.add('muted');
  } else {
    btn.textContent = '🔊';
    btn.classList.remove('muted');
  }
}

/**
 * Toggles game audio mute/unmute and updates the audio button state.
 * Starts background music if unmuted.
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
 * Tries requestFullscreen, webkitRequestFullscreen, and msRequestFullscreen.
 */
function enterFullscreen() {
  const methods = ['requestFullscreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
  methods.forEach(method => {
    if (document.body[method]) document.body[method]();
  });
}

/**
 * Exits fullscreen mode using cross-browser compatibility.
 * Tries exitFullscreen, webkitExitFullscreen, and msExitFullscreen.
 */
function exitFullscreen() {
  const methods = ['exitFullscreen', 'webkitExitFullscreen', 'msExitFullscreen'];
  methods.forEach(method => {
    if (document[method]) document[method]();
  });
}

/**
 * Handles fullscreen state changes.
 * Updates button state, background, and canvas dimensions.
 * @listens fullscreenchange
 * @listens webkitfullscreenchange
 */
function handleFullscreenChange() {
  const btn = document.getElementById('fullscreenBtn');
  const canvas = document.getElementById('canvas');
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

  updateFullscreenButton(btn, isFullscreen);

  if (isFullscreen) {
    document.body.style.backgroundImage = 'url("./img/img_pollo_locco/img/background_full/desert.jpg")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    updateCanvasFullscreen(canvas);
  } else {
    document.body.style.backgroundImage = '';
    updateCanvasResponsive();
  }
}

/**
 * Updates fullscreen button icon and state.
 * @param {HTMLElement} btn - Fullscreen button element
 * @param {boolean} isFullscreen - Whether currently in fullscreen mode
 */
function updateFullscreenButton(btn, isFullscreen) {
  btn.textContent = '⛶';
  btn.classList.toggle('active', isFullscreen);
  btn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
}