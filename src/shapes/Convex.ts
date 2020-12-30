import { vec2, vec3 } from "gl-matrix";
import { AABB2 } from "../AABB2";
import { Shape } from "./Shape";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create(),
  VEC3_0 = vec3.create();

export class Convex<UserData> extends Shape<UserData> {
  protected localPoints: vec2[] = [];
  protected points: vec2[] = [];

  getPoints() {
    return this.points;
  }
  getLocalPoints() {
    return this.localPoints;
  }
  setPoints(localPoints: vec2[]) {
    this.localPoints = localPoints;

    if (this.points.length < localPoints.length) {
      for (
        let i = 0, il = localPoints.length - this.points.length;
        i < il;
        i++
      ) {
        this.points.push(vec2.create());
      }
    }
    this.points.length = localPoints.length;

    for (let i = 0, il = localPoints.length; i < il; i++) {
      vec2.copy(this.points[i], localPoints[i]);
    }

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

  contains(point: vec2): boolean {
    return pointInConvex(point, this.points);
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

export function pointInConvex(point: vec2, points: vec2[]): boolean {
  const r0 = VEC2_0,
    r1 = VEC2_1,
    v3 = VEC3_0;

  let lastCross = null;

  for (let i = 0; i < points.length + 1; i++) {
    const v0 = points[i % points.length],
      v1 = points[(i + 1) % points.length];

    vec2.subtract(r0, v0, point);
    vec2.subtract(r1, v1, point);

    const cross = vec2.cross(v3, r0, r1)[2];

    if (lastCross === null) {
      lastCross = cross;
    }

    if (cross * lastCross < 0) {
      return false;
    }
    lastCross = cross;
  }

  return true;
}
