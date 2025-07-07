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
global.width = windowWidth;
global.height = windowHeight;

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

// --- DOM Mocks ---
const dom = {};
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
      (this._eventListeners['click'] || []).forEach(fn =>
        fn({ target: this })
      );
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

// --- Reset game state before test ---
function resetGameState() {
  createMockElement('customStartModal').style.display = 'flex';
  createMockElement('startButton');
  createMockElement('exitButton').style.display = 'none';

  global.score = 0;
  global.timeLeft = 45;
  global.gameStarted = false;
  global.gameOver = false;

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
