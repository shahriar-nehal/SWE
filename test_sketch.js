// test_sketch.js

// ... (All your assert, p5.js mocks, DOM mocks, and global variable declarations remain the same) ...

// --- 6. Define Your Test Functions (Make them global) ---

// Replace this:
// function test_startGame_button() { ... }
// With this:
global.test_startGame_button = function() {
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
};


// Repeat this for ALL your test functions:
global.test_credit_button_and_back = function() {
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
};


global.test_gameOver_flow = function() {
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
};

// ... (Your try/catch block remains the same, calling these global functions) ...
try {
    global.test_startGame_button(); // Call them with global.
    global.test_credit_button_and_back();
    global.test_gameOver_flow();
    console.log("\n🥳 All tests passed! 🥳");
} catch (e) {
    console.error(`\nTest Suite Failed: ${e.message}`);
    process.exit(1);
}