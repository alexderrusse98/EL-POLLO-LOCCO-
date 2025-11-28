let canvas;
let world;
let keyboard = new Keyboard();
let level1;

let audios = new Audios();

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('controllsBtn').addEventListener('click', showControls);
  document.getElementById('closeControlsBtn').addEventListener('click', hideControls);

  document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
  document.getElementById('audioBtn').addEventListener('click', toggleAudio);

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
  world = new World(canvas, keyboard, audios);
}

// audio
function toggleAudio() {
    const btn = document.getElementById('audioBtn');
    const isMuted = audios.toggleMute();
    
    if (isMuted) {
        btn.textContent = '🔇 Audio Off';
        btn.classList.add('muted');
    } else {
        btn.textContent = '🔊 Audio On';
        btn.classList.remove('muted');
        audios.playBackgroundMusic();
    }
}

// fullscreen
function toggleFullscreen() {
    const btn = document.getElementById('fullscreenBtn');
    
    if (!document.fullscreenElement) {
        // In Fullscreen gehen
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
        btn.textContent = '⛶';
        btn.classList.add('active');
        btn.title = 'Exit Fullscreen';
    } else {
        // Fullscreen beenden
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        btn.textContent = '⛶';
        btn.classList.remove('active');
        btn.title = 'Fullscreen';
    }
}

// Button automatisch updaten wenn ESC gedrückt wird
document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('fullscreenBtn');
    if (!document.fullscreenElement) {
        btn.textContent = '⛶';
        btn.classList.remove('active');
        btn.title = 'Fullscreen';
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    const btn = document.getElementById('fullscreenBtn');
    if (!document.webkitFullscreenElement) {
        btn.textContent = '⛶';
        btn.classList.remove('active');
        btn.title = 'Fullscreen';
    }
});

document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('fullscreenBtn');
    const canvas = document.getElementById('canvas');
    
    if (!document.fullscreenElement) {
        btn.textContent = '⛶';
        btn.classList.remove('active');
    } else {
        // Canvas an Bildschirmgröße anpassen
        const aspectRatio = 720 / 480;
        const screenRatio = window.innerWidth / window.innerHeight;
        
        if (screenRatio > aspectRatio) {
            // Breiter Bildschirm
            canvas.style.height = '100vh';
            canvas.style.width = 'auto';
        } else {
            // Hoher Bildschirm
            canvas.style.width = '100vw';
            canvas.style.height = 'auto';
        }
    }
});



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
  if (e.keyCode == 82) {
    keyboard.R = true;
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