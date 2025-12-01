let canvas;
let world;
let keyboard = new Keyboard();
let level1;

let audios = new Audios();

window.addEventListener('DOMContentLoaded', () => {

  detectTouchDevice();

  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('controllsBtn').addEventListener('click', showControls);
  document.getElementById('closeControlsBtn').addEventListener('click', hideControls);

  document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
  document.getElementById('audioBtn').addEventListener('click', toggleAudio);

  document.getElementById('characterInfoBtn').addEventListener('click', showCharacterStory);
  document.getElementById('closeStoryBtn').addEventListener('click', hideCharacterStory);

  document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);

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

  // Fullscreen Change Events
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
});

function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('backToMenuBtn').classList.remove('hidden');

  if (detectTouchDevice()) {
    document.getElementById('mobileControls').classList.remove('hidden');
    setupTouchControls();
  }

  level1 = createLevel1();
  init();
}

function backToMenu() {
  if (world) {
    world.cleanup();
    world = null;
  }

  document.getElementById('backToMenuBtn').classList.add('hidden');

  document.getElementById('mobileControls').classList.add('hidden');

  document.getElementById('startScreen').classList.remove('hidden');
  document.getElementById('startContent').classList.remove('hidden');
  document.getElementById('characterInfoBtn').classList.remove('hidden');
}

window.addEventListener('resize', () => {
  detectTouchDevice();
});

// Touch

function detectTouchDevice() {
  const isTouchDevice = (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );

  const isSmallScreen = window.innerWidth <= 1000;

  // Gibt nur zurück ob Touch-Device, zeigt aber nichts an
  return isTouchDevice && isSmallScreen;
}


function setupTouchControls() {
  const leftBtn = document.querySelector('.control-btn.left');
  const rightBtn = document.querySelector('.control-btn.right');
  const jumpBtn = document.querySelector('.control-btn.jump');
  const throwBtn = document.querySelector('.control-btn.throw');

  // LEFT Button
  leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  // RIGHT Button
  rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  // JUMP Button
  jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  jumpBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });

  // THROW Button
  throwBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  throwBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.D = false;
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

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard, audios);
}

// Audio
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

// Fullscreen
function toggleFullscreen() {
  const btn = document.getElementById('fullscreenBtn');

  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    // In Fullscreen gehen
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      document.body.msRequestFullscreen();
    }
  } else {
    // Fullscreen beenden
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function handleFullscreenChange() {
  const btn = document.getElementById('fullscreenBtn');
  const canvas = document.getElementById('canvas');

  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    btn.textContent = '⛶';
    btn.classList.remove('active');
    btn.title = 'Fullscreen';

    canvas.style.width = '720px';
    canvas.style.height = '480px';
    canvas.style.maxWidth = '';
    canvas.style.maxHeight = '';

  } else {
    btn.textContent = '⛶';
    btn.classList.add('active');
    btn.title = 'Exit Fullscreen';

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


// Keyboard Controls
window.addEventListener('keydown', (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68 && world && world.character.bottleCount > 0) {
    keyboard.D = true;
  }
  if (e.keyCode == 82) {
    keyboard.R = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
  if (e.keyCode == 82) {
    keyboard.R = false;
  }
});

// Touch 
if ('ontouchstart' in window) {
  setTimeout(() => {
    const leftBtn = document.querySelector('.control-btn.left');
    const rightBtn = document.querySelector('.control-btn.right');
    const jumpBtn = document.querySelector('.control-btn.jump');
    const throwBtn = document.querySelector('.control-btn.throw');

    if (leftBtn && rightBtn && jumpBtn && throwBtn) {
      leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
      });
      leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
      });

      rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
      });
      rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
      });

      jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
      });
      jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
      });

      throwBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
      });
      throwBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false;
      });
    }
  }, 100);
}