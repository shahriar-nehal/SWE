// test_sketch.js

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Test Failed: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ Test Passed: ${message}`);
  }
}

// --- p5.js mocks ---
global.windowWidth = 800;
global.windowHeight = 600;
global.width = windowWidth;
global.height = windowHeight;

global.createCanvas = (w, h) => {
  global.width = w;
  global.height = h;
  return {
    parent: () => {} // ✅ fix for canvas.parent()
  };
};

global.noCursor = () => {};
global.loadImage = () => ({ width: 100, height: 100 });
global.loadSound = () => ({ play: () => {}, isLoaded: () => true });
global.imageMode = () => {};
global.CENTER = 'center';
global.image = () => {};
global.push = () => {};
global.pop = () => {};
global.translate = () => {};
global.rotate = () => {};
global.mouseX = 100;
global.mouseY = 100;
global.min = Math.min;
global.abs = Math.abs;
global.PI = Math.PI;
global.textSize = () => {};
global.textAlign = () => {};
global.rect = () => {};
global.color = () => 'mockedColor';
global.ellipse = () => {};
global.stroke = () => {};
global.strokeWeight = () => {};
global.fill = () => {};
global.line = () => {};
global.sin = Math.sin;
global.frameCount = 0;
global.random = (arg) => (Array.isArray(arg) ? arg[0] : 0.5);
global.floor = Math.floor;
global.dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
global.max = Math.max;

global.setInterval = (fn) => { fn(); return 1; };
global.clearInterval = () => {};
global.setTimeout = (fn) => { fn(); };

// --- DOM mocking ---
const dom = {};
function createMockElement(id) {
  return dom[id] || (dom[id] = {
    id,
    textContent: '',
    style: { display: '', width: '', backgroundColor: '', opacity: '', animation: '' },
    classList: {
      _set: new Set(),
      add(cls) { this._set.add(cls); },
      remove(cls) { this._set.delete(cls); },
      contains(cls) { return this._set.has(cls); }
    },
    _eventListeners: {},
    addEventListener(type, fn) {
      this._eventListeners[type] = this._eventListeners[type] || [];
      this._eventListeners[type].push(fn);
    },
    click() {
      (this._eventListeners['click'] || []).forEach(fn => fn({ target: this }));
    },
    offsetWidth: 0
  });
}

global.document = {
  getElementById: (id) => createMockElement(id),
  body: { appendChild: () => {} }
};

global.window = { addEventListener: () => {} };

// --- game state variables ---
global.holes = [];
global.currentHoles = [];
global.score = 0;
global.moleVisible = false;
global.moleTimer = null;
global.hammerImg = null;
global.hammerAngle = 45;
global.hammerSwinging = false;
global.timeLeft = 45;
global.gameStarted = false;
global.gameOver = false;
global.timerInterval = null;
global.difficulty = 'easy';
global.shownDifficultyMessage = false;

// --- import from sketch.js ---
const sketch = require('./sketch.js');

global.preload = sketch.preload;
global.setup = sketch.setup;
global.draw = sketch.draw;
global.startGame = sketch.startGame;
global.endGame = sketch.endGame;
global.updateScoreDisplay = sketch.updateScoreDisplay;
global.updateTimerDisplay = sketch.updateTimerDisplay;
global.moveMole = sketch.moveMole;
global.mousePressed = sketch.mousePressed;

// --- helper to reset game state and DOM ---
function resetGameState() {
  global.score = 0;
  global.timeLeft = 45;
  global.difficulty = 'easy';
  global.shownDifficultyMessage = false;
  global.gameStarted = false;
  global.gameOver = false;
  global.currentHoles = [];
  global.moleVisible = false;

  const ids = [
    'customStartModal', 'startButton', 'creditButton', 'creditModal', 'closeCreditModal',
    'backToHomeButton', 'gameOverModal', 'finalScoreText', 'restartButton',
    'backToHomeFromGameOver', 'timerDisplay', 'timeBar', 'scoreDisplay', 'gameMessage', 'exitButton'
  ];

  // ✅ Step 1: Create all DOM elements before setup()
  ids.forEach(id => createMockElement(id));

  // ✅ Step 2: preload and setup (now can access the mocked DOM)
  global.preload();
  global.setup();

  // ✅ Step 3: reset styles and listeners
  ids.forEach(id => {
    const el = createMockElement(id);
    el.textContent = '';
    el.style.display = '';
    el.classList._set.clear();
    el._eventListeners = {};
  });
}

// --- TEST: Start Game Button ---
global.test_startGame_button = function () {
  console.log("\n--- Running test_startGame_button ---");
  resetGameState();

  const startModal = createMockElement('customStartModal');
  const startButton = createMockElement('startButton');
  startModal.style.display = 'flex';

  startButton.click();

  assert(global.gameStarted === true, 'Game should be started');
  assert(startModal.style.display === 'none', 'Start modal should be hidden');
  assert(global.score === 0, 'Score should be reset');
  assert(global.timeLeft === 45, 'Time should reset');
  assert(createMockElement('exitButton').style.display === 'block', 'Exit button should be shown');
};

// --- TEST: Game Over Flow ---
global.test_gameOver_flow = function () {
  console.log("\n--- Running test_gameOver_flow ---");
  resetGameState();

  global.score = 99;
  global.gameStarted = true;

  global.endGame();

  const gameOverModal = createMockElement('gameOverModal');
  const finalScoreText = createMockElement('finalScoreText');

  assert(global.gameOver === true, 'Game should be marked as over');
  assert(gameOverModal.style.display === 'flex', 'Game Over modal should be visible');
  assert(finalScoreText.textContent === 'Your score: 99', 'Final score text should be set');
};

// --- Run All Tests ---
try {
  global.test_startGame_button();
  global.test_gameOver_flow();
  console.log('\n🎉 All tests passed!');
} catch (e) {
  console.error(`\n❌ Test Suite Failed: ${e.message}`);
  process.exit(1);
}
