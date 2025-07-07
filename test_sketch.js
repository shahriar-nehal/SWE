// test_sketch.js

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Test Failed: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ Test Passed: ${message}`);
  }
}

// --- Minimal p5.js Mocks ---
global.windowWidth = 800;
global.windowHeight = 600;
global.width = windowWidth;
global.height = windowHeight;

global.createCanvas = (w, h) => ({
  parent: () => {} // fix for canvas.parent()
});
global.noCursor = () => {};
global.loadImage = () => ({ width: 100, height: 100 });
global.loadSound = () => ({ play: () => {}, isLoaded: () => true });

// --- DOM Mocks ---
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
  getElementById: createMockElement,
  body: { appendChild: () => {} }
};

// --- Import sketch.js and bind exported functions ---
const sketch = require('./sketch.js');

global.setup = sketch.setup;
global.preload = sketch.preload;
global.startGame = sketch.startGame;

// --- Basic Game State ---
global.score = 0;
global.timeLeft = 45;
global.gameStarted = false;
global.gameOver = false;

// --- Reset before test ---
function resetGameState() {
  createMockElement('customStartModal').style.display = 'flex';
  createMockElement('startButton');
  createMockElement('exitButton').style.display = 'none';

  global.score = 0;
  global.timeLeft = 45;
  global.gameStarted = false;
  global.gameOver = false;

  // Attach DOM and event handlers
  global.preload();
  global.setup();
}

// --- TEST: Start Game Button ---
function test_startGame_button() {
  console.log('\n--- Running test_startGame_button ---');
  resetGameState();

  const startButton = createMockElement('startButton');
  const startModal = createMockElement('customStartModal');

  startButton.click(); // Simulate user clicking Start

  assert(global.gameStarted === true, 'Game should be started');
  assert(startModal.style.display === 'none', 'Start modal should be hidden');
}

// --- Run Test ---
try {
  test_startGame_button();
  console.log('\n🎉 Test passed successfully!');
} catch (e) {
  console.error(`\n❌ Test failed: ${e.message}`);
  process.exit(1);
}
