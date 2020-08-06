class Fish {
  /** Takes in a position, POS as a length 2 array
   * and a direction vector, DIR, as a length 2 array
   */

  constructor(pos, dir, fov) {
    this.initialPosition = pos;
    this.pos = pos;
    this.fov = fov;

    math.multiply(1 / math.norm(dir), dir);
    this.dir = dir;
    this.theta = utils.theta(this.dir, [-1, 0]);

    this.velocity = Math.random() * 2;
    this.acceleration = Math.random() * 2;
    // this.velocity = Math.random() * 0.5;
    // this.acceleration = Math.random() * 0.2;
  }

  constrain() {
    if (
      this.pos[0] > WIDTH ||
      this.pos[1] > HEIGHT ||
      this.pos[0] < 0 ||
      this.pos[1] < 0
    ) {
      this.dir = utils.generateDir();
    }
  }

  show() {
    // imageMode(CENTER);
    // translate(
    //   this.pos[0] + FISH_DIMENSIONS[0] / 2,
    //   this.pos[1] + FISH_DIMENSIONS[0] / 2
    // );
    // rotate(this.theta);
    // image(FISH_IMAGE, 0, 0, FISH_DIMENSIONS[0], FISH_DIMENSIONS[1]);
    // rotate(this.theta);
    // translate(
    //   -(this.pos[0] + FISH_DIMENSIONS[0] / 2),
    //   -(this.pos[1] + FISH_DIMENSIONS[0] / 2)
    // );
    // imageMode(CORNER);
    image(
      FISH_IMAGE,
      this.pos[0],
      this.pos[1],
      FISH_DIMENSIONS[0],
      FISH_DIMENSIONS[1]
    );
  }

  inView(other) {
    if (other instanceof Fish) {
      var diffVec = math.subtract(other.pos, this.pos);
      diffVec = utils.unit(diffVec);
      var theta = utils.theta(diffVec, this.dir);

      var minTheta = -FOV * 0.5;
      var maxTheta = FOV * 0.5;

      return theta >= minTheta && theta <= maxTheta;
    }
    console.log("other in inView is not a fish object!");
  }

  computeAlignment() {
    // Each unit should steer so as to try to assume a heading equal to the average heading of its neighbors.

    var heading = [0, 0];
    var count = 0;
    // console.log(ALL_FISH);
    for (var i = 0; i < NUM_FISH; i++) {
      var fish = ALL_FISH[i];
      if (this === fish) {
        // do nothing
      } else {
        if (this.inView(fish)) {
          heading = math.add(heading, fish.dir);
          console.log(heading);
          count++;
        }
      }
    }

    heading[0] /= count;
    heading[1] /= count;

    this.dir = utils.unit(heading);
  }

  update() {
    this.computeAlignment();

    this.pos = math.add(this.pos, this.dir);
    this.velocity += this.acceleration;
    this.constrain();
  }
}
