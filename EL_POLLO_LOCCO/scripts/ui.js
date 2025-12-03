/**
 * UI.JS - Handles all UI controls, menu management, and screen updates
 */

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

window.addEventListener('orientationchange', updateViewState);

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

/**
 * Checks if the device is in portrait orientation.
 * @returns {boolean} True if height > width.
 */
function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

/**
 * Updates the UI state based on orientation and screen size.
 * Manages portrait warning and mobile controls visibility.
 * @returns {void}
 */
function updateViewState() {
  const viewData = getViewStateData();

  updatePortraitWarning(viewData.body, viewData.portrait);
  updateMobileControlsVisibility(viewData);
}

/**
 * Collects all necessary DOM elements and state information.
 * @returns {Object} Object containing view state data
 * @property {HTMLElement} body - Document body element
 * @property {HTMLElement} mobileControls - Mobile controls container
 * @property {HTMLElement} startScreen - Start screen element
 * @property {boolean} portrait - Whether device is in portrait mode
 * @property {boolean} isGameActive - Whether game is currently active
 * @property {number} screenWidth - Current window width in pixels
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
 * @param {HTMLElement} body - Document body element
 * @param {boolean} isPortrait - Whether device is in portrait orientation
 * @returns {void}
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
 * Controls are shown only when game is active and device is in landscape.
 * @param {Object} viewData - View state data object
 * @param {HTMLElement} viewData.mobileControls - Mobile controls element
 * @param {boolean} viewData.isGameActive - Whether game is running
 * @param {boolean} viewData.portrait - Whether in portrait mode
 * @returns {void}
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