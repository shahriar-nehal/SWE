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
  drawGrassBackground();
  drawHoles();
  if (moleVisible) drawMole();
  displayScore();

  function drawGrassBackground() {
  // background(107, 142, 35); // A flat olive green for grass

  // Optional: subtle, gently swaying grass strands
  background(120, 160, 90);


  // Draw longer grass blades
 stroke(30, 100, 40);
strokeWeight(2);
for (let i = 0; i < width; i += 8) {
  let y1 = height;
  let sway = sin(frameCount * 0.02 + i * 0.1) * 3; // faster sway
  let baseHeight = 40; // base grass height
  let heightVariation = sin(i * 0.1) * 4; // subtle, fixed variation
  let y2 = height - baseHeight + heightVariation + sin(frameCount * 0.01 + i * 0.05) * 2; // faster wave
  line(i, y1, i + sway, y2);
}

}



  // hammer swing
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
    // Increase the size by scaling up the width and height
    let w = width / 6;   // increased from width/8
    let h = height / 9;  // increased from height/12

    noStroke();

    // Main hole with darker color
    fill(50, 35, 25); // darker brown than before (was 77, 51, 36)
    ellipse(hole.x, hole.y, w, h);

    // Multiple layers of inner shadow for gradient depth (you can keep or tweak)
    for (let i = 0; i < 5; i++) {
  fill(20, 10, 5, 100 - i * 15);  // darker and stronger shadow
  ellipse(hole.x, hole.y + h * 0.08 + i * 2, w * (0.65 - i * 0.05), h * (0.4 - i * 0.04));
   }


    // Pebbles or dirt chunks around (adjusted size to fit bigger hole)
    fill(100, 70, 50);
    ellipse(hole.x + w * 0.4, hole.y + h * 0.3, w * 0.1, h * 0.07);
    ellipse(hole.x - w * 0.35, hole.y - h * 0.2, w * 0.07, h * 0.04);
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
  let toothHeight = moleSize / 28;
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
  let fontSize = min(width, height) / 20;
  let padding = 30;
  let boardWidth = 250;
  let boardHeight = fontSize + padding * 1.2;

  // Hanging point
  let hookX = 135;
  let hookY = 20;

  // Rope lines
  stroke(100);
  strokeWeight(3);
  line(hookX, hookY, 30, 40);
  line(hookX, hookY, boardWidth - 30, 40);

  // Wooden board
  push();
  translate(10, 40);
  noStroke();
  fill(139, 69, 19); // Wood brown
  rect(0, 0, boardWidth, boardHeight, 12);

  // Wood grain
  stroke(160, 82, 45);
  strokeWeight(1);

  // Metal nail heads
  noStroke();
  fill(80);
  ellipse(10, 10, 8);
  ellipse(boardWidth - 10, 10, 8);

  // Score text
  fill(255, 255, 210);
  textSize(fontSize);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Score: ' + score, boardWidth / 2, boardHeight / 2);
  pop();
}