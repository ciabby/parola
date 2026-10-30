const svg = document.querySelector('svg');
const restartButton = document.querySelector('#restart-button');
const player = document.querySelector('.music-player');
const daysCounter = document.querySelector('.days-counter');
const daysCount = document.querySelector('#days-count');
const audio = new Audio();
const playerMessage = document.querySelector('#player-message');
const playButton = document.querySelector('#play-toggle');
const playIcon = document.querySelector('#play-icon');
const seekControl = document.querySelector('#track-seek');
const volumeControl = document.querySelector('#volume-control');
const currentTimeLabel = document.querySelector('#track-current-time');
const durationLabel = document.querySelector('#track-duration');
const skipBackButton = document.querySelector('#skip-back');
const skipForwardButton = document.querySelector('#skip-forward');
const downloadLink = document.querySelector('.download-button');
const downloadStatus = document.querySelector('#download-status');

let downloadFeedbackTimer;

downloadLink.addEventListener('click', () => {
  downloadLink.classList.add('is-downloading');
  downloadStatus.textContent = 'Il tuo pacchetto è in arrivo!';
  window.clearTimeout(downloadFeedbackTimer);
  downloadFeedbackTimer = window.setTimeout(() => {
    downloadLink.classList.remove('is-downloading');
    downloadStatus.textContent = 'Download avviato nel browser.';
  }, 1800);
});

const counterStartDate = Date.UTC(2026, 8, 29);

function updateDaysCounter() {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsedDays = Math.floor((today - counterStartDate) / 86_400_000);

  daysCount.textContent = String(Math.max(0, elapsedDays));
}

updateDaysCounter();
setInterval(updateDaysCounter, 60_000);

// Inserisci qui il percorso del brano, per esempio: "audio/musica.mp3".
const MUSIC_SOURCE = 'assets/audio/leie.mp3';
const hasMusicSource = MUSIC_SOURCE.trim().length > 0;

audio.preload = 'metadata';
audio.volume = Number(volumeControl.value);

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updatePlaybackControls() {
  const isPlaying = !audio.paused;

  playIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', isPlaying ? 'Metti in pausa' : 'Riproduci');
}

if (hasMusicSource) {
  audio.src = MUSIC_SOURCE;
  playerMessage.textContent = 'Pronto a partire';
  playButton.disabled = false;
}

playButton.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      playerMessage.textContent = 'Impossibile riprodurre il brano';
      console.error('Riproduzione audio non riuscita:', error);
    }
  } else {
    audio.pause();
  }

  updatePlaybackControls();
});

audio.addEventListener('play', updatePlaybackControls);
audio.addEventListener('pause', updatePlaybackControls);
audio.addEventListener('ended', updatePlaybackControls);

audio.addEventListener('loadedmetadata', () => {
  durationLabel.textContent = formatTime(audio.duration);
  playerMessage.textContent = 'Ti amo amore mio ❤️';
  seekControl.disabled = false;
  skipBackButton.disabled = false;
  skipForwardButton.disabled = false;
});

audio.addEventListener('timeupdate', () => {
  currentTimeLabel.textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    seekControl.value = String((audio.currentTime / audio.duration) * 100);
  }
});

audio.addEventListener('error', () => {
  playerMessage.textContent = 'Non riesco a caricare il brano';
});

seekControl.addEventListener('input', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seekControl.value) / 100) * audio.duration;
  }
});

volumeControl.addEventListener('input', () => {
  audio.volume = Number(volumeControl.value);
});

skipBackButton.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

skipForwardButton.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
});

const createSvgElement = (tag, attributes, parent) => {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    tag
  );

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }

  if (parent) {
    parent.append(element);
  }

  return element;
};

const animate = (element, keyframes, delay, duration = 1000, options = {}) =>
  element.animate(keyframes, {
    delay: delay * 1000,
    duration,
    fill: 'both',
    easing: 'cubic-bezier(.3, 1.5, .5, 1)',
    ...options,
  });

const popIn = (element, delay) =>
  animate(element, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], delay);

const createGroup = (parent, transform) =>
  createSvgElement('g', { transform }, parent);

function drawBouquet() {
  svg.innerHTML = '';

  const root = createSvgElement('g', {}, svg);

  animate(
    root,
    [{ transform: 'rotate(-.8deg)' }, { transform: 'rotate(.8deg)' }],
    7.6,
    5000,
    {
      direction: 'alternate',
      iterations: Infinity,
      easing: 'ease-in-out',
      fill: 'none',
    }
  );
  root.style.transformOrigin = '250px 470px';

  [
    [150, 305, -35],
    [362, 212, 40],
    [205, 112, -20],
    [97, 182, -40],
    [285, 336, 20],
    [345, 318, 45],
    [100, 100, -30],
    [255, 200, 5],
    [335, 45, 35],
    [155, 180, -15],
  ].forEach(([x, y, bend], index) => {
    const branch = createSvgElement(
      'path',
      {
        d: `M250,470 Q${(250 + x) / 2 + bend},${(470 + y) / 2 + 25} ${x},${y}`,
        fill: 'none',
        stroke: '#2e9a3e',
        'stroke-width': 7,
        'stroke-linecap': 'round',
        pathLength: 1,
        'stroke-dasharray': 1,
      },
      root
    );

    animate(
      branch,
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      0.2 + index * 0.15,
      1700,
      { easing: 'ease-out' }
    );
  });

  [
    [215, 445, -165, 1.2],
    [210, 405, -150, 1],
    [285, 440, -15, 1.3],
    [290, 395, -35, 1.1],
    [235, 350, -120, 0.8],
    [272, 330, -65, 0.8],
  ].forEach(([x, y, rotation, scale], index) => {
    const leaf = createSvgElement(
      'path',
      {
        d: 'M0,0 C10,-14 30,-22 62,-26 L52,-17 L68,-14 L56,-8 L72,-3 L54,2 L62,10 C40,10 15,7 0,0Z',
        fill: '#2a9a35',
        stroke: '#1f7a2a',
        'stroke-width': 1.5,
        'stroke-linejoin': 'round',
      },
      createGroup(
        root,
        `translate(${x},${y}) rotate(${rotation}) scale(${scale})`
      )
    );

    popIn(leaf, 1 + index * 0.25);
  });

  const stemBase = createSvgElement(
    'rect',
    { x: -17, y: -7, width: 34, height: 14, rx: 5, fill: '#1f7a2a' },
    createGroup(root, 'translate(250,440)')
  );
  popIn(stemBase, 2.4);

  [
    [100, 100, -12],
    [255, 200, 0],
    [335, 45, 10],
  ].forEach(([x, y, rotation], flowerIndex) => {
    const flower = createGroup(
      root,
      `translate(${x},${y}) rotate(${rotation})`
    );
    const petalColors = ['#9a7ccd', '#b79be0', '#8566bd', '#a98bd8'];

    for (let index = 0; index < 8; index += 1) {
      const petal = createSvgElement(
        'ellipse',
        {
          rx: 7 + Math.sin(((index + 1) / 9) * Math.PI) * 10,
          ry: 9,
          fill: petalColors[index % petalColors.length],
          stroke: '#6a4fa0',
          'stroke-width': 1.5,
        },
        createGroup(flower, `translate(0,${-52 + index * 14})`)
      );

      popIn(petal, 3 + flowerIndex * 0.4 + (7 - index) * 0.15);
    }
  });

  [
    [205, 112, 0.85, -10, 0.55],
    [150, 305, 1.45, 0, 1],
    [362, 212, 1.5, 0, 1],
    [97, 182, 0.6, 0, 1],
    [155, 180, 0.55, 0, 1],
    [285, 336, 0.6, 0, 1],
    [345, 318, 0.55, 0, 1],
  ].forEach(([x, y, scale, rotation, scaleY], flowerIndex) => {
    const delay = 4.2 + flowerIndex * 0.35;
    const positionedFlower = createGroup(
      root,
      `translate(${x},${y}) rotate(${rotation}) scale(${scale})`
    );
    const flower = createSvgElement(
      'g',
      { transform: `scale(1,${scaleY})` },
      positionedFlower
    );

    for (let index = 0; index < 15; index += 1) {
      const petal = createSvgElement(
        'ellipse',
        {
          cy: -30,
          rx: 9.5,
          ry: 30,
          fill: '#fff',
          stroke: '#c9d3e3',
          'stroke-width': 1.5,
        },
        createGroup(flower, `rotate(${index * 24})`)
      );

      popIn(petal, delay + index * 0.04);
    }

    const center = createSvgElement('g', {}, flower);
    popIn(center, delay + 0.5);
    createSvgElement(
      'circle',
      { r: 17, fill: '#f6c21a', stroke: '#e0a30c', 'stroke-width': 2 },
      center
    );
    createSvgElement('circle', { r: 10, fill: '#f39a1c' }, center);
  });

  const bugPosition = createGroup(root, 'translate(150,292)');
  const bug = createGroup(bugPosition, '');

  animate(
    bug,
    [
      { opacity: 0, transform: 'translate(30px,-30px)' },
      { opacity: 1, transform: 'none' },
    ],
    6.3,
    1200,
    { easing: 'ease-out' }
  );
  createSvgElement(
    'ellipse',
    { rx: 10, ry: 11, fill: '#e0262c', stroke: '#8c1015', 'stroke-width': 1.5 },
    bug
  );
  createSvgElement(
    'path',
    { d: 'M0,-11V11', stroke: '#222', 'stroke-width': 1.5 },
    bug
  );
  createSvgElement('circle', { cy: -12, r: 5, fill: '#222' }, bug);

  [[-4, -3], [4, 3]].forEach(([cx, cy]) => {
    createSvgElement('circle', { cx, cy, r: 2, fill: '#222' }, bug);
  });
}

if (restartButton) {
  restartButton.addEventListener('click', drawBouquet);
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function hideLoading() {
  await sleep(7000);
  const loadingDiv = document.querySelector('.caricamenti');
  if (loadingDiv) {
    loadingDiv.style.display = 'none';
  }

  player.classList.add('is-visible');
  daysCounter.classList.add('is-visible');
  drawBouquet();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideLoading, { once: true });
} else {
  hideLoading();
}