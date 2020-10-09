"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AABB2 = void 0;
var gl_matrix_1 = require("gl-matrix");
var AABB2 = /** @class */ (function () {
    function AABB2() {
        this.min = gl_matrix_1.vec2.fromValues(Infinity, Infinity);
        this.max = gl_matrix_1.vec2.fromValues(-Infinity, -Infinity);
    }
    AABB2.create = function () {
        return new AABB2();
    };
    AABB2.fromValues = function (min, max) {
        return AABB2.set(AABB2.create(), min, max);
    };
    AABB2.set = function (out, min, max) {
        AABB2.setMin(out, min);
        AABB2.setMax(out, max);
        return out;
    };
    AABB2.setMin = function (out, min) {
        gl_matrix_1.vec2.copy(out.min, min);
        return out;
    };
    AABB2.setMax = function (out, max) {
        gl_matrix_1.vec2.copy(out.max, max);
        return out;
    };
    AABB2.identity = function (out) {
        gl_matrix_1.vec2.set(out.min, Infinity, Infinity);
        gl_matrix_1.vec2.set(out.max, -Infinity, -Infinity);
        return out;
    };
    AABB2.expandPoint = function (out, aabb, v) {
        gl_matrix_1.vec2.min(out.min, aabb.min, v);
        gl_matrix_1.vec2.max(out.max, aabb.max, v);
        return out;
    };
    AABB2.union = function (out, a, b) {
        gl_matrix_1.vec2.min(out.min, a.min, b.min);
        gl_matrix_1.vec2.max(out.max, a.max, b.max);
        return out;
    };
    AABB2.intersects = function (a, b) {
        return (a.min[0] <= b.max[0] &&
            a.max[0] >= b.min[0] &&
            a.min[1] <= b.max[1] &&
            a.max[1] >= b.min[1]);
    };
    return AABB2;
}());
exports.AABB2 = AABB2;
