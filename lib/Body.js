"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const core_1 = require("@aicacia/core");
const events_1 = require("events");
const gl_matrix_1 = require("gl-matrix");
const ecs_game_1 = require("@aicacia/ecs-game");
const VEC2_SCALE_0 = gl_matrix_1.vec2.fromValues(1, 1);
class Body extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.world = core_1.none();
        this.userData = core_1.none();
        this.aabb = AABB2_1.AABB2.create();
        this.position = gl_matrix_1.vec2.create();
        this.rotation = 0;
        this.matrix = gl_matrix_1.mat2d.create();
        this.needsUpdate = false;
        this.aabbNeedsUpdate = false;
        this.shapes = [];
    }
    getUserData() {
        return this.userData;
    }
    getRequiredUserData() {
        return this.userData.expect("Failed to get required UserData");
    }
    setUserData(userData) {
        this.userData.replace(userData);
        return this;
    }
    UNSAFE_setWorld(world) {
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
    getShapes() {
        return this.shapes;
    }
    getPosition() {
        return this.position;
    }
    setPosition(position) {
        gl_matrix_1.vec2.copy(this.position, position);
        return this.setNeedsUpdate();
    }
    getRotation() {
        return this.rotation;
    }
    setRotation(rotation) {
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
        }
        else {
            return this;
        }
    }
    updateMatrix() {
        this.needsUpdate = false;
        ecs_game_1.composeMat2d(this.matrix, this.position, VEC2_SCALE_0, this.rotation);
        return this;
    }
    updateAABBIfNeeded() {
        if (this.getAABBNeedsUpdate()) {
            return this.updateAABB();
        }
        else {
            return this;
        }
    }
    updateAABB() {
        this.aabbNeedsUpdate = false;
        this.shapes.reduce((aabb, shape) => {
            AABB2_1.AABB2.union(aabb, aabb, shape.getAABB());
            return aabb;
        }, AABB2_1.AABB2.identity(this.aabb));
        return this;
    }
    addShapes(shapes) {
        shapes.forEach((shape) => this._addShape(shape));
        return this;
    }
    addShape(...shapes) {
        return this.addShapes(shapes);
    }
    _addShape(shape) {
        shape.UNSAFE_setBody(this);
        this.shapes.push(shape);
        return this;
    }
}
exports.Body = Body;
const AABB2_1 = require("./AABB2");
