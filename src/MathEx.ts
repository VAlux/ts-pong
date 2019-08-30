// Why the hell I can't do it via stdlib ?!
export class MathEx {
  static lerp(v0: number, v1: number, t: number): number {
    return (1 - t) * v0 + t * v1;
  }

  static round(value: number, precision: number) {
    const y = +value + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
  }
}
