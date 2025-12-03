// ============================================
// UI.JS - Angepasste Version
// ============================================

/**
 * Initializes the application once the DOM is fully loaded.
 * Sets up UI event listeners and updates the start screen image.
 * @event DOMContentLoaded
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

window.addEventListener('orientationchange', updateViewState);

/**
 * Handles window resize events to adjust layout and UI visibility.
 * @event resize
 */
window.addEventListener('resize', () => {
  updateViewState();
  updateCanvasResponsive();
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
* Initializes and manages the responsive start screen canvas.
* Draws the start screen image on a canvas that scales with window size.
* @returns {void}
*/
function initStartScreenCanvas() {
  const canvas = document.getElementById('startScreenCanvas');
  const ctx = canvas.getContext('2d');
  const img = document.getElementById('startScreenImg');

  function drawStartScreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bgScale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const bgX = (canvas.width - img.width * bgScale) / 2;
    const bgY = (canvas.height - img.height * bgScale) / 2;

    ctx.filter = 'blur(20px) brightness(0.7)';
    ctx.drawImage(img, bgX, bgY, img.width * bgScale, img.height * bgScale);

    ctx.filter = 'none';
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  // Redraw on window resize
  window.addEventListener('resize', drawStartScreen);

  // Draw immediately if image already loaded
  if (img.complete) {
    drawStartScreen();
  }
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
 * Updates canvas size responsively based on screen width.
 * Canvas scales to 100% width when screen is 720px or smaller.
 * Maintains 3:2 aspect ratio (720x480).
 * @returns {void}
 */
function updateCanvasResponsive() {
  const canvas = document.getElementById('canvas');
  const screenWidth = window.innerWidth;
  const aspectRatio = 720 / 480;

  if (screenWidth <= 720) {
    // Responsive mode: 100% width
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.maxWidth = '720px';
  } else {
    // Fixed size mode
    canvas.style.width = '720px';
    canvas.style.height = '480px';
    canvas.style.maxWidth = '';
  }
}

/**
 * Shows the fullscreen toggle button.
 */
function showFullscreenButton() {
  document.getElementById('fullscreenBtn').style.display = 'flex';
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
 * Initializes the audio button state based on saved localStorage preference.
 * Updates button icon and class to reflect current mute state.
 * @returns {void}
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
 * Toggles game audio mute/unmute, updates the audio button state,
 * and saves the preference to localStorage.
 * @returns {void}
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
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

  updateFullscreenButton(btn, isFullscreen);

  // Update canvas when exiting fullscreen
  if (!isFullscreen) {
    updateCanvasResponsive();
  }
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

/**
 * Starts the game by hiding the start menu, initializing the level and creating the game world.
 * Also activates mobile controls and starts background music based on user preference.
 * @returns {void}
 */
function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('backToMenuBtn').classList.remove('hidden');

  if (!audios.isMuted) {
    audios.playBackgroundMusic();
  }

  level1 = createLevel1();
  init();
  updateViewState();
  updateCanvasResponsive();
}