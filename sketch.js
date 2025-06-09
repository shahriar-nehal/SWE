let holes = [];
let currentHole = -1;
let moleVisible = true;
let score = 0;
let moleTimer;

function setup() {
  createCanvas(600, 400);

  // Define positions for 6 holes
  let startX = width / 4;
  let startY = height / 3;
  let gapX = width / 4;
  let gapY = height / 3;

  holes = [
    { x: startX, y: startY },
    { x: startX + gapX, y: startY },
    { x: startX + 2 * gapX, y: startY },
    { x: startX, y: startY + gapY },
    { x: startX + gapX, y: startY + gapY },
    { x: startX + 2 * gapX, y: startY + gapY },
  ];

  // Start mole timer
  moveMole();
  moleTimer = setInterval(moveMole, 1000);
}

function draw() {
  background(180, 220, 150);
  drawHoles();
  if (moleVisible) drawMole();
  displayScore();
}

function drawHoles() {
  fill(60);
  for (let hole of holes) {
    ellipse(hole.x, hole.y, 90, 40);
  }
}

function drawMole() {
  let hole = holes[currentHole];
  fill(139, 69, 19);
  ellipse(hole.x, hole.y - 15, 70, 70); // Mole pops slightly above hole

  // Eyes
  fill(0);
  ellipse(hole.x - 12, hole.y - 20, 10, 10);
  ellipse(hole.x + 12, hole.y - 20, 10, 10);

  // Mouth
  ellipse(hole.x, hole.y - 5, 20, 8);
}

function mousePressed() {
  if (!moleVisible) return;

  let hole = holes[currentHole];
  let d = dist(mouseX, mouseY, hole.x, hole.y - 15);
  if (d < 35) {
    score++;
    moleVisible = false;
  }
}

function moveMole() {
  currentHole = floor(random(holes.length));
  moleVisible = true;
}

function displayScore() {
  fill(0);
  textSize(20);
  text('Score: ' + score, 10, 25);
}
