class Fish {
  /** Takes in a position, POS as a length 2 array
   * and a direction vector, DIR, as a length 2 array
   */

  constructor(pos, dir, fov, dist) {
    this.initialPosition = pos;
    this.pos = pos;
    this.fov = fov;
    this.dist = dist;

    math.multiply(1 / math.norm(dir), dir);
    this.dir = dir;
    this.theta = utils.theta(this.dir, [-1, 0]);

    this.velocity = Math.random();
    this.acceleration = Math.random();
    // this.velocity = Math.random() * 0.5;
    // this.acceleration = Math.random() * 0.2;
  }

  /** Constrains my position to be within the canvas/tank. */
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

  /** Draws the fish to the screen. */
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

  /** Checks if another fish, OTHER, is within my field of view. */
  inView(other) {
    if (other instanceof Fish) {
      var diffVec = math.subtract(other.pos, this.pos);
      var d = math.norm(diffVec);
      diffVec = utils.unit(diffVec);
      var theta = utils.theta(diffVec, this.dir);

      var minTheta = -FOV * 0.5;
      var maxTheta = FOV * 0.5;

      return theta >= minTheta && theta <= maxTheta && d <= this.dist;
    }
    console.log("other in inView is not a fish object!");
  }

  /** Updates THIS.COHESION, THIS.ALIGNMENT with direction vectors for each steering force.
   * Returns true if there have been any changes.
   */
  computeBehaviors() {
    var align = [0, 0]; // compute alignment
    var cohesion = [0, 0];
    var separation = [0, 0];
    var count = 0;
    var sep_count = 0;

    // iterate through all fish
    // TODO: if time, increase efficiency by partitioning the space so that you don't
    // have to look through all fish, only the ones in its bounding box
    for (var i = 0; i < NUM_FISH; i++) {
      var fish = ALL_FISH[i];
      if (this === fish) {
        // do nothing
      } else {
        if (this.inView(fish)) {
          // compute cohesion and alignment

          var diff_pos = math.subtract(fish.pos, this.pos);

          cohesion = math.add(cohesion, diff_pos);
          align = math.add(align, fish.dir);
          count++;

          // if (math.norm(diff_pos) <= SEPARATION_FACTOR) {
          //   // apply separation, steer AWAY from the neighbor
          //   separation = math.subtract(separation, diff_pos);
          //   sep_count++;
          // }

          // console.log(separation, diff_pos);
          // console.log(math.subtract(separation, diff_pos));

          // console.log(diff_pos);
        }
      }
    }

    if (count > 0) {
      align[0] /= count;
      align[1] /= count;
      cohesion[0] /= count;
      cohesion[1] /= count;
      separation[0] /= sep_count;
      separation[1] /= sep_count;

      this.alignment = utils.unit(align);
      this.cohesion = utils.unit(cohesion);
      // this.separation = utils.unit(separation);

      return true;
    }
    return false;
  }

  /** Changes the steering direction, DIR, of fish to steer towards the average heading of local flockmates */
  flock() {
    if (this.computeBehaviors()) {
      // var co_align = utils.halfvector(this.cohesion, this.alignment);
      // var alignment_scaled = [this.alignment[0] * 2, this.alignment[1] * 2];
      // var co_align = math.add(this.cohesion, alignment_scaled);

      // var sep_scaled = [this.separation[0] * 3, this.separation[1] * 2.5];
      // var all = math.add(co_align, sep_scaled);
      // var all = math.add(this.separation, this.cohesion);

      // combine cohesion, alignment to get the final direction vector
      this.dir = utils.unit(this.alignment);
      // this.dir = utils.unit(all);

      // this.dir = utils.unit(all);
      // this.dir = utils.unit(this.separation);
    }
  }

  update() {
    this.flock();

    if (math.abs(this.velocity) > MAX_VELOCITY) {
      this.acceleration = -this.acceleration;
    }

    var vec = [this.dir[0] * this.velocity, this.dir[1] * this.velocity];

    this.pos = math.add(this.pos, vec);
    this.velocity += this.acceleration;
    this.constrain();

    this.acceleration = 0.05;
  }
}
