// test_sketch.js
// COMPLETE FILE - Copy and paste this entire content into your test_sketch.js

// --- Basic Assertion Function (from your professor's parser.js) ---
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ Test Failed: ${message}`);
        throw new Error(message); // Fail loudly
    } else {
        console.log(`✅ Test Passed: ${message}`);
    }
}

// --- Global Mocks for p5.js Functions and Variables ---
// These are crucial for running p5.js code in a Node.js environment.
// Every p5.js global function and variable that sketch.js uses needs a dummy mock.

// We need a specific mock for p5 that captures the setup/draw functions
// when sketch.js is loaded, as p5 normally calls them itself.
let _p5InstanceSketch; // This will hold the actual sketch function passed to new p5()
let _p5GlobalSetupCalled = false; // To track if the global setup was triggered

global.p5 = function(sketch) {
    _p5InstanceSketch = sketch; // Capture the sketch function
    // In global mode, p5 doesn't explicitly pass setup/draw/preload to a sketch function
    // Instead, it looks for them in the global scope. We will mock that behavior below.
};

global.preload = function() {}; // Mock preload, can add behavior if needed
global.draw = function() {};    // Mock draw, can add behavior if needed

// Mock loadImage and loadSound to return simple objects without actual loading
global.loadImage = (path) => ({ width: 100, height: 100 });
global.loadSound = (path) => ({ play: () => {}, isLoaded: () => true });

// Core p5.js drawing/setup functions - these will just be empty mocks
global.createCanvas = (w, h) => { /* console.log(`Mock: createCanvas(${w}, ${h})`); */ };
global.windowWidth = 800; // Provide dummy dimensions for consistent testing
global.windowHeight = 600;
global.noCursor = () => { /* console.log("Mock: noCursor()"); */ };
global.background = (r, g, b) => { /* console.log(`Mock: background(${r}, ${g}, ${b})`); */ };
global.stroke = (c) => { /* console.log(`Mock: stroke(${c})`); */ };
global.strokeWeight = (w) => { /* console.log(`Mock: strokeWeight(${w})`); */ };
global.fill = (c) => { /* console.log(`Mock: fill(${c})`); */ };
global.ellipse = (x, y, w, h) => { /* console.log(`Mock: ellipse(${x}, ${y}, ${w}, ${h})`); */ };
global.line = (x1, y1, x2, y2) => { /* console.log(`Mock: line(${x1}, ${y1}, ${x2}, ${y2})`); */ };
global.sin = Math.sin;
global.frameCount = 0;
global.min = Math.min;
global.width = global.windowWidth; // p5.js global width
global.height = global.windowHeight; // p5.js global height
global.imageMode = (mode) => { /* console.log(`Mock: imageMode(${mode})`); */ };
global.CENTER = 'center'; // p5.js constant (mocked as string for simplicity)
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

const mockedDomElements = {}; // Map to hold our mocked DOM elements by ID

function createMockElement(id, initialContent = '') {
    if (mockedDomElements[id]) return mockedDomElements[id];

    const element = {
        id: id,
        textContent: initialContent,
        style: { display: '', width: '', backgroundColor: '', opacity: '', animation: '' },
        classList: {
            _classes: new Set(),
            add: function(cls) { this._classes.add(cls); },
            remove: function(cls) { this._classes.delete(cls); },
            contains: function(cls) { return this._classes.has(cls); }
        },
        _eventListeners: {},
        addEventListener: function(type, listener) {
            if (!this._eventListeners[type]) this._eventListeners[type] = [];
            this._eventListeners[type].push(listener);
        },
        click: function() {
            if (this._eventListeners['click']) {
                this._eventListeners['click'].forEach(listener => listener({ target: this }));
            }
        },
        offsetWidth: 0
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
            default: return null;
        }
    },
    body: { appendChild: () => {}, style: {} },
    addEventListener: (type, listener) => {},
    removeEventListener: (type, listener) => {}
};

global.window = {
    addEventListener: (type, listener) => {},
    removeEventListener: (type, listener) => {},
};


// --- 4. Define Global Game State Variables ---
// These are the actual global variables from your sketch.js.
// We declare them here so we can reliably reset them in tests.
global.holes = [];
global.currentHoles = [];
global.score = 0;
global.moleVisible = false;
global.moleTimer = null; // Initialize to null
global.hammerImg = null; // Initialize to null, will be "loaded" by mockLoadImage
global.hammerAngle = 45;
global.hammerSwinging = false;
global.timeLeft = 45;
global.gameStarted = false;
global.gameOver = false;
global.timerInterval = null; // Initialize to null
global.difficulty = 'easy';
global.shownDifficultyMessage = false;

// --- 5. Import / Load your actual sketch.js ---
// This line executes your sketch.js file. As it runs, it will define
// its global functions (setup, draw, updateScoreDisplay, etc.)
// and populate the global variables in THIS test environment's global scope.
// It must come *after* all your mocks are defined.
require('./sketch.js');

// --- 6. Define Your Test Functions (now as global functions) ---

// Helper to reset the game state for each test
global.resetGameState = function() {
    // Reset global game state variables to a known initial state
    global.score = 0;
    global.timeLeft = 45;
    global.difficulty = 'easy';
    global.shownDifficultyMessage = false;
    global.gameStarted = false;
    global.gameOver = false;
    global.currentHoles = [];
    global.moleVisible = false;

    // Reset mocked DOM elements for a clean state before each test
    createMockElement('scoreDisplay').textContent = 'Score: 0';
    createMockElement('timerDisplay').textContent = 'Time: 45s';
    createMockElement('timeBar').style.width = '100%';
    createMockElement('timeBar').style.backgroundColor = '#053b12';
    createMockElement('gameMessage').textContent = '';
    createMockElement('gameMessage').classList._classes.clear();
    createMockElement('gameMessage').style.opacity = '0';
    createMockElement('gameMessage').style.animation = '';
    createMockElement('gameOverModal').style.display = 'none';
    createMockElement('finalScoreText').textContent = '';
    createMockElement('customStartModal').style.display = 'flex'; // Start modal visible by default
    createMockElement('creditModal').style.display = 'none';
    createMockElement('exitButton').style.display = 'none';
    
    // Clear event listeners on mocked elements so re-calling setup doesn't add duplicates
    for (const id in mockedDomElements) {
        mockedDomElements[id]._eventListeners = {}; // Reset listeners for each element
    }

    // Explicitly call the `preload` and `setup` functions from `sketch.js`
    // as p5.js normally does in a browser.
    if (typeof global.preload === 'function') {
        global.preload(); // Call the preload function if it exists
    }
    if (typeof global.setup === 'function') {
        global.setup(); // This is the critical call!
    } else {
        // This 'else' block indicates a serious problem if it's still reached.
        console.error("Error: global.setup() function is STILL not found after loading sketch.js!");
        throw new Error("Setup function not found for testing."); // Explicitly fail the test
    }
};


// Define your individual test functions as global properties
global.test_startGame_button = function() {
    console.log("\n--- Running test_startGame_button ---");
    global.resetGameState(); // Reset state before test

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
};


global.test_credit_button_and_back = function() {
    console.log("\n--- Running test_credit_button_and_back ---");
    global.resetGameState(); // Reset state before test

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
};


global.test_gameOver_flow = function() {
    console.log("\n--- Running test_gameOver_flow ---");
    global.resetGameState();

    const gameOverModal = global.document.getElementById('gameOverModal');
    const finalScoreText = global.document.getElementById('finalScoreText');
    const restartButton = global.document.getElementById('restartButton');
    const backToHomeFromGameOver = global.document.getElementById('backToHomeFromGameOver');

    global.score = 75; // Set a mock score for the test
    global.gameStarted = true; // Simulate game in progress
    
    // Manually call endGame (which would happen naturally in game logic)
    global.endGame(); // Call the actual endGame function from sketch.js

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
    global.endGame(); // Simulate another game over to get modal back on screen
    assert(gameOverModal.style.display === 'flex', "Game Over modal re-opened for Back to Home test.");
    backToHomeFromGameOver.click();
    assert(gameOverModal.style.display === 'none', "Game Over modal should be hidden after clicking Back to Home.");
    assert(global.document.getElementById('customStartModal').style.display === 'flex', "Start modal should be visible after Back to Home.");
    assert(global.gameStarted === false, "Game should not be started after Back to Home.");
};


// --- Run All Tests ---
try {
    global.test_startGame_button();
    global.test_credit_button_and_back();
    global.test_gameOver_flow();
    // Add calls to any other global.test_YOURFUNCTION() here
    console.log("\n🥳 All tests passed! 🥳");
} catch (e) {
    console.error(`\nTest Suite Failed: ${e.message}`);
    process.exit(1); // Exit with a non-zero code to indicate failure in CI/CD
}