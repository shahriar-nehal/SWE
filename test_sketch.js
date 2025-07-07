// test_sketch.js

// --- Basic Assertion Function (from your professor's parser.js) ---
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ Test Failed: ${message}`);
        // To make it fail loudly, throw an error
        throw new Error(message);
    } else {
        console.log(`✅ Test Passed: ${message}`);
    }
}

// --- Global Mocks for p5.js Functions and Variables ---
// This is the MOST IMPORTANT PART.
// Node.js doesn't understand p5.js or browser DOM elements.
// We must provide dummy (mock) versions of *every* p5.js global function
// and browser global variable that sketch.js tries to access.

global.p5 = function(sketch) {}; // Mock the p5 constructor if used
global.loadImage = (path) => ({ width: 100, height: 100 }); // Dummy image object
global.loadSound = (path) => ({ play: () => {}, isLoaded: () => true }); // Dummy sound object

// Core p5.js drawing/setup functions - these will just be empty functions
global.createCanvas = (w, h) => { /* console.log(`Mock: createCanvas(${w}, ${h})`); */ };
global.windowWidth = 800; // Provide dummy dimensions
global.windowHeight = 600;
global.noCursor = () => { /* console.log("Mock: noCursor()"); */ };
global.background = (r, g, b) => { /* console.log(`Mock: background(${r}, ${g}, ${b})`); */ };
global.stroke = (c) => { /* console.log(`Mock: stroke(${c})`); */ };
global.strokeWeight = (w) => { /* console.log(`Mock: strokeWeight(${w})`); */ };
global.fill = (c) => { /* console.log(`Mock: fill(${c})`); */ };
global.ellipse = (x, y, w, h) => { /* console.log(`Mock: ellipse(${x}, ${y}, ${w}, ${h})`); */ };
global.line = (x1, y1, x2, y2) => { /* console.log(`Mock: line(${x1}, ${y1}, ${x2}, ${y2})`); */ };
global.sin = Math.sin;
global.frameCount = 0; // Can be incremented if needed for specific tests
global.min = Math.min;
global.width = global.windowWidth; // p5.js global width
global.height = global.windowHeight; // p5.js global height
global.imageMode = (mode) => { /* console.log(`Mock: imageMode(${mode})`); */ };
global.CENTER = 'center'; // p5.js constant
global.image = (img, x, y, w, h) => { /* console.log(`Mock: image(${img}, ${x}, ${y}, ${w}, ${h})`); */ };
global.push = () => { /* console.log("Mock: push()"); */ };
global.pop = () => { /* console.log("Mock: pop()"); */ };
global.translate = (x, y) => { /* console.log(`Mock: translate(${x}, ${y})`); */ };
global.rotate = (angle) => { /* console.log(`Mock: rotate(${angle})`); */ };
global.abs = Math.abs;
global.PI = Math.PI;
global.textSize = (s) => { /* console.log(`Mock: textSize(${s})`); */ };
global.textAlign = (h, v) => { /* console.log(`Mock: textAlign(${h}, ${v})`); */ };
global.rect = (x, y, w, h, r) => { /* console.log(`Mock: rect(${x}, ${y}, ${w}, ${h}, ${r})`); */ };
global.color = (r, g, b) => `rgb(${r},${g},${b})`; // Simple string for color function

// Math and utility functions
global.random = (arg) => {
    // For predictable test results, make random deterministic
    if (Array.isArray(arg)) return arg[0]; // Always return the first item if an array is passed
    return 0.5; // Always return 0.5 if no argument (or a number range)
};
global.floor = Math.floor;
global.dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
global.max = Math.max;

// Timer and interval mocks - Make them execute immediately for testing
global.setInterval = (fn, delay) => { fn(); return 1; }; // Execute immediately, return dummy ID
global.clearInterval = (id) => {};
global.setTimeout = (fn, delay) => { fn(); }; // Execute immediately

// --- Mock HTML DOM Elements and their Methods ---
// We need to simulate the existence of HTML elements that sketch.js interacts with
// by providing simple JS objects that mimic their properties/methods.

// This map will hold our mocked DOM elements by ID
const mockedDomElements = {};

// Helper to create or get a mocked element
function createMockElement(id, initialContent = '') {
    if (mockedDomElements[id]) return mockedDomElements[id];

    const element = {
        id: id,
        textContent: initialContent,
        style: { display: '', width: '', backgroundColor: '', opacity: '', animation: '' }, // Mimic style object
        classList: { // Mimic classList methods
            _classes: new Set(),
            add: function(cls) { this._classes.add(cls); },
            remove: function(cls) { this._classes.delete(cls); },
            contains: function(cls) { return this._classes.has(cls); }
        },
        // Mock addEventListener for buttons
        _eventListeners: {},
        addEventListener: function(type, listener) {
            if (!this._eventListeners[type]) this._eventListeners[type] = [];
            this._eventListeners[type].push(listener);
        },
        // Simulate a click, calling registered listeners
        click: function() {
            if (this._eventListeners['click']) {
                this._eventListeners['click'].forEach(listener => listener({ target: this }));
            }
        },
        // For gameMessage
        offsetWidth: 0 // Mock this property if it's accessed
    };
    mockedDomElements[id] = element;
    return element;
}

// Override `document.getElementById` to return our mocked elements
global.document = {
    getElementById: (id) => {
        // Create mocks for all elements your sketch.js interacts with
        switch(id) {
            case 'customStartModal': return createMockElement(id, '<h2>Whack-a-Mole!</h2>');
            case 'startButton': return createMockElement(id, 'Start Game');
            case 'creditButton': return createMockElement(id, 'Credits');
            case 'creditModal': return createMockElement(id);
            case 'closeCreditModal': return createMockElement(id);
            case 'backToHomeButton': return createMockElement(id);
            case 'gameOverModal': return createMockElement(id);
            case 'finalScoreText': return createMockElement(id, 'Your score: 0');
            case 'restartButton': return createMockElement(id, 'Play Again');
            case 'backToHomeFromGameOver': return createMockElement(id);
            case 'timerDisplay': return createMockElement(id, 'Time: 45s');
            case 'timeBar': return createMockElement(id);
            case 'scoreDisplay': return createMockElement(id, 'Score: 0');
            case 'gameMessage': return createMockElement(id);
            case 'exitButton': return createMockElement(id);
            default: return null; // Or throw an error if an unmocked element is accessed
        }
    },
    // Mock `document.body` if your sketch accesses it (e.g., `canvas.parent(document.body)`)
    body: { appendChild: () => {}, style: {} },
    // Mock global event listeners if your sketch uses them on document
    addEventListener: (type, listener) => {},
    removeEventListener: (type, listener) => {}
};


// --- 4. Define Global Game State Variables ---
// These need to be accessible globally just like in sketch.js
// Their initial values will be set by the actual sketch.js when it runs.
// We declare them here so we can reset them in our test functions.
let holes = [];
let currentHoles = [];
let score = 0;
let moleVisible = false;
let moleTimer;
let hammerImg; // Will be loaded by preload
let hammerAngle = 45;
let hammerSwinging = false;
let timeLeft = 45;
let gameStarted = false;
let gameOver = false;
let timerInterval;
let difficulty = 'easy';
let shownDifficultyMessage = false;

// Expose these as global variables for the test.
global.holes = holes;
global.currentHoles = currentHoles;
global.score = score;
global.moleVisible = moleVisible;
global.moleTimer = moleTimer;
global.hammerImg = hammerImg;
global.hammerAngle = hammerAngle;
global.hammerSwinging = hammerSwinging;
global.timeLeft = timeLeft;
global.gameStarted = gameStarted;
global.gameOver = gameOver;
global.timerInterval = timerInterval;
global.difficulty = difficulty;
global.shownDifficultyMessage = shownDifficultyMessage;

// --- 5. Import / Load your actual sketch.js ---
// This is the file you want to test. By using `require`, its global functions
// (setup, draw, updateScoreDisplay, etc.) and global variables will become
// available in this test environment.
const sketch = require('./sketch.js');

// Assign globally for testing just like p5 does
global.preload = sketch.preload;
global.setup = sketch.setup;
global.draw = sketch.draw;
global.startGame = sketch.startGame;
global.endGame = sketch.endGame;
global.updateScoreDisplay = sketch.updateScoreDisplay;
global.updateTimerDisplay = sketch.updateTimerDisplay;
global.moveMole = sketch.moveMole;
global.mousePressed = sketch.mousePressed;

// --- 6. Define Your Test Functions (Similar to parser.js) ---

// Helper to reset the game state for each test
function resetGameState() {
    global.score = 0;
    global.timeLeft = 45;
    global.difficulty = 'easy';
    global.shownDifficultyMessage = false;
    global.gameStarted = false;
    global.gameOver = false;
    global.currentHoles = [];
    global.moleVisible = false; // Ensure mole is not visible initially

    // Reset mocked DOM elements for a clean state
    createMockElement('scoreDisplay').textContent = 'Score: 0';
    createMockElement('timerDisplay').textContent = 'Time: 45s';
    createMockElement('timeBar').style.width = '100%';
    createMockElement('timeBar').style.backgroundColor = '#053b12';
    createMockElement('gameMessage').textContent = '';
    createMockElement('gameMessage').classList._classes.clear(); // Clear classList
    createMockElement('gameMessage').style.opacity = '0';
    createMockElement('gameMessage').style.animation = '';
    createMockElement('gameOverModal').style.display = 'none';
    createMockElement('finalScoreText').textContent = '';
    createMockElement('customStartModal').style.display = 'flex'; // Start modal visible by default
    createMockElement('creditModal').style.display = 'none';
    createMockElement('exitButton').style.display = 'none';
    
    // Clear event listeners on buttons so re-calling setup doesn't add duplicates
    for (const id in mockedDomElements) {
        mockedDomElements[id]._eventListeners = {};
    }

    // Call setup() from sketch.js to re-attach event listeners to our mocks
    // and initialize the game state as it would in the browser.
    // Ensure setup() is defined globally by sketch.js
    if (typeof global.setup === 'function') {
        global.setup();
    } else {
        console.error("Error: global.setup() function not found. Did sketch.js load correctly?");
    }
}


function test_startGame_button() {
    console.log("\n--- Running test_startGame_button ---");
    resetGameState(); // Reset state before test

    const startModal = global.document.getElementById('customStartModal');
    const startButton = global.document.getElementById('startButton');

    assert(startModal.style.display === 'flex', "Start modal should be visible initially.");
    assert(global.gameStarted === false, "Game should not be started initially.");

    // Simulate click
    startButton.click();

    assert(startModal.style.display === 'none', "Start modal should be hidden after clicking Start Game.");
    assert(global.gameStarted === true, "Game should be started after clicking Start Game.");
    assert(global.score === 0, "Score should be reset to 0 at game start.");
    assert(global.timeLeft === 45, "Time should be reset to 45 at game start.");
    assert(global.difficulty === 'easy', "Difficulty should be reset to 'easy' at game start.");
    assert(global.shownDifficultyMessage === false, "Difficulty message flag should be reset.");
    assert(createMockElement('exitButton').style.display === 'block', "Exit button should be visible after start.");
}


function test_credit_button_and_back() {
    console.log("\n--- Running test_credit_button_and_back ---");
    resetGameState(); // Reset state before test

    const creditButton = global.document.getElementById('creditButton');
    const creditModal = global.document.getElementById('creditModal');
    const startModal = global.document.getElementById('customStartModal');
    const closeCreditModal = global.document.getElementById('closeCreditModal');
    const backToHomeButton = global.document.getElementById('backToHomeButton');

    assert(creditModal.style.display === 'none', "Credit modal should be hidden initially.");
    assert(startModal.style.display === 'flex', "Start modal should be visible initially for credit test.");

    // Test showing credit modal
    creditButton.click();
    assert(creditModal.style.display === 'flex', "Credit modal should be visible after clicking Credit button.");
    assert(startModal.style.display === 'flex', "Start modal should remain visible when credit modal is shown.");
    assert(global.gameStarted === false, "Game should not start when clicking Credit button.");

    // Test closing credit modal
    closeCreditModal.click();
    assert(creditModal.style.display === 'none', "Credit modal should be hidden after clicking close button.");
    assert(startModal.style.display === 'flex', "Start modal should remain visible after closing credit modal.");

    // Test Back to Home from credit modal
    creditButton.click(); // Re-open credit modal
    assert(creditModal.style.display === 'flex', "Credit modal re-opened for Back to Home test.");
    backToHomeButton.click();
    assert(creditModal.style.display === 'none', "Credit modal should be hidden after clicking Back to Home.");
    assert(startModal.style.display === 'flex', "Start modal should be visible after clicking Back to Home.");
}


function test_gameOver_flow() {
    console.log("\n--- Running test_gameOver_flow ---");
    resetGameState();

    const gameOverModal = global.document.getElementById('gameOverModal');
    const finalScoreText = global.document.getElementById('finalScoreText');
    const restartButton = global.document.getElementById('restartButton');
    const backToHomeFromGameOver = global.document.getElementById('backToHomeFromGameOver');

    global.score = 75; // Set a mock score
    global.gameStarted = true; // Simulate game in progress
    
    // Manually call endGame (which would happen naturally in game logic)
    global.endGame();

    assert(global.gameOver === true, "Game should be marked as over.");
    assert(global.gameStarted === false, "Game should be marked as not started.");
    assert(gameOverModal.style.display === 'flex', "Game Over modal should be visible.");
    assert(finalScoreText.textContent === 'Your score: 75', "Final score text should be updated.");
    assert(createMockElement('exitButton').style.display === 'none', "Exit button should be hidden after game over.");

    // Test Restart button
    restartButton.click();
    assert(gameOverModal.style.display === 'none', "Game Over modal should be hidden after clicking Restart.");
    assert(global.gameStarted === true, "Game should restart after clicking Restart.");

    // Test Back to Home from Game Over
    global.endGame(); // Simulate another game over to get modal back
    assert(gameOverModal.style.display === 'flex', "Game Over modal re-opened for Back to Home test.");
    backToHomeFromGameOver.click();
    assert(gameOverModal.style.display === 'none', "Game Over modal should be hidden after clicking Back to Home.");
    assert(global.document.getElementById('customStartModal').style.display === 'flex', "Start modal should be visible after Back to Home.");
    assert(global.gameStarted === false, "Game should not be started after Back to Home.");
}

// --- Run All Tests ---
try {
    test_startGame_button();
    test_credit_button_and_back();
    test_gameOver_flow();
    // Add calls to other test functions here as you write them
    console.log("\n🥳 All tests passed! 🥳");
} catch (e) {
    console.error(`\nTest Suite Failed: ${e.message}`);
    process.exit(1); // Exit with a non-zero code to indicate failure in CI/CD
}