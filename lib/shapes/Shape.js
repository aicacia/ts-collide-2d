"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
const core_1 = require("@aicacia/core");
const events_1 = require("events");
const gl_matrix_1 = require("gl-matrix");
const ecs_game_1 = require("@aicacia/ecs-game");
const AABB2_1 = require("../AABB2");
const VEC2_SCALE_0 = gl_matrix_1.vec2.fromValues(1, 1), MAT2D_0 = gl_matrix_1.mat2d.create();
class Shape extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.body = core_1.none();
        this.aabb = AABB2_1.AABB2.create();
        this.matrix = gl_matrix_1.mat2d.create();
        this.localPosition = gl_matrix_1.vec2.create();
        this.localRotation = 0;
        this.position = gl_matrix_1.vec2.create();
        this.rotation = 0;
        this.needsUpdate = true;
        this.filterMask = 1;
        this.filterGroup = 1;
        this.density = 1.0;
        this.friction = 0.5;
        this.elasticity = 0.25;
    }
    UNSAFE_setBody(body) {
        this.body = core_1.some(body);
        return this;
    }
    getBody() {
        return this.body;
    }
    getRequiredBody() {
        return this.body.expect("Failed to get required Body");
    }
    getFilterMask() {
        return this.filterMask;
    }
    setFilterMask(filterMask) {
        this.filterMask = filterMask;
        return this;
    }
    getFilterGroup() {
        return this.filterGroup;
    }
    setFilterGroup(filterGroup) {
        this.filterGroup = filterGroup;
        return this;
    }
    getDensity() {
        return this.density;
    }
    setDensity(density) {
        this.density = density;
        return this;
    }
    getFriction() {
        return this.friction;
    }
    setFriction(friction) {
        this.friction = friction;
        return this;
    }
    getElasticity() {
        return this.elasticity;
    }
    setElasticity(elasticity) {
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
    setLocalPosition(position) {
        gl_matrix_1.vec2.copy(this.localPosition, position);
        return this.setNeedsUpdate();
    }
    getLocalRotation() {
        return this.localRotation;
    }
    getRotation() {
        return this.updateIfNeeded().rotation;
    }
    setLocalRotation(localRotation) {
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
        }
        else {
            return this;
        }
    }
    update() {
        this.needsUpdate = false;
        const localMatrix = ecs_game_1.composeMat2d(MAT2D_0, this.localPosition, VEC2_SCALE_0, this.localRotation);
        this.body
            .ifSome((body) => gl_matrix_1.mat2d.mul(this.matrix, body.getMatrix(), localMatrix))
            .ifNone(() => gl_matrix_1.mat2d.copy(this.matrix, localMatrix));
        this.rotation = ecs_game_1.decomposeMat2d(this.matrix, this.position, VEC2_SCALE_0);
        AABB2_1.AABB2.identity(this.aabb);
        return this;
    }
}
exports.Shape = Shape;
