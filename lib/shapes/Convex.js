"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convex = void 0;
const gl_matrix_1 = require("gl-matrix");
const AABB2_1 = require("../AABB2");
const Shape_1 = require("./Shape");
class Convex extends Shape_1.Shape {
    constructor() {
        super(...arguments);
        this.localPoints = [];
        this.points = [];
    }
    getPoints() {
        return this.points;
    }
    setPoints(localPoints) {
        this.localPoints = localPoints;
        this.points.length = 0;
        localPoints.reduce((points, localPoint) => {
            points.push(gl_matrix_1.vec2.copy(gl_matrix_1.vec2.create(), localPoint));
            return points;
        }, this.points);
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
