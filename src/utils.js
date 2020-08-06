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
    return math.multiply(1 / math.norm(vector), vector);
  }

  theta(vector1, vector2) {
    return math.dot(vector1, vector2);
  }
}
