// test_sketch.js

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Test Failed: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ Test Passed: ${message}`);
  }
}

// --- p5.js & math mocks ---
global.windowWidth = 800;
global.windowHeight = 600;
global.width = global.windowWidth; // Correctly reference global for p5's width
global.height = global.windowHeight; // Correctly reference global for p5's height

global.createCanvas = (w, h) => ({
  parent: () => {}
});
global.noCursor = () => {};
global.loadImage = () => ({ width: 100, height: 100 });
global.loadSound = () => ({ play: () => {}, isLoaded: () => true });

global.abs = Math.abs;
global.PI = Math.PI;
global.floor = Math.floor;
global.min = Math.min;
global.max = Math.max;
global.random = (arg) => (Array.isArray(arg) ? arg[0] : 0.5);
global.dist = (x1, y1, x2, y2) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

// Timer mocks (critical for startGame to not hang)
global.setInterval = (fn, delay) => { fn(); return 1; }; // Run immediately
global.clearInterval = (id) => {};
global.setTimeout = (fn, delay) => { fn(); }; // Run immediately


// --- DOM Mocks ---
const dom = {}; // Stores mocked DOM elements
function createMockElement(id) {
  return dom[id] || (dom[id] = {
    id,
    textContent: '',
    style: {
      display: '',
      width: '',
      backgroundColor: '',
      opacity: '',
      animation: ''
    },
    classList: {
      _set: new Set(),
      add(cls) {
        this._set.add(cls);
      },
      remove(cls) {
        this._set.delete(cls);
      },
      contains(cls) {
        return this._set.has(cls);
      }
    },
    _eventListeners: {},
    addEventListener(type, fn) {
      this._eventListeners[type] = this._eventListeners[type] || [];
      this._eventListeners[type].push(fn);
    },
    click() {
      // Simulate click: iterate over registered 'click' listeners and call them
      (this._eventListeners['click'] || []).forEach(fn =>
        fn({ target: this }) // Pass a mock event object
      );
    },
    offsetWidth: 0 // Mocked for gameMessage etc.
  });
}

global.document = {
  getElementById: createMockElement,
  body: { appendChild: () => {}, style: {} }, // Mock body, add style if your sketch accesses it
  addEventListener: (type, listener) => {}, // Mock global document event listeners
  removeEventListener: (type, listener) => {}
};
global.window = {
  addEventListener: (type, listener) => {}, // Mock global window event listeners
  removeEventListener: (type, listener) => {},
  // Add other window properties if needed, e.g. innerWidth
};


// --- Game State Variables (from sketch.js, made global for testing) ---
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

// --- Import sketch.js ---
// This line executes sketch.js and defines functions like setup, startGame, preload,
// updateScoreDisplay, etc., directly in the global scope (global.setup, global.startGame).
require('./sketch.js');

// --- Reset game state before test ---
function resetGameState() {
  // Reset all relevant global variables to initial state
  global.score = 0;
  global.timeLeft = 45;
  global.gameStarted = false;
  global.gameOver = false;
  global.difficulty = 'easy';
  global.shownDifficultyMessage = false;
  global.currentHoles = [];
  global.moleVisible = false;

  // Reset DOM element states for a clean test
  createMockElement('customStartModal').style.display = 'flex';
  createMockElement('startButton'); // Ensure button element exists in mock
  createMockElement('exitButton').style.display = 'none';
  createMockElement('scoreDisplay').textContent = 'Score: 0';
  createMockElement('timerDisplay').textContent = 'Time: 45s';
  createMockElement('timeBar').style.width = '100%';
  createMockElement('timeBar').style.backgroundColor = '#053b12';
  createMockElement('gameMessage').textContent = '';
  createMockElement('gameMessage').classList._set.clear();
  createMockElement('gameMessage').style.opacity = '0';
  createMockElement('gameMessage').style.animation = '';
  createMockElement('gameOverModal').style.display = 'none';
  createMockElement('finalScoreText').textContent = '';
  createMockElement('creditModal').style.display = 'none';

  // Clear event listeners on all mocked DOM elements
  for (const id in dom) {
    dom[id]._eventListeners = {};
  }

  // **CRITICAL:** Explicitly call preload() and setup() from your sketch.js
  // These functions are now available in the global scope after `require('./sketch.js')`.
  if (typeof global.preload === 'function') {
    global.preload();
  } else {
    console.warn("Warning: global.preload() not found. Sketch might not be fully initialized.");
  }

  if (typeof global.setup === 'function') {
    global.setup();
  } else {
    console.error("Error: global.setup() function not found after loading sketch.js!");
    throw new Error("Setup function not found for testing.");
  }
}

// --- TEST: Start Game Button ---
function test_startGame_button() {
  console.log('\n--- Running test_startGame_button ---');
  resetGameState(); // Reset state for a clean test run

  const startButton = createMockElement('startButton');
  const startModal = createMockElement('customStartModal');

  // Assert initial state before click
  assert(startModal.style.display === 'flex', 'Start modal should be visible initially.');
  assert(global.gameStarted === false, 'Game should not be started initially.');

  startButton.click(); // Simulate user clicking Start Game button

  // Assert state after click
  assert(global.gameStarted === true, 'Game should be started after clicking Start Game button.');
  assert(startModal.style.display === 'none', 'Start modal should be hidden after clicking Start Game button.');
}

// --- Run Test ---
try {
  test_startGame_button();
  // Add calls to other test functions here once test_startGame_button passes
  console.log('\n🎉 All tests passed successfully!');
} catch (e) {
  console.error(`\n❌ Test failed: ${e.message}`);
  process.exit(1);
}