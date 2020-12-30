"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointInConvex = exports.Convex = void 0;
const gl_matrix_1 = require("gl-matrix");
const AABB2_1 = require("../AABB2");
const Shape_1 = require("./Shape");
const VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create(), VEC3_0 = gl_matrix_1.vec3.create();
class Convex extends Shape_1.Shape {
    constructor() {
        super(...arguments);
        this.localPoints = [];
        this.points = [];
    }
    getPoints() {
        return this.points;
    }
    getLocalPoints() {
        return this.localPoints;
    }
    setPoints(localPoints) {
        this.localPoints = localPoints;
        if (this.points.length < localPoints.length) {
            for (let i = 0, il = localPoints.length - this.points.length; i < il; i++) {
                this.points.push(gl_matrix_1.vec2.create());
            }
        }
        this.points.length = localPoints.length;
        for (let i = 0, il = localPoints.length; i < il; i++) {
            gl_matrix_1.vec2.copy(this.points[i], localPoints[i]);
        }
        return this.setNeedsUpdate();
    }
    getCentroid(out) {
        gl_matrix_1.vec2.copy(out, this.localPosition);
        this.localPoints.forEach((localPoint) => {
            gl_matrix_1.vec2.min(out, out, localPoint);
            gl_matrix_1.vec2.max(out, out, localPoint);
        });
        return out;
    }
    getArea() {
        let area = 0.0, j = this.localPoints.length - 1;
        for (let i = 0; i < this.localPoints.length; i++) {
            const prev = this.localPoints[j], next = this.localPoints[i];
            area += (prev[0] + next[0]) * (prev[1] - next[1]);
            j = i;
        }
        return area;
    }
    getInertia(_mass) {
        let inertia = 0.0, j = this.localPoints.length - 1;
        for (let i = 0; i < this.localPoints.length; i++) {
            const prev = this.localPoints[j], next = this.localPoints[i], area = triangleArea(prev, next), mass = this.density * area;
            inertia += triangleInertia(prev, next, mass);
            j = i;
        }
        return inertia;
    }
    contains(point) {
        return pointInConvex(point, this.points);
    }
    update() {
        super.update();
        this.localPoints.forEach((localPoint, index) => {
            const point = gl_matrix_1.vec2.transformMat2d(this.points[index], localPoint, this.matrix);
            AABB2_1.AABB2.expandPoint(this.aabb, this.aabb, point);
        });
        return this;
    }
}
exports.Convex = Convex;
function triangleArea(a, b) {
    return (a[0] * b[1] - a[1] * b[0]) * 0.5;
}
function triangleInertia(a, b, triangleMass) {
    return ((triangleMass / 6) * (gl_matrix_1.vec2.dot(a, a) + gl_matrix_1.vec2.dot(b, b) + gl_matrix_1.vec2.dot(a, b)));
}
function pointInConvex(point, points) {
    const r0 = VEC2_0, r1 = VEC2_1, v3 = VEC3_0;
    let lastCross = null;
    for (let i = 0; i < points.length + 1; i++) {
        const v0 = points[i % points.length], v1 = points[(i + 1) % points.length];
        gl_matrix_1.vec2.subtract(r0, v0, point);
        gl_matrix_1.vec2.subtract(r1, v1, point);
        const cross = gl_matrix_1.vec2.cross(v3, r0, r1)[2];
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
exports.pointInConvex = pointInConvex;
