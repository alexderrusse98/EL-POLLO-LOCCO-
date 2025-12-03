
/**
 * Initializes the application once the DOM is fully loaded.
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
 */
window.addEventListener('resize', () => {
  updateViewState();
  updateCanvasResponsive();
});

/**
 * Checks if the device is in portrait orientation.
 */
function isPortrait() {
  return window.innerHeight > window.innerWidth;
}


function updateViewState() {
  const viewData = getViewStateData();
  updatePortraitWarning(viewData.body, viewData.portrait);
  updateMobileControlsVisibility(viewData);
}

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


function initStartScreenCanvas() {
  const canvas = document.getElementById('startScreenCanvas');
  const ctx = canvas.getContext('2d');
  const img = document.getElementById('startScreenImg');

  function drawStartScreen() {
    const width = document.fullscreenElement ? window.screen.width : window.innerWidth;
    const height = document.fullscreenElement ? window.screen.height : window.innerHeight;

    canvas.width = width;
    canvas.height = height;

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

  document.addEventListener('fullscreenchange', drawStartScreen);
  document.addEventListener('webkitfullscreenchange', drawStartScreen);
  window.addEventListener('resize', drawStartScreen);

  if (img.complete) {
    drawStartScreen();
  } else {
    img.addEventListener('load', drawStartScreen);
  }
}

/**
 * Toggles the portrait warning class on the body element.
 */
function updatePortraitWarning(body, isPortrait) {
  if (isPortrait) {
    body.classList.add('portrait-warning');
  } else {
    body.classList.remove('portrait-warning');
  }
}


function updateMobileControlsVisibility(viewData) {
  const shouldShow = viewData.isGameActive && !viewData.portrait;
  if (shouldShow) {
    viewData.mobileControls.classList.remove('hidden');
  } else {
    viewData.mobileControls.classList.add('hidden');
  }
}


function updateCanvasResponsive() {
  const canvas = document.getElementById('canvas');
  const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

  if (isFullscreen) {
    updateCanvasFullscreen(canvas);
    return;
  }

  const screenWidth = window.innerWidth;
  if (screenWidth <= 720) {
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.maxWidth = '720px';
  } else {
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
 * Toggles game audio mute/unmute, updates the audio button state.
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


function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('backToMenuBtn').classList.remove('hidden');

  if (!audios.isMuted) {
    audios.playBackgroundMusic();
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