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
  }

  /** Make fish appear on the other side of the tank */
  constrain() {
    if (this.pos[0] > WIDTH) {
      this.pos[0] = 0;
    }
    if (this.pos[0] < 0) {
      this.pos[0] = WIDTH;
    }
    if (this.pos[1] > HEIGHT) {
      this.pos[1] = 0;
    }
    if (this.pos[1] < 0) {
      this.pos[1] = HEIGHT;
    }

    // if (
    //   this.pos[0] > WIDTH ||
    //   this.pos[0] > HEIGHT ||
    //   this.pos[1] < 0 ||
    //   this.pos[1] < 0
    // ) {
    //   // turn around
    //   this.dir = math.subtract(0, this.dir);
    // }
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

  inTank(position) {
    return (
      position[0] <= WIDTH &&
      position[1] >= 0 &&
      position[0] >= 0 &&
      position[1] <= HEIGHT
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

  /** Updates THIS.COHESION, THIS.ALIGNMENT, and THIS.SEPARATION with direction vectors
   * for each steering force. Returns true if there have been any changes.
   */
  computeBehaviors() {
    this.alignment = [0, 0];
    this.cohesion = [0, 0];
    this.separation = [0, 0];

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
        if (this.inView(fish) && this.inTank(fish.pos)) {
          // compute cohesion and alignment for fish that are visible
          // and ignore all fish that are not in the tank (we shouldn't follow their behavior!!)

          var diff_pos = math.subtract(fish.pos, this.pos);

          this.cohesion = math.add(this.cohesion, diff_pos);
          this.alignment = math.add(this.alignment, fish.dir);
          count++;

          if (math.norm(diff_pos) <= SEPARATION_FACTOR) {
            // apply separation, steer AWAY from the neighbor

            var weight = 3 * (SEPARATION_FACTOR - math.norm(diff_pos)); // smaller distance will have more weight
            var reversed = math.subtract(0, diff_pos);
            this.separation = math.add(this.separation, reversed);
            this.separation = math.multiply(weight, this.separation);

            sep_count++;
          }
        }
      }
    }

    if (count > 0) {
      this.alignment[0] /= count;
      this.alignment[1] /= count;
      this.cohesion[0] /= count;
      this.cohesion[1] /= count;

      if (sep_count > 0) {
        this.separation[0] /= sep_count;
        this.separation[1] /= sep_count;
      }

      this.alignment = utils.unit(this.alignment);
      this.cohesion = utils.unit(this.cohesion);
      this.separation = utils.unit(this.separation);

      return true;
    }

    return false;
  }

  /** Changes the steering direction, DIR, of fish to steer towards the average heading of local flockmates */
  flock() {
    if (this.computeBehaviors()) {
      var alignment_scaled = [this.alignment[0] * 1.5, this.alignment[1] * 1.5];
      var co_align = math.add(
        math.multiply(0.5, this.cohesion),
        alignment_scaled
      );
      var sep_scaled = math.multiply(1.5, this.separation);
      var all = math.add(co_align, sep_scaled);
      this.dir = utils.unit(all);
      this.theta = utils.theta(this.dir, [-1, 0]);
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

    this.acceleration = 0.5;
  }
}
