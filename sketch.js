const flock = [];
let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(1250, 650);
  alignSlider = createSlider(0, 5, 1, 0.2);
  cohesionSlider = createSlider(0, 5, 1, 0.2);
  separationSlider = createSlider(0, 5, 1, 0.2);

  for (let i = 0; i < 300; i++) {
    flock.push(new Boid());
  }
  flock.push(new Boid())
}

function draw() {
  background(40);

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
    b.show();
  }
}

