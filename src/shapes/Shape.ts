import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";
import { mat2d, vec2 } from "gl-matrix";
import { composeMat2d, decomposeMat2d } from "@aicacia/ecs-game";
import { AABB2 } from "../AABB2";
import { Body } from "../Body";

const VEC2_SCALE_0 = vec2.fromValues(1, 1),
  MAT2D_0 = mat2d.create();

export abstract class Shape<UserData> extends EventEmitter {
  protected body: Option<Body<UserData>> = none();
  protected aabb: AABB2 = AABB2.create();

  protected matrix: mat2d = mat2d.create();

  protected localPosition: vec2 = vec2.create();
  protected localRotation = 0;

  protected position: vec2 = vec2.create();
  protected rotation = 0;

  protected needsUpdate = true;

  protected filterMask = 1;
  protected filterGroup = 1;

  protected density = 1.0;
  protected friction = 0.5;
  protected elasticity = 0.25;

  UNSAFE_setBody(body: Body<UserData>) {
    this.body = some(body);
    return this;
  }
  getBody() {
    return this.body;
  }

  getFilterMask() {
    return this.filterMask;
  }
  setFilterMask(filterMask: number) {
    this.filterMask = filterMask;
    return this;
  }
  getFilterGroup() {
    return this.filterGroup;
  }
  setFilterGroup(filterGroup: number) {
    this.filterGroup = filterGroup;
    return this;
  }

  getDensity() {
    return this.density;
  }
  setDensity(density: number) {
    this.density = density;
    return this;
  }

  getFriction() {
    return this.friction;
  }
  setFriction(friction: number) {
    this.friction = friction;
    return this;
  }

  getElasticity() {
    return this.elasticity;
  }
  setElasticity(elasticity: number) {
    this.elasticity = elasticity;
    return this;
  }

  getAABB() {
    return this.updateIfNeeded().aabb;
  }

  getPosition() {
    return this.updateIfNeeded().position;
  }
  getLocalPosition() {
    return this.position;
  }
  setLocalPosition(position: vec2) {
    vec2.copy(this.localPosition, position);
    return this.setNeedsUpdate();
  }

  getLocalRotation() {
    return this.localRotation;
  }
  getRotation() {
    return this.updateIfNeeded().rotation;
  }
  setLocalRotation(localRotation: number) {
    this.localRotation = localRotation;
    return this.setNeedsUpdate();
  }

  setNeedsUpdate(needsUpdate = true) {
    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.body.map((body) => body.setAABBNeedsUpdate(needsUpdate));
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  getMatrix() {
    return this.updateIfNeeded().matrix;
  }

  updateIfNeeded() {
    if (this.getNeedsUpdate()) {
      return this.update();
    } else {
      return this;
    }
  }

  update() {
    this.needsUpdate = false;

    const localMatrix = composeMat2d(
      MAT2D_0,
      this.localPosition,
      VEC2_SCALE_0,
      this.localRotation
    );

    this.body
      .ifSome((body) => mat2d.mul(this.matrix, body.getMatrix(), localMatrix))
      .ifNone(() => mat2d.copy(this.matrix, localMatrix));

    this.rotation = decomposeMat2d(this.matrix, this.position, VEC2_SCALE_0);

    AABB2.identity(this.aabb);

    return this;
  }

  abstract getInertia(mass: number): number;
  abstract getArea(): number;
  abstract getCentroid(out: vec2): vec2;
  abstract contains(point: vec2): boolean;
}
