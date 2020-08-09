class CollisionObj {
  static OBJS = [];
  static TO_DELETE = [];

  /**
   * @param pos length 2 array [x, y], representing position
   * @param width float, the width or diameter of the object
   * @param type string, should either be "food" or "obstacle"
   */
  constructor(pos, type, width = 10) {
    this.pos = pos;
    this.width = width;

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
  }

  /** Draws object to the scene. */
  show() {
    if (this.isFood) {
      ellipse(this.pos[0], this.pos[1], 8);
    } else {
      ellipse(this.pos[0], this.pos[1], width);
    }
  }
}
