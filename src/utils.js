class Utils {
  static generateDir() {
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

  static unit(vector) {
    if (math.norm(vector) == 0) {
      return [0, 0];
    } else {
      return math.multiply(1 / math.norm(vector), vector);
    }
  }

  static rotationTheta(vector1, normal) {
    var perp = [-normal[1], normal[0]];
    var cosine = math.dot(vector1, normal);

    if (math.dot(perp, vector1) < 0) {
      return acos(cosine);
    } else {
      return -acos(cosine);
    }
  }

  static theta(vector1, normal) {
    return abs(this.rotationTheta(vector1, normal));
  }

  /** Returns the halfvector or bisector of VECTOR1, VECTOR2 as a unit vector. */
  static halfvector(vector1, vector2) {
    var sum = math.add(vector1, vector2);
    var divide = 1 / math.norm(sum);
    var halfvec = math.multiply(divide, sum);

    return this.unit(halfvec);
  }
}
