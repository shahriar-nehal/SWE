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
// ... (All the p5.js and DOM mocks as provided in the previous answer) ...
// IMPORTANT: Copy ALL the global.xxx = ... mocks here.

// --- 4. Define Global Game State Variables (as they are global in sketch.js) ---
// ... (All the global.holes = ... etc. assignments from previous answer) ...

// --- 5. Import / Load your actual sketch.js ---
// Define a temporary global variable to hold the actual setup function
// This helps ensure we're calling the one defined by sketch.js
let actualSketchSetup;

// Override global.setup temporarily before loading sketch.js to capture it
// This allows us to intercept the function sketch.js assigns to global.setup
// and use it reliably later.
const originalGlobalSetup = global.setup; // Store current mock/undefined setup
global.setup = function() {
    // This function will be called by sketch.js when it initializes.
    // We capture it, so our tests can call it reliably.
    actualSketchSetup = arguments.callee; // Capture the function itself
    if (originalGlobalSetup) originalGlobalSetup.apply(this, arguments); // Call the original mock if it existed
};

require('./sketch.js'); // This line executes sketch.js and assigns its `setup` function to `global.setup`

// After require, `global.setup` now holds the *actual* setup function from sketch.js.
// We can now safely re-assign actualSketchSetup from global.setup if needed,
// but since sketch.js runs and directly sets `global.setup`, we can just use `global.setup` directly.

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
    global.moleVisible = false;

    // Reset mocked DOM elements for a clean state
    // Reset specific mock values:
    createMockElement('scoreDisplay').textContent = 'Score: 0';
    createMockElement('timerDisplay').textContent = 'Time: 45s';
    createMockElement('timeBar').style.width = '100%';
    createMockElement('timeBar').style.backgroundColor = '#053b12';
    createMockElement('gameMessage').textContent = '';
    // Clear classList's internal state directly
    createMockElement('gameMessage').classList._classes.clear();
    createMockElement('gameMessage').style.opacity = '0';
    createMockElement('gameMessage').style.animation = '';
    createMockElement('gameOverModal').style.display = 'none';
    createMockElement('finalScoreText').textContent = '';
    createMockElement('customStartModal').style.display = 'flex';
    createMockElement('creditModal').style.display = 'none';
    createMockElement('exitButton').style.display = 'none';

    // Clear event listeners on mocked elements for a clean slate
    for (const id in mockedDomElements) {
        mockedDomElements[id]._eventListeners = {}; // Reset listeners for each element
    }
    
    // Call the actual setup() function from sketch.js here.
    // It should now be defined correctly in the global scope after `require('./sketch.js')`.
    if (typeof global.setup === 'function') {
        global.setup(); // This is the call that was failing
    } else {
        // This 'else' block should ideally not be reached after the fix.
        console.error("Error: global.setup() function is still not found after loading sketch.js!");
        throw new Error("Setup function not found for testing."); // Fail the test explicitly
    }
}


// --- Test Functions (test_startGame_button, test_credit_button_and_back, test_gameOver_flow) ---
// ... (Keep these functions exactly as they were in the previous answer) ...


// --- Run All Tests ---
try {
    test_startGame_button();
    test_credit_button_and_back();
    test_gameOver_flow();
    console.log("\n🥳 All tests passed! 🥳");
} catch (e) {
    console.error(`\nTest Suite Failed: ${e.message}`);
    process.exit(1); // Exit with a non-zero code to indicate failure in CI/CD
}