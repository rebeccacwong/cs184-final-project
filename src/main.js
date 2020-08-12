// tools
let FISH_IMAGE;
let FISH_FRAMES = [];
let CURR_FRAME = 0;
let BACKGROUND;
let SPATIAL_MAP = {};
let ALL_FISH = []; // array of all the fish objects
let DROPDOWN = false;

// modifiable global parameters
let WIDTH = 0;
let HEIGHT = 0;
let FOV = Math.PI / 2; // range: [0, 2pi]
let MODE = "default";
let FLOCK_TYPE = "fish";
let VIEWING_DIST = 300;
// const FISH_DIMENSIONS = [38, 33];
const FISH_DIMENSIONS = [35, 20];
let SEPARATION_FACTOR = 50;
let MAX_VELOCITY = 7;

// input variables
var NUM_FISH = 20;

function preload() {
  FISH_IMAGE = loadImage("../scene/fish.png");
  BACKGROUND = loadImage("../scene/background.png");
  // FISH_FRAMES.push(loadImage("../scene/fish1.png"));
  // FISH_FRAMES.push(loadImage("../scene/fish2.png"));
  // FISH_FRAMES.push(loadImage("../scene/fish3.png"));
}

function setup() {
  // only happens once

  // clear collision objects
  CollisionObj.OBJS = [];
  CollisionObj.TO_DELETE = [];

  createCanvas(1500, 800);
  // createCanvas(800, 800);
  WIDTH = width;
  HEIGHT = height;

  if (FLOCK_TYPE == "particle") {
    SEPARATION_FACTOR = 25;
    MAX_VELOCITY = 10;
    frameRate(50);
  } else {
    SEPARATION_FACTOR = 50;
    MAX_VELOCITY = 4;
  }
  frameRate(12);

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

  // add collision objects to the scene
  // new CollisionObj([WIDTH / 2, HEIGHT / 2], "obstacle", 100);
}

/** Adds food to the display and into memory. */
function mouseClicked(event) {
  if (DROPDOWN) {
    DROPDOWN = false;
  } else {
    var x = mouseX;
    var y = mouseY;
    var food = new CollisionObj([x, y], "food");

    for (var i = 0; i < CollisionObj.OBJS.length; i++) {
      var obj = CollisionObj.OBJS[i];
      if (obj.isObstacle && obj.inside([x, y])) {
        food.ignore = true;
      }
    }

    food.show();
  }
  return false;
}

function draw() {
  // loops

  clear();
  background(0, 51, 102);
  image(BACKGROUND, WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);

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
    if (MODE == "steering") {
      ALL_FISH[i].showSteering();
    }
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
      if (value == 150) {
        document.getElementById(param).innerHTML = "short";
      } else if (value == 300) {
        document.getElementById(param).innerHTML = "medium";
      } else {
        document.getElementById(param).innerHTML = "long";
      }
      break;
    case "mode":
      MODE = value;
      if (value == "default") {
        document.getElementById(param).innerHTML = "Default";
      } else {
        document.getElementById(param).innerHTML = "Show Steering";
      }
      return;
    case "flockmode":
      FLOCK_TYPE = value;
      document.getElementById(param).innerHTML =
        value.charAt(0).toUpperCase() + value.slice(1);
      document.getElementById(param).innerHTML =
        value.charAt(0).toUpperCase() + value.slice(1);
  }

  ALL_FISH = [];
  setup();
}

function hashPosition(pos) {
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
