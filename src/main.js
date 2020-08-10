// tools
let FISH_IMAGE;
let BACKGROUND;
let FISH_OBJ;
let SPATIAL_MAP = {};
let ALL_FISH = []; // array of all the fish objects
let DROPDOWN = false;

// global parameters
let WIDTH = 0;
let HEIGHT = 0;
let FOV = Math.PI / 2; // range: [0, 2pi]
let fps = 5;
let MODE = "default";
let VIEWING_DIST = 600;
const FISH_DIMENSIONS = [45, 25];
// const FISH_DIMENSIONS = [70, 40];
const SEPARATION_FACTOR = 70;
const MAX_VELOCITY = 5;

// input variables
var NUM_FISH = 1;

function preload() {
  FISH_IMAGE = loadImage("../scene/fish.png");
  BACKGROUND = loadImage("../scene/aquarium.jpg");
  // FISH_OBJ = loadModel("../scene/fish.obj", true);
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

  // ADD COLLISION OBJECTS TO THE SCENE
  new CollisionObj([WIDTH / 2, HEIGHT / 2], "obstacle", 100);

  console.log(CollisionObj.OBJS);
  console.log(ALL_FISH);
}

/** Adds food to the display and into memory. */
function mouseClicked(event) {
  if (DROPDOWN) {
    DROPDOWN = false;
  } else {
    var x = mouseX;
    var y = mouseY;
    var food = new CollisionObj([x, y], "food");
    food.show();
  }
  return false;
}

function draw() {
  // loops

  clear();
  background(0, 51, 102);
  // image(BACKGROUND, WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);

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
      if (value == 200) {
        document.getElementById(param).innerHTML = "short";
      } else if (value == 400) {
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
