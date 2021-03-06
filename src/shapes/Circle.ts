import { vec2 } from "gl-matrix";
import { Shape } from "./Shape";

const VEC_2_0 = vec2.create();

export class Circle<UserData> extends Shape<UserData> {
  protected radius = 0.5;

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this.setNeedsUpdate();
  }

  getCentroid(out: vec2) {
    return vec2.copy(out, this.localPosition);
  }

  getArea() {
    return this.radius * this.radius * Math.PI;
  }

  getInertia(mass: number) {
    return (
      mass *
      (this.radius * this.radius * 0.5 +
        vec2.dot(this.localPosition, this.localPosition))
    );
  }

  contains(point: vec2): boolean {
    return pointInCircle(point, this.getPosition(), this.radius);
  }

  update() {
    super.update();

    this.aabb.min[0] = this.position[0] - this.radius;
    this.aabb.min[1] = this.position[1] - this.radius;
    this.aabb.max[0] = this.position[0] + this.radius;
    this.aabb.max[1] = this.position[1] + this.radius;

    return this;
  }
}

export function pointInCircle(point: vec2, center: vec2, radius: number) {
  const d = vec2.sub(VEC_2_0, point, center);
  return vec2.squaredLength(d) <= radius * radius;
}
