class CollisionObj {
  static OBJS = [];
  static TO_DELETE = [];

  /**
   * @param pos length 2 array [x, y], representing position
   * @param width float, the width or diameter of the object
   * @param type string, should either be "food" or "obstacle"
   */
  constructor(pos, type, diameter = 10) {
    this.pos = pos;
    this.radius = diameter / 2;
    this.radius2 = this.radius * this.radius;

    if (type == "obstacle") {
      this.isFood = false;
      this.isObstacle = true;
    } else if (type == "food") {
      this.isFood = true;
      this.isObstacle = false;
    } else {
      console.log(
        "Invalid input for CollisionObj constructor's TYPE parameter."
      );
    }

    CollisionObj.OBJS.push(this);
  }

  /** Draws object to the scene. */
  show() {
    noStroke();
    if (this.isFood) {
      ellipse(this.pos[0], this.pos[1], 8);
    } else {
      fill(255, 0, 0);
      ellipse(this.pos[0], this.pos[1], this.radius * 2);
      fill(255, 255, 255);
    }
  }
}
