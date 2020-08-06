let FISH_IMAGE;
var ALL_FISH = []; // array of all the fish objects
const FISH_DIMENSIONS = [35, 20];
let WIDTH = 0;
let HEIGHT = 0;
let utils = new Utils();
let FOV = Math.PI; // range: [0, 2pi]
let fps = 10;
let VIEWING_DIST = 600;
let SEPARATION_FACTOR = 70;
const MAX_VELOCITY = 5;

// input variables
var NUM_FISH = 20;

function preload() {
  FISH_IMAGE = loadImage("../scene/fish.png");
}

function setup() {
  // only happens once

  createCanvas(1400, 1000);
  frameRate(fps);
  WIDTH = width;
  HEIGHT = height;

  for (var i = 0; i < NUM_FISH; i++) {
    /** initialize a fish in a random position with a random
     * unit direction vector
     */
    fish = new Fish(
      [Math.random() * width, Math.random() * height],
      utils.generateDir(),
      FOV,
      VIEWING_DIST
    );

    ALL_FISH.push(fish);
  }

  console.log(ALL_FISH);
}

function draw() {
  // loops

  clear();
  background(0, 51, 102);

  for (var i = 0; i < NUM_FISH; i++) {
    ALL_FISH[i].show();
    ALL_FISH[i].update();
  }
}

function input(param, value) {
  switch (param) {
    case "numFish":
      NUM_FISH = value;
      break;
    case "fov":
      FOV = value;
      break;
    case "fps":
      fps = value;
      break;
    case "dist":
      VIEWING_DIST = value;
      if (value == 200) {
        document.getElementById(param).innerHTML = "short";
      } else if (value == 400) {
        document.getElementById(param).innerHTML = "medium";
      } else {
        document.getElementById(param).innerHTML = "long";
      }
      break;
  }

  ALL_FISH = [];
  setup();
  document.getElementById(param).innerHTML = value;
}
