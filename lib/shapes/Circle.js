"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const gl_matrix_1 = require("gl-matrix");
const Shape_1 = require("./Shape");
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
