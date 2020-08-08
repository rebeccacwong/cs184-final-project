// tools
let FISH_IMAGE;
let SPATIAL_MAP = {};
let ALL_FISH = []; // array of all the fish objects
let DROPDOWN = false;

// global parameters
let WIDTH = 0;
let HEIGHT = 0;
let FOV = Math.PI / 2; // range: [0, 2pi]
let fps = 5;
let VIEWING_DIST = 600;
const FISH_DIMENSIONS = [35, 20];
const SEPARATION_FACTOR = 70;
const MAX_VELOCITY = 5;

// input variables
var NUM_FISH = 20;

function preload() {
  FISH_IMAGE = loadImage("../scene/fish.png");
}

function setup() {
  // only happens once

  // clear collision objects
  CollisionObj.OBJS = [];
  CollisionObj.TO_DELETE = [];

  createCanvas(1400, 1000);
  frameRate(fps);
  WIDTH = width;
  HEIGHT = height;

  for (var i = 0; i < NUM_FISH; i++) {
    // initialize a fish in a random position with a random unit direction vector
    fish = new Fish(
      [Math.random() * width, Math.random() * height],
      Utils.generateDir(),
      FOV,
      VIEWING_DIST
    );

    ALL_FISH.push(fish);
  }

  // console.log(ALL_FISH);
}

/** Adds food to the display and into memory. */
function mouseClicked(event) {
  if (DROPDOWN) {
    DROPDOWN = false;
  } else {
    var x = mouseX;
    var y = mouseY;
    var food = new CollisionObj([x, y], "food");
    CollisionObj.OBJS.push(food);
    food.show();
  }
  return false;
}

function draw() {
  // loops

  clear();
  background(0, 51, 102);

  for (var i = 0; i < CollisionObj.TO_DELETE.length; i++) {
    var obj = CollisionObj.TO_DELETE[i];
    const index = CollisionObj.OBJS.indexOf(obj);
    if (index >= 0) {
      CollisionObj.OBJS.splice(index, 1);
    }
  }
  CollisionObj.TO_DELETE = [];

  for (var i = 0; i < CollisionObj.OBJS.length; i++) {
    CollisionObj.OBJS[i].show();
  }

  // var fish = new Fish([50, 50], [1 / sqrt(2), 1 / sqrt(2)], PI, 80);
  // var fish = new Fish([50, 50], [1, 0], PI / 2, 80);
  // fish.show();
  // fish.showSteering();

  for (var i = 0; i < NUM_FISH; i++) {
    ALL_FISH[i].show();
    // ALL_FISH[i].showSteering();
    ALL_FISH[i].update();
  }
}

/** Handles input from GUI. */
function input(param, value) {
  DROPDOWN = true;
  document.getElementById(param).innerHTML = value;

  switch (param) {
    case "numFish":
      NUM_FISH = value;
      break;
    case "fov":
      FOV = value;
      if (value == PI / 4) {
        document.getElementById(param).innerHTML = "45";
      } else if (value == PI / 2) {
        document.getElementById(param).innerHTML = "90";
      } else if (value == PI) {
        document.getElementById(param).innerHTML = "180";
      } else {
        document.getElementById(param).innerHTML = "270";
      }
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
}

function hashPosition(pos) {
  var numObjs = NUM_FISH + FOOD.length;

  // need entire area of SEPARATION_FACTOR x SEPARATION_FACTOR included into spatial map
}

function makeSpatialMap() {
  // clear pre-exisitng spatial map
  SPATIAL_MAP = {};

  for (var i = 0; i < NUM_FISH; i++) {
    var fish = ALL_FISH[i];
    var hash = hashPosition(fish.pos);
  }
}
