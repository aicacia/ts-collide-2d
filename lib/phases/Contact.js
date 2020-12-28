"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const gl_matrix_1 = require("gl-matrix");
class Contact {
    constructor(si, sj, position, normal, depth) {
        this.position = gl_matrix_1.vec2.create();
        this.normal = gl_matrix_1.vec2.create();
        this.depth = 0.0;
        this.si = si;
        this.sj = sj;
        gl_matrix_1.vec2.copy(this.position, position);
        gl_matrix_1.vec2.copy(this.normal, normal);
        this.depth = depth;
    }
}
exports.Contact = Contact;
