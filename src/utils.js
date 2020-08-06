class Utils {
  generateDir() {
    var dir = [Math.random(), Math.random()];
    if (Math.random() >= 0.5) {
      dir[0] *= -1;
    }
    if (Math.random() >= 0.5) {
      dir[1] *= -1;
    }
    dir = this.unit(dir);
    return dir;
  }

  unit(vector) {
    if (math.norm(vector) == 0) {
      return [0, 0];
    } else {
      return math.multiply(1 / math.norm(vector), vector);
    }
  }

  theta(vector1, vector2) {
    return math.dot(vector1, vector2);
  }

  /** Returns the halfvector or bisector of VECTOR1, VECTOR2. */
  halfvector(vector1, vector2) {
    var sum = math.add(vector1, vector2);
    var divide = 1 / math.norm(sum);
    return math.multiply(divide, sum);
  }
}
