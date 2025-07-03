let holes = [];
let currentHole = -1;
let moleVisible = false;
let score = 0;
let moleTimer;
let hammerImg;
let hammerAngle = 19.6;
let hammerSwinging = false;

let timeLeft = 30;
let gameStarted = false;
let gameOver = false;
let timerInterval;

let hitSound, missSound, timeoutSound;

// Mole type constants
const NORMAL_MOLE = 0;
const BONUS_MOLE = 1;
const THIEF_MOLE = 2;
const BOMB_MOLE = 3;
let currentMoleType = NORMAL_MOLE;

function preload() {
  hammerImg = loadImage('images/hammer2.png');
  hitSound = loadSound('sounds/hit.mp3');
  missSound = loadSound('sounds/hit.mp3');
  timeoutSound = loadSound('sounds/game-over.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);

  noCursor();
  createHoles();

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    document.getElementById('customStartModal').style.display = 'none';
    startGame();
  });
  document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('gameOverModal').style.display = 'none';
    startGame();
  });

  // Show modal at beginning
  document.getElementById('customStartModal').style.display = 'flex';

  updateScoreDisplay();
  updateTimerDisplay();
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  gameOver = false;
  score = 0;
  timeLeft = 30;
  currentMoleType = NORMAL_MOLE;

  updateScoreDisplay();
  updateTimerDisplay();
  updateTimeBar();

  moveMole();
  moleTimer = setInterval(moveMole, 2000);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    updateTimeBar();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(moleTimer);
  clearInterval(timerInterval);
  moleVisible = false;
  gameOver = true;
  gameStarted = false;
  updateTimerDisplay();
  updateTimeBar();

  if (timeoutSound && timeoutSound.isLoaded()) {
    timeoutSound.play();
  }

  // Show Game Over Modal
  document.getElementById('finalScoreText').textContent = `Your score: ${score}`;
  document.getElementById('gameOverModal').style.display = 'flex';
}

function updateScoreDisplay() {
  document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
}

function updateTimerDisplay() {
  document.getElementById('timerDisplay').textContent = 'Time: ' + timeLeft + 's';
}

function draw() {
  drawGrassBackground();
  drawHoles();
  if (moleVisible) drawMole();

  if (hammerSwinging) {
    let restAngle = 19.6;
    hammerAngle += (restAngle - hammerAngle) * 0.95; // faster return

    if (abs(hammerAngle - restAngle) < 0.5) {
      hammerAngle = restAngle;
      hammerSwinging = false;
    }
  }

  push();
  translate(mouseX, mouseY);
  rotate(hammerAngle);
  imageMode(CENTER);
  let hammerScale = min(width, height) / 1000;
  image(hammerImg, 0, 0, hammerImg.width * hammerScale, hammerImg.height * hammerScale);
  pop();
}

function drawGrassBackground() {
  background(120, 160, 90);
  stroke(30, 100, 40);
  strokeWeight(2);
  for (let i = 0; i < width; i += 8) {
    let y1 = height;
    let sway = sin(frameCount * 0.02 + i * 0.1) * 3;
    let baseHeight = 40;
    let heightVariation = sin(i * 0.1) * 4;
    let y2 = height - baseHeight + heightVariation + sin(frameCount * 0.01 + i * 0.05) * 2;
    line(i, y1, i + sway, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createHoles();
}

function createHoles() {
  holes = [];
  let rows = 2;
  let cols = 3;
  let gapX = width / (cols + 1);
  let gapY = height / (rows + 1);

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      holes.push({ x: col * gapX, y: row * gapY });
    }
  }
}

function drawHoles() {
  for (let hole of holes) {
    let w = width / 6;
    let h = height / 9;

    noStroke();
    fill(50, 35, 25);
    ellipse(hole.x, hole.y, w, h);

    for (let i = 0; i < 5; i++) {
      fill(20, 10, 5, 100 - i * 15);
      ellipse(hole.x, hole.y + h * 0.08 + i * 2, w * (0.65 - i * 0.05), h * (0.4 - i * 0.04));
    }

    fill(100, 70, 50);
    ellipse(hole.x + w * 0.4, hole.y + h * 0.3, w * 0.1, h * 0.07);
    ellipse(hole.x - w * 0.35, hole.y - h * 0.2, w * 0.07, h * 0.04);
  }
}

function drawMole() {
  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let bodyY = hole.y - moleSize / 4;

  // Set colors based on mole type
  let bodyColor, outlineColor, earColor;
  
  switch(currentMoleType) {
    case BONUS_MOLE:
      bodyColor = color(50, 200, 50); // Green
      outlineColor = color(255); // White
      earColor = color(50, 220, 50);
      break;
    case THIEF_MOLE:
      bodyColor = color(60); // Dark gray
      outlineColor = color(255); // White
      earColor = color(80);
      break;
    case BOMB_MOLE:
      bodyColor = color(60); // Dark gray
      outlineColor = color(255, 215, 0); // Gold
      earColor = color(80);
      break;
    default: // NORMAL_MOLE
      bodyColor = color(139, 69, 19);
      outlineColor = color(90, 40, 10);
      earColor = color(139, 69, 19);
  }

  // Draw body with outline
  stroke(outlineColor);
  strokeWeight(2);
  fill(bodyColor);
  ellipse(hole.x, bodyY, moleSize, moleSize);

  let earSize = moleSize / 4;
  let earY = hole.y - moleSize / 4 - moleSize / 2.8;
  let earOffsetX = moleSize / 2.1;

  // Draw ears
  stroke(outlineColor);
  strokeWeight(1.5);
  fill(earColor);
  ellipse(hole.x - earOffsetX, earY, earSize, earSize);
  ellipse(hole.x + earOffsetX, earY, earSize, earSize);

  // Draw inner ears (same for all types)
  noStroke();
  fill(205, 133, 63);
  let innerEarSize = earSize / 3;
  ellipse(hole.x - earOffsetX, earY, innerEarSize, innerEarSize);
  ellipse(hole.x + earOffsetX, earY, innerEarSize, innerEarSize);

  // Draw nose (same for all types)
  fill(205, 133, 63);
  ellipse(hole.x, bodyY + moleSize / 6, moleSize / 3.5, moleSize / 5);

  // Draw nose tip (same for all types)
  fill(255, 182, 193);
  ellipse(hole.x, bodyY + moleSize / 6, moleSize / 12, moleSize / 12);

  // Draw eyes (same for all types)
  fill(0);
  ellipse(hole.x - moleSize / 5, bodyY - moleSize / 8, moleSize / 10, moleSize / 10);
  ellipse(hole.x + moleSize / 5, bodyY - moleSize / 8, moleSize / 10, moleSize / 10);

  // Draw mouth (same for all types)
  fill(210, 180, 140);
  let mouthY = bodyY + moleSize / 4;
  ellipse(hole.x, mouthY, moleSize / 2.8, moleSize / 8);

  // Draw teeth (same for all types)
  fill(255);
  let toothWidth = moleSize / 28;
  let toothHeight = moleSize / 28;
  let toothGap = toothWidth * 1.2;
  rect(hole.x - toothGap, mouthY + moleSize / 16, toothWidth, toothHeight, 2);
  rect(hole.x + toothGap - toothWidth, mouthY + moleSize / 16, toothWidth, toothHeight, 2);
  
  // Add special indicators for special moles
  if (currentMoleType !== NORMAL_MOLE) {
    textSize(moleSize / 5);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(1);
    
    if (currentMoleType === BONUS_MOLE) {
      fill(255);
      text("+3", hole.x, bodyY - moleSize/3);
    } else if (currentMoleType === THIEF_MOLE) {
      fill(255);
      text("-2", hole.x, bodyY - moleSize/3);
    } else if (currentMoleType === BOMB_MOLE) {
      fill(255, 215, 0);
      text("💣", hole.x, bodyY - moleSize/3);
    }
  }
}

function moveMole() {
  currentHole = floor(random(holes.length));
  moleVisible = true;
  
  // Randomly determine mole type (70% normal, 15% bonus, 10% thief, 5% bomb)
  let moleTypeRoll = random(1);
  if (moleTypeRoll < 0.7) {
    currentMoleType = NORMAL_MOLE;
  } else if (moleTypeRoll < 0.85) {
    currentMoleType = BONUS_MOLE;
  } else if (moleTypeRoll < 0.95) {
    currentMoleType = THIEF_MOLE;
  } else {
    currentMoleType = BOMB_MOLE;
  }
}

function mousePressed() {
  if (!moleVisible || !gameStarted || gameOver) return;

  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let hitRadius = moleSize * 1.25;
  let d = dist(mouseX, mouseY, hole.x, hole.y - moleSize / 4);

  if (d < hitRadius) {
    hammerAngle = PI / 3;
    hammerSwinging = true;
    
    // Handle different mole types
    switch(currentMoleType) {
      case NORMAL_MOLE:
        score++;
        hitSound.play();
        //showGameMessage("+1", 'success', 1000);
        break;
      case BONUS_MOLE:
        score += 3;
        hitSound.play();
        showGameMessage("+3 BONUS!", 'success', 1000);
        break;
      case THIEF_MOLE:
        score = max(0, score - 2); // Prevent negative score
        missSound.play();
        showGameMessage("2 POINTS STOLEN!", 'danger', 1000);
        break;
      case BOMB_MOLE:
        missSound.play();
        showGameMessage("BOOM! Game Over", 'danger', 1000);
        endGame();
        return;
    }
    
    moleVisible = false;
    updateScoreDisplay();
  } else {
    missSound.play();
    hammerAngle = PI / 3;
    hammerSwinging = true;
  }
}

function updateTimeBar() {
  let percentage = (timeLeft / 30) * 100;
  const bar = document.getElementById('timeBar');
  bar.style.width = percentage + '%';

  if (percentage > 60) {
    bar.style.backgroundColor = '#053b12';
  } else if (percentage > 30) {
    bar.style.backgroundColor = '#ffc107';
  } else {
    bar.style.backgroundColor = '#dc3545';
  }
}

function showGameMessage(message, alertClass = '', duration = 1000) {
  const messageDiv = document.getElementById('gameMessage');
  messageDiv.textContent = message;
  messageDiv.className = 'game-message'; // Reset classes
  if (alertClass) {
    messageDiv.classList.add(alertClass);
  }
  messageDiv.style.opacity = '1';
  messageDiv.style.animation = 'none';
  void messageDiv.offsetWidth; // Trigger reflow
  messageDiv.style.animation = 'fadeInOut 1s ease-in-out';

  if (duration > 0) {
    setTimeout(() => {
      messageDiv.style.opacity = '0';
    }, duration);
  }
}