const flock = [];
let boidLines = [];
let alignSlider, cohesionSlider, separationSlider;
let speedSlider;

let button;
let bgVal;

let switchCounter = 0;

let greenLineMode = false;

function changeBG() {
  if (switchCounter % 2 == 0) {
    bgVal = 0;
    greenLineMode = true;
    switchCounter++;
  } else {
    bgVal = 40;
    greenLineMode = false;
    switchCounter++;
  }
}

function setup() {
  createCanvas(windowWidth-5, windowHeight-5);
  // createCanvas(1000, 700);
  alignSlider = createSlider(0, 5, 2, 0.2);
  cohesionSlider = createSlider(0, 5, 2, 0.2);
  separationSlider = createSlider(0, 5, 2, 0.2);

  speedSlider = createSlider(0, 15, 3, 0.5);

  button = createButton('Switch');
  // button.mousePressed()

  // button2 = createButton('Off');

  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
  flock.push(new Boid())

  bgVal = 40;
}

function draw() {
  button.mousePressed(changeBG);
  background(bgVal);

  for (let b of flock) {
    b.wrapEdges();
    b.flock(flock);
    // b.update();
    // b.show();
  }

  for (let b of flock) {
    // b.wrapEdges();
    // b.flock(flock);
    b.update()
    if (!greenLineMode) {
      // this.greenLineMode = true;
      b.show();
    }
  }
}

