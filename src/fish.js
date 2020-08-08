class Fish {
  /**
   * @param pos   length 2 array [x, y] representing position
   * @param dir   length 2 unit vector [x, y] representing direction
   * @param fov   float representing the angle for field of view.
   *              Must be in range [0, 2 * PI].
   * @param dist  float representing the viewing distance that
   *              the fish can see.
   */
  constructor(pos, dir, fov, dist) {
    var w = FISH_DIMENSIONS[0];
    this.dir = Utils.unit(dir); // make sure that the direction is normalzed
    this.theta = Utils.rotationTheta(this.dir, [-1, 0]);

    this.fov = fov;
    this.dist = dist;
    this.pos = pos;
    // this.pos = math.add(pos, math.multiply(w * 0.5, this.dir));

    this.velocity = Math.random() * 2;
    this.acceleration = Math.random() * 2;
  }

  /** Keep fish within view by making them appear on the other side of the tank. */
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
    imageMode(CENTER);

    translate(
      this.pos[0] + FISH_DIMENSIONS[0] / 2,
      this.pos[1] + FISH_DIMENSIONS[0] / 2
    );
    rotate(-this.theta);
    image(FISH_IMAGE, 0, 0, FISH_DIMENSIONS[0], FISH_DIMENSIONS[1]);
    rotate(this.theta);
    translate(
      -(this.pos[0] + FISH_DIMENSIONS[0] / 2),
      -(this.pos[1] + FISH_DIMENSIONS[0] / 2)
    );
  }

  /** Returns true if the POSITION, as a 2-element array, is within the tank of size WIDTH x HEIGHT. */
  inTank(position) {
    return (
      position[0] <= WIDTH &&
      position[1] >= 0 &&
      position[0] >= 0 &&
      position[1] <= HEIGHT
    );
  }

  /** Checks if another Fish or CollisionObj, OTHER, is within my field of view. */
  inView(other) {
    if (other instanceof Fish || other instanceof CollisionObj) {
      var diffVec = math.subtract(other.pos, this.pos);
      var d = math.norm(diffVec);
      diffVec = Utils.unit(diffVec);
      var theta = abs(Utils.theta(diffVec, this.dir));
      if (other instanceof CollisionObj) {
        if (theta <= FOV * 0.5 && d <= this.dist) {
          console.log("food in view");
        }
      }

      // var minTheta = -FOV * 0.5;
      // var maxTheta = FOV * 0.5;

      return theta <= FOV * 0.5 && d <= this.dist;
    }
    console.log("OTHER in inView function is not a Fish or a CollisionObj!");
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

      this.alignment = Utils.unit(this.alignment);
      this.cohesion = Utils.unit(this.cohesion);
      this.separation = Utils.unit(this.separation);

      return true;
    }

    return false;
  }

  /** Returns the steering direction dictated by potential collision objects
   * (food and obstacles). If there are no collision obstacles, returns false.
   * Does not modify any instance attributes. */
  considerObstacles() {
    // choose to give collision objects priority over food
    var new_dir = this.dir;
    var closest = Infinity;
    var count = 0; // number of collision objects that are relevant (existing AND in view)

    for (var i = 0; i < CollisionObj.OBJS.length; i++) {
      var obj = CollisionObj.OBJS[i];
      var diffVec = math.subtract(obj.pos, this.pos);
      if (obj.isFood) {
        if (this.inView(obj)) {
          var d = math.norm(diffVec);

          if (d <= 4) {
            // close enough to the food that we will consider the food "eaten"
            // In this case, mark the food to be deleted and ignore it.
            CollisionObj.TO_DELETE.push(obj);
            console.log("eat", d);
          } else if (d < closest) {
            // always want to swim towards the closest piece of food
            count++;
            console.log(d);
            closest = d;
            new_dir = Utils.unit(diffVec);
          }
        }
      } else {
        // handle collision objects
      }
    }

    if (count != 0) {
      return new_dir;
    } else {
      return false;
    }
  }

  /** Returns the steering direction dictated by local flockmates (neighbors).
   * Also modifies THIS.ALIGNMENT, THIS.COHESION, and THIS.SEPARATION. Does NOT modify THIS.DIR.
   */
  flock() {
    if (this.computeBehaviors()) {
      var alignment_scaled = [this.alignment[0] * 1.5, this.alignment[1] * 1.5];
      var co_align = math.add(
        math.multiply(0.5, this.cohesion),
        alignment_scaled
      ); // scaled combination of alignment and cohesion
      var sep_scaled = math.multiply(1.5, this.separation);
      var all = math.add(co_align, sep_scaled); // weighted combination of all three factors
      var new_dir = Utils.unit(all);

      // this.dir = unit(math.add(this.dir, new_dir));
      new_dir = Utils.halfvector(new_dir, this.dir);

      // this.theta = Utils.theta(this.dir, [-1, 0]);

      return new_dir;
    } else {
      return this.dir;
    }
  }

  /** Updates instance attributes of fish to reflect the movement. */
  update() {
    // update the steering behavior
    var collision_dir = this.considerObstacles();
    if (collision_dir) {
      if (this.computeBehaviors == true) {
        console.log("weighted");
        // take weighted average of collision_dir, separation, and current direction
        var weightedSum = math.add(
          math.multiply(4, this.separation),
          collision_dir,
          this.dir
        );
        this.dir = Utils.unit(math.multiply(1 / 3, weightedSum));
      } else {
        // var weightedSum = math.add(math.multiply(2, collision_dir), this.dir);
        // this.dir = Utils.unit(math.multiply(1 / 2, weightedSum));
        console.log("follow food!");
        this.dir = collision_dir;
        console.log(this.dir);
      }
    } else {
      this.dir = this.flock();
    }
    this.theta = Utils.rotationTheta(this.dir, [-1, 0]);

    // update the position and velocity
    if (math.abs(this.velocity) > MAX_VELOCITY) {
      this.acceleration = -this.acceleration;
    }

    var vec = math.multiply(this.velocity, this.dir);

    this.pos = math.add(this.pos, vec);
    this.velocity += this.acceleration;
    this.constrain();
    this.acceleration = Math.random() * 2;
  }
}
