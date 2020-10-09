import { vec2 } from "gl-matrix";
import { AABB2 } from "../AABB2";
import { Shape } from "./Shape";

export class Convex<UserData> extends Shape<UserData> {
  protected localPoints: vec2[] = [];
  protected points: vec2[] = [];

  getPoints() {
    return this.points;
  }
  setPoints(localPoints: vec2[]) {
    this.localPoints = localPoints;

    this.points.length = 0;
    localPoints.reduce((points, localPoint) => {
      points.push(vec2.copy(vec2.create(), localPoint));
      return points;
    }, this.points);

    return this.setNeedsUpdate();
  }

  getCentroid(out: vec2) {
    vec2.copy(out, this.localPosition);
    this.localPoints.forEach((localPoint) => {
      vec2.min(out, out, localPoint);
      vec2.max(out, out, localPoint);
    });
    return out;
  }

  getArea() {
    let area = 0.0,
      j = this.localPoints.length - 1;

    for (let i = 0; i < this.localPoints.length; i++) {
      const prev = this.localPoints[j],
        next = this.localPoints[i];

      area += (prev[0] + next[0]) * (prev[1] - next[1]);

      j = i;
    }

    return area;
  }

  getInertia(_mass: number) {
    let inertia = 0.0,
      j = this.localPoints.length - 1;

    for (let i = 0; i < this.localPoints.length; i++) {
      const prev = this.localPoints[j],
        next = this.localPoints[i],
        area = triangleArea(prev, next),
        mass = this.density * area;

      inertia += triangleInertia(prev, next, mass);

      j = i;
    }

    return inertia;
  }

  update() {
    super.update();

    this.localPoints.forEach((localPoint, index) => {
      const point = vec2.transformMat2d(
        this.points[index],
        localPoint,
        this.matrix
      );
      AABB2.expandPoint(this.aabb, this.aabb, point);
    });

    return this;
  }
}

function triangleArea(a: vec2, b: vec2) {
  return (a[0] * b[1] - a[1] * b[0]) * 0.5;
}

function triangleInertia(a: vec2, b: vec2, triangleMass: number): number {
  return (
    (triangleMass / 6) * (vec2.dot(a, a) + vec2.dot(b, b) + vec2.dot(a, b))
  );
}
