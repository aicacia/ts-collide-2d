import { none, Option } from "@aicacia/core";
import { EventEmitter } from "events";
import { mat2d, vec2 } from "gl-matrix";
import { composeMat2d } from "@aicacia/ecs-game";
import { BodyEvent } from "./BodyEvent";
import { Shape } from "./shapes";

const VEC2_SCALE_0 = vec2.fromValues(1, 1);

// tslint:disable-next-line: interface-name
export interface Body<UserData> {
  on(
    event:
      | BodyEvent.COLLIDING
      | BodyEvent.COLLIDE_START
      | BodyEvent.COLLIDE_END,
    listener: (
      this: Body<UserData>,
      otherBody: Body<UserData>,
      contact: Contact<UserData>
    ) => void
  ): this;
}

export class Body<UserData> extends EventEmitter {
  protected world: Option<World<UserData>> = none();
  protected userData: Option<UserData> = none();

  protected aabb: AABB2 = AABB2.create();

  protected position: vec2 = vec2.create();
  protected rotation = 0;

  protected matrix: mat2d = mat2d.create();

  protected needsUpdate = false;
  protected aabbNeedsUpdate = false;

  protected shapes: Array<Shape<UserData>> = [];

  getUserData() {
    return this.userData;
  }
  setUserData(userData: UserData) {
    this.userData.replace(userData);
    return this;
  }

  UNSAFE_setWorld(world: World<UserData>) {
    this.world.replace(world);
    return this;
  }
  UNSAFE_removeWorld() {
    this.world.take();
    return this;
  }
  getWorld() {
    return this.world;
  }

  getAABB() {
    return this.updateAABBIfNeeded().aabb;
  }
  getShapes(): ReadonlyArray<Shape<UserData>> {
    return this.shapes;
  }

  getPosition() {
    return this.position;
  }
  setPosition(position: vec2) {
    vec2.copy(this.position, position);
    return this.setNeedsUpdate();
  }

  getRotation() {
    return this.rotation;
  }
  setRotation(rotation: number) {
    this.rotation = rotation;
    return this.setNeedsUpdate();
  }

  setNeedsUpdate(needsUpdate = true) {
    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.setAABBNeedsUpdate(needsUpdate);
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  setAABBNeedsUpdate(aabbNeedsUpdate = true) {
    if (aabbNeedsUpdate !== this.aabbNeedsUpdate) {
      this.aabbNeedsUpdate = aabbNeedsUpdate;
      this.shapes.forEach((shape) => shape.setNeedsUpdate(aabbNeedsUpdate));
    }
    return this;
  }
  getAABBNeedsUpdate() {
    return this.aabbNeedsUpdate;
  }

  getMatrix() {
    return this.updateMatrixIfNeeded().matrix;
  }

  updateMatrixIfNeeded() {
    if (this.getNeedsUpdate()) {
      return this.updateMatrix();
    } else {
      return this;
    }
  }
  updateMatrix() {
    this.needsUpdate = false;
    composeMat2d(this.matrix, this.position, VEC2_SCALE_0, this.rotation);
    return this;
  }

  updateAABBIfNeeded() {
    if (this.getAABBNeedsUpdate()) {
      return this.updateAABB();
    } else {
      return this;
    }
  }
  updateAABB() {
    this.aabbNeedsUpdate = false;
    this.shapes.reduce((aabb, shape) => {
      AABB2.union(aabb, aabb, shape.getAABB());
      return aabb;
    }, AABB2.identity(this.aabb));
    return this;
  }

  addShapes(shapes: Array<Shape<UserData>>) {
    shapes.forEach((shape) => this._addShape(shape));
    return this;
  }
  addShape(...shapes: Array<Shape<UserData>>) {
    return this.addShapes(shapes);
  }

  private _addShape<S extends Shape<UserData>>(shape: S) {
    shape.UNSAFE_setBody(this);
    this.shapes.push(shape);
    return this;
  }
}

import { Contact } from "./phases/Contact";
import { World } from "./World";
import { AABB2 } from "./AABB2";
