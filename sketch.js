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

  stroke(90, 40, 10);
  strokeWeight(2);
  fill(139, 69, 19);
  ellipse(hole.x, bodyY, moleSize, moleSize);

  let earSize = moleSize / 4;
  let earY = hole.y - moleSize / 4 - moleSize / 2.8;
  let earOffsetX = moleSize / 2.1;

  stroke(90, 40, 10);
  strokeWeight(1.5);
  fill(139, 69, 19);
  ellipse(hole.x - earOffsetX, earY, earSize, earSize);
  ellipse(hole.x + earOffsetX, earY, earSize, earSize);

  noStroke();
  fill(205, 133, 63);
  let innerEarSize = earSize / 3;
  ellipse(hole.x - earOffsetX, earY, innerEarSize, innerEarSize);
  ellipse(hole.x + earOffsetX, earY, innerEarSize, innerEarSize);

  fill(205, 133, 63);
  ellipse(hole.x, bodyY + moleSize / 6, moleSize / 3.5, moleSize / 5);

  fill(255, 182, 193);
  ellipse(hole.x, bodyY + moleSize / 6, moleSize / 12, moleSize / 12);

  fill(0);
  ellipse(hole.x - moleSize / 5, bodyY - moleSize / 8, moleSize / 10, moleSize / 10);
  ellipse(hole.x + moleSize / 5, bodyY - moleSize / 8, moleSize / 10, moleSize / 10);

  fill(210, 180, 140);
  let mouthY = bodyY + moleSize / 4;
  ellipse(hole.x, mouthY, moleSize / 2.8, moleSize / 8);

  fill(255);
  let toothWidth = moleSize / 28;
  let toothHeight = moleSize / 28;
  let toothGap = toothWidth * 1.2;
  rect(hole.x - toothGap, mouthY + moleSize / 16, toothWidth, toothHeight, 2);
  rect(hole.x + toothGap - toothWidth, mouthY + moleSize / 16, toothWidth, toothHeight, 2);
}

function mousePressed() {
  if (!moleVisible || !gameStarted || gameOver) return;

  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let hitRadius = moleSize * 1.25;
  let d = dist(mouseX, mouseY, hole.x, hole.y - moleSize / 4);

  if (d < hitRadius) {
    score++;
    moleVisible = false;
    hammerAngle = PI / 3;
    hammerSwinging = true;
    hitSound.play();
    updateScoreDisplay();
  } else {
    missSound.play();
    hammerAngle = PI / 3;
    hammerSwinging = true;
  }
}

function moveMole() {
  currentHole = floor(random(holes.length));
  moleVisible = true;
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

function showGameMessage(message, alertClass = '', duration = 5000) {
  const messageDiv = document.getElementById('gameMessage');
  messageDiv.textContent = message;
  messageDiv.classList.remove('d-none');

  if (duration > 0) {
    setTimeout(() => {
      messageDiv.classList.add('d-none');
    }, duration);
  }
}