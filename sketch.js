let holes = [];
let currentHole = -1;
let moleVisible = true;
let score = 0;
let moleTimer;
let hammerImg;
let hammerAngle = 0;
let hammerSwinging = false;

function preload() {
  hammerImg = loadImage('images/hammer2.png'); // Load hammer PNG
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  createHoles();

  moveMole();
  moleTimer = setInterval(moveMole, 1000);
}



function draw() {
  background(180, 220, 150);
  drawHoles();
  if (moleVisible) drawMole();
  displayScore();

  // Update hammer swing
  if (hammerSwinging) {
    hammerAngle *= 0.85; // gradually reduce the angle
    if (abs(hammerAngle) < 0.01) {
      hammerAngle = 0;
      hammerSwinging = false;
    }
  }

  // Draw hammer at mouse position, rotated by hammerAngle
  push();
  translate(mouseX, mouseY);
  rotate(hammerAngle);
  imageMode(CENTER);
  let hammerScale = min(width, height) / 1000; // scale to appropriate size
  image(hammerImg, 0, 0, hammerImg.width * hammerScale, hammerImg.height * hammerScale);
  pop();
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
  for (let hole of holes) {
    let w = width / 8;
    let h = height / 12;

    // Outer dirt ring
    noStroke();
    fill(121, 85, 72);
    ellipse(hole.x, hole.y, w * 1.2, h * 1.2);

    // Main hole
    fill(77, 51, 36);
    ellipse(hole.x, hole.y, w, h);

    // Multiple layers of inner shadow for gradient depth
    for (let i = 0; i < 5; i++) {
      fill(55, 34, 24, 50 - i * 8);
      ellipse(hole.x, hole.y + h * 0.08 + i * 2, w * (0.65 - i * 0.05), h * (0.4 - i * 0.04));
    }

    // Pebbles or dirt chunks around
    fill(100, 70, 50);
    ellipse(hole.x + w * 0.4, hole.y + h * 0.3, w * 0.08, h * 0.05);
    ellipse(hole.x - w * 0.35, hole.y - h * 0.2, w * 0.05, h * 0.03);
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

  //  Ears
let earSize = moleSize / 4;
let earY = hole.y - moleSize / 4 - moleSize / 2.8;
let earOffsetX = moleSize / 2.1;

// Outer ears (with stroke)
stroke(90, 40, 10); // dark outline
strokeWeight(1.5);
fill(139, 69, 19);
ellipse(hole.x - earOffsetX, earY, earSize, earSize); // left ear
ellipse(hole.x + earOffsetX, earY, earSize, earSize); // right ear

// Inner ears (no stroke)
noStroke();
fill(205, 133, 63);
let innerEarSize = earSize / 3;
ellipse(hole.x - earOffsetX, earY, innerEarSize, innerEarSize); // left inner
ellipse(hole.x + earOffsetX, earY, innerEarSize, innerEarSize); // right inner



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
  let toothWidth = moleSize / 28;
  let toothHeight = moleSize / 24;
  let toothGap = toothWidth * 1.2;

  rect(hole.x - toothGap, mouthY + moleSize / 16, toothWidth, toothHeight, 2);
  rect(hole.x + toothGap - toothWidth, mouthY + moleSize / 16, toothWidth, toothHeight, 2);

  
}


function mousePressed() {
  if (!moleVisible) return;

  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let hitRadius = moleSize / 2 * 2.5;
  let d = dist(mouseX, mouseY, hole.x, hole.y - moleSize / 4);
  if (d < hitRadius) {
    score++;
    moleVisible = false;
    hammerAngle = PI / 6; // start swing at 30 degrees
    hammerSwinging = true;
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
