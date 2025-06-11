let holes = [];
let currentHole = -1;
let moleVisible = true;
let score = 0;
let moleTimer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cursor('images/hammer2.svg', 0, 0);
  createHoles();

  moveMole();
  moleTimer = setInterval(moveMole, 1000);
}

function draw() {
  background(180, 220, 150);
  drawHoles();
  if (moleVisible) drawMole();
  displayScore();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createHoles(); // Recalculate hole positions
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
  fill(60);
  for (let hole of holes) {
    ellipse(hole.x, hole.y, width / 8, height / 12);
  }
}

// function drawMole() {
//   let hole = holes[currentHole];
//   let moleSize = min(width, height) / 9;
  
//   fill(139, 69, 19);
//   ellipse(hole.x, hole.y - moleSize / 4, moleSize, moleSize); // Mole slightly above hole

//   // Eyes
//   fill(0);
//   ellipse(hole.x - moleSize / 5, hole.y - moleSize / 4 - moleSize / 10, moleSize / 8, moleSize / 8);
//   ellipse(hole.x + moleSize / 5, hole.y - moleSize / 4 - moleSize / 10, moleSize / 8, moleSize / 8);

//   // Mouth
//   ellipse(hole.x, hole.y - moleSize / 4 + moleSize / 8, moleSize / 4, moleSize / 10);
// }

function drawMole() {
  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let bodyY = hole.y - moleSize / 4;

  // Body (head)
   stroke(90, 40, 10); // dark outline
  strokeWeight(2);
  fill(139, 69, 19); // Dark brown
  ellipse(hole.x, bodyY, moleSize, moleSize);

  // All other features – no outline
  noStroke();

  // Nose (snout)
  fill(205, 133, 63); // Lighter brown for nose
  ellipse(hole.x, bodyY + moleSize / 6, moleSize / 3.5, moleSize / 5);

  // Nose tip
  fill(255, 182, 193); // Pink
  ellipse(hole.x, bodyY + moleSize / 6, moleSize / 12, moleSize / 12);

  // Eyes
  fill(0);
  ellipse(hole.x - moleSize / 5, bodyY - moleSize / 8, moleSize / 10, moleSize / 10);
  ellipse(hole.x + moleSize / 5, bodyY - moleSize / 8, moleSize / 10, moleSize / 10);



  // Mouth
  fill(210, 180, 140); // Light brown
  let mouthY = bodyY + moleSize / 4;
  ellipse(hole.x, mouthY, moleSize / 2.8, moleSize / 8);

  //two tooth
 fill(255);
  let toothWidth = moleSize / 20;
  let toothHeight = moleSize / 10;
  let toothGap = toothWidth * 1.5;

  rect(hole.x - toothGap, mouthY + moleSize / 16, toothWidth, toothHeight, 2);
  rect(hole.x + toothGap - toothWidth, mouthY + moleSize / 16, toothWidth, toothHeight, 2);

  
}


function mousePressed() {
  if (!moleVisible) return;

  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let d = dist(mouseX, mouseY, hole.x, hole.y - moleSize / 4);
  if (d < moleSize / 2) {
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
  textSize(min(width, height) / 25);
  text('Score: ' + score, 10, min(width, height) / 20 + 10);
}
