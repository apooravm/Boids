let flock = [];
let boidLines = [];
let alignSlider, cohesionSlider, separationSlider;
let speedSlider;

let boidSlider;
let numBoids = 100;
let qtree;
let boundary;

let cols = [[0,255,0], //green
            [0,255,255], //cyan
            [255,105,180], //hot pink
            [255,165,0], //orange
            [255, 0, 0]] //red

let colIndex = 0;

let button;
let bgVal;

let colourButton;

let greenLineMode = false;

let prevBoids = -1;
let currBoids;

let spawnCheck;
let QtreeCheck;
let greenLineCheck;
let QuadtreeSectionCheck;

function changeBG() {
  if (greenLineCheck.checked()) {
    bgVal = 0;
    greenLineMode = true;
    // switchCounter++;
  } else {
    bgVal = 40;
    greenLineMode = false;
    // switchCounter++;
  }
}

function changeLineColour() {
  colIndex++;
  if (colIndex > 4) {
    colIndex = 0;
  }
}

function createBoids(maxBoids) {
  for (let i = 0; i < maxBoids; i++) {
    flock.push(new Boid());
  }
  // flock.push(new Boid())
}
function setup() {
  createCanvas(windowWidth-5, windowHeight-5);
  // createCanvas(1000, 700);
  alignSlider = createSlider(0, 5, 2, 0.2);
  cohesionSlider = createSlider(0, 5, 2, 0.2);
  separationSlider = createSlider(0, 5, 2, 0.2);

  speedSlider = createSlider(0, 15, 3, 0.5);

  boidSlider = createSlider(0, 1000, 2, 2);

  colourButton = createButton('line colour');

  // button = createButton('Switch');
  greenLineCheck = createCheckbox('cool lines', false);

  QtreeCheck = createCheckbox('Qtree', true);

  spawnCheck = createCheckbox('Center Spawn', false);

  QuadtreeSectionCheck = createCheckbox('Show Qtree', false);

  bgVal = 40;

  boundary = new Rectangle(width/2, height/2, width/2, height/2);

  numBoids = boidSlider.value();
}

function draw() {
  changeBG();
  colourButton.mousePressed(changeLineColour);
  background(bgVal);

  // boidSlider.
  numBoids = boidSlider.value();

  if (numBoids != prevBoids) {
    if (numBoids < prevBoids) {
      for (let i = 0; i < prevBoids-numBoids; i++) {
        flock.pop();
      }
      prevBoids = numBoids;
    }
    else
    {
      numBoids = boidSlider.value();
      // flock = [];
      createBoids(numBoids-prevBoids);
      prevBoids = numBoids;
    }
  }

  if (QtreeCheck.checked()) {
    qtree = new QuadTree(boundary, 2);
    for (let boid of flock) {
      qtree.insert(boid);
    }
    
    for (let boid of flock) {
      let range = new Rectangle(boid.x, boid.y, 100, 100);
      // rect(boid.x, boid.y, 20, 20);
      let boidsArray = qtree.query(range);
      boid.flock(boidsArray);
      boid.wrapEdges();
    }
    for (let boid of flock) {
      boid.update();
      // boid.show();
      if (!greenLineMode) {
        // this.greenLineMode = true;
        boid.show();
      }
    }
    if (QuadtreeSectionCheck.checked()) {
      qtree.show();
    }
  }
  else
  {
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
}
