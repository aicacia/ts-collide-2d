"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointInCircle = exports.Circle = void 0;
const gl_matrix_1 = require("gl-matrix");
const Shape_1 = require("./Shape");
const VEC_2_0 = gl_matrix_1.vec2.create();
class Circle extends Shape_1.Shape {
    constructor() {
        super(...arguments);
        this.radius = 0.5;
    }
    getRadius() {
        return this.radius;
    }
    setRadius(radius) {
        this.radius = radius;
        return this.setNeedsUpdate();
    }
    getCentroid(out) {
        return gl_matrix_1.vec2.copy(out, this.localPosition);
    }
    getArea() {
        return this.radius * this.radius * Math.PI;
    }
    getInertia(mass) {
        return (mass *
            (this.radius * this.radius * 0.5 +
                gl_matrix_1.vec2.dot(this.localPosition, this.localPosition)));
    }
    contains(point) {
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
exports.Circle = Circle;
function pointInCircle(point, center, radius) {
    const d = gl_matrix_1.vec2.sub(VEC_2_0, point, center);
    return gl_matrix_1.vec2.squaredLength(d) <= radius * radius;
}
exports.pointInCircle = pointInCircle;
