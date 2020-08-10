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
    this.last_dir = [0, 0];

    this.separation = [0, 0];
    this.cohesion = [0, 0];
    this.alignment = [0, 0];

    this.fov = fov;
    this.dist = dist;
    this.pos = pos;

    this.velocity = Math.random() * 3 + 3;
    this.acceleration = Math.random() * 3 + 3;
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
    angleMode(RADIANS);
    translate(this.pos[0], this.pos[1]);
    push();
    rotate(this.theta);
    FISH_IMAGE = FISH_FRAMES[CURR_FRAME];
    if (frameCount % 3 == 0) {
      if (CURR_FRAME == 2) {
        CURR_FRAME = 0;
      } else {
        CURR_FRAME++;
      }
    }
    image(FISH_IMAGE, 0, 0, FISH_DIMENSIONS[0], FISH_DIMENSIONS[1]);
    pop();
    translate(-this.pos[0], -this.pos[1]);
  }

  /** Displays the direction vectors on the screen. */
  showSteering() {
    stroke(255);
    ellipse(this.pos[0], this.pos[1], 5);
    var to = math.add(this.pos, math.multiply(60, this.dir));
    line(this.pos[0], this.pos[1], to[0], to[1]);

    colorMode(RGB, 255, 255, 255, 1);
    fill(255, 255, 255, 0.2);
    stroke(255, 255, 255, 0.2);
    // console.log(this.theta);
    arc(
      this.pos[0],
      this.pos[1],
      80,
      80,
      this.theta - PI - this.fov * 0.5,
      this.theta - PI + this.fov * 0.5
    );

    colorMode(RGB);
    fill(255, 255, 255);
    stroke(255, 255, 255);
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

          var diff_pos = math.subtract(fish.pos, this.pos);

          this.cohesion = math.add(this.cohesion, diff_pos);
          this.alignment = math.add(this.alignment, fish.dir);
          count++;

          if (math.norm(diff_pos) <= SEPARATION_FACTOR) {
            // apply separation, steer AWAY from the neighbor

            var weight = 5 * (SEPARATION_FACTOR - math.norm(diff_pos)); // smaller distance will have more weight
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

  /** Checks to see if I will eventually intersect with OBJ (of type CollisionObj)
   *  given that I stay on course in direction THIS.DIR. Returns the distance to
   * the intersection. Otherwise returns false.
   */
  checkIntersection(obj) {
    if (obj instanceof CollisionObj) {
      var a = math.dot(this.dir, this.dir);
      var b = math.dot(
        math.multiply(2, math.subtract(this.pos, obj.pos)),
        this.dir
      );
      var c =
        math.dot(
          math.subtract(this.pos, obj.pos),
          math.subtract(this.pos, obj.pos)
        ) - obj.radius2;
      var t1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      var t2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);

      var t = Math.min(t1, t2); // want to use closest intersection

      if (!isNaN(t) && t >= 0 && t && t <= this.dist) {
        return t;
      } else {
        return false;
      }
    }
    console.log("Input to checkIntersection must be a CollisionObj!");
    return false;
  }

  /** Returns the steering direction dictated by potential collision objects
   * (food and obstacles). If there are no collision obstacles, returns false.
   * Does not modify any instance attributes. */
  considerObstacles() {
    var new_dir = this.dir;
    var closest = Infinity;
    var count = 0; // number of collision objects that are relevant (existing AND in view)

    for (var i = 0; i < CollisionObj.OBJS.length; i++) {
      var obj = CollisionObj.OBJS[i];
      var diffVec = math.subtract(obj.pos, this.pos);
      var d;

      if (this.inView(obj)) {
        d = math.norm(diffVec);
        if (obj.isFood && !obj.ignore) {
          if (d <= 4) {
            // close enough to the food that we will consider the food "eaten"
            CollisionObj.TO_DELETE.push(obj);
          } else if (d < closest) {
            // always want to swim towards the closest piece of food
            count++;
            closest = d;
            new_dir = Utils.unit(diffVec);
          }
        } else {
          //handle collisions
          d = this.checkIntersection(obj);
          if (d != false && d < closest) {
            count++;
            closest = d;
            var hit = math.add(this.pos, math.multiply(d, this.dir));

            var avoid_vec = Utils.unit([
              -(hit[1] - this.pos[1]),
              hit[0] - this.pos[0],
            ]); // direction vector
            avoid_vec = math.multiply(obj.radius + 80, avoid_vec); // 50 is arbitrary, adds space between fish & obstacle
            var to = math.add(avoid_vec, obj.pos);
            new_dir = math.subtract(to, this.pos);

            if (MODE == "steering") {
              stroke(0, 0, 0);
              fill(0, 0, 0);
              ellipse(hit[0], hit[1], 10);
              stroke(0, 255, 0);
              line(this.pos[0], this.pos[1], to[0], to[1]);

              fill(255, 255, 255);
              stroke(255, 255, 255);
            }
          }
        }
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
      var alignment_scaled = [this.alignment[0] * 3, this.alignment[1] * 1.5];
      var co_align = math.add(
        math.multiply(1, this.cohesion),
        alignment_scaled
      ); // scaled combination of alignment and cohesion
      var sep_scaled = math.multiply(4.5, this.separation);
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
        // take weighted average of collision_dir, separation, and current direction
        var weightedSum = math.add(
          math.multiply(6, this.separation),
          collision_dir,
          this.dir
        );
        this.dir = Utils.unit(math.multiply(1 / 3, weightedSum));
      } else {
        var weightedSum = math.add(math.multiply(2, collision_dir), this.dir);
        this.dir = Utils.unit(math.multiply(1 / 2, weightedSum));
      }
    } else {
      this.dir = this.flock();
    }

    // var temp_dir = this.dir;
    // this.dir = Utils.unit(
    //   math.multiply(0.5, math.add(this.dir, this.last_dir))
    // );
    // this.last_dir = temp_dir;
    this.theta = Utils.rotationTheta(this.dir, [-1, 0]);

    // update the position and velocity
    if (math.abs(this.velocity) > MAX_VELOCITY) {
      this.velocity = Math.random() * 3 + 3;
      this.acceleration = Math.random() * 3 + 1;
    }

    var vec = math.multiply(this.velocity, this.dir);

    this.pos = math.add(this.pos, vec);
    this.velocity += this.acceleration;
    this.constrain();
    // this.acceleration = Math.random() * 5;
  }
}
