import { vec2 } from "gl-matrix";
import { Convex } from "./Convex";

export class Box<UserData> extends Convex<UserData> {
  constructor() {
    super();

    this.setPoints([
      vec2.fromValues(-0.5, 0.5),
      vec2.fromValues(0.5, 0.5),
      vec2.fromValues(0.5, -0.5),
      vec2.fromValues(-0.5, -0.5),
    ]);
  }

  set(width: number, height: number) {
    const halfWidth = width * 0.5,
      halfHeight = height * 0.5,
      localPoints = this.getLocalPoints();

    vec2.set(localPoints[0], -halfWidth, halfHeight);
    vec2.set(localPoints[1], halfWidth, halfHeight);
    vec2.set(localPoints[2], halfWidth, -halfHeight);
    vec2.set(localPoints[3], -halfWidth, -halfHeight);

    return this.setPoints(localPoints);
  }
}
