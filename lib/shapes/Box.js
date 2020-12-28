"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const gl_matrix_1 = require("gl-matrix");
const Convex_1 = require("./Convex");
class Box extends Convex_1.Convex {
    constructor() {
        super();
        this.setPoints([
            gl_matrix_1.vec2.fromValues(-0.5, 0.5),
            gl_matrix_1.vec2.fromValues(0.5, 0.5),
            gl_matrix_1.vec2.fromValues(0.5, -0.5),
            gl_matrix_1.vec2.fromValues(-0.5, -0.5),
        ]);
    }
    set(width, height) {
        const halfWidth = width * 0.5, halfHeight = height * 0.5;
        gl_matrix_1.vec2.set(this.points[0], -halfWidth, halfHeight);
        gl_matrix_1.vec2.set(this.points[1], halfWidth, halfHeight);
        gl_matrix_1.vec2.set(this.points[2], halfWidth, -halfHeight);
        gl_matrix_1.vec2.set(this.points[3], -halfWidth, -halfHeight);
        return this.setNeedsUpdate();
    }
}
exports.Box = Box;
