"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var Convex_1 = require("./Convex");
var Box = /** @class */ (function (_super) {
    tslib_1.__extends(Box, _super);
    function Box() {
        var _this = _super.call(this) || this;
        _this.setPoints([
            gl_matrix_1.vec2.fromValues(-0.5, 0.5),
            gl_matrix_1.vec2.fromValues(0.5, 0.5),
            gl_matrix_1.vec2.fromValues(0.5, -0.5),
            gl_matrix_1.vec2.fromValues(-0.5, -0.5),
        ]);
        return _this;
    }
    Box.prototype.set = function (width, height) {
        var halfWidth = width * 0.5, halfHeight = height * 0.5;
        gl_matrix_1.vec2.set(this.points[0], -halfWidth, halfHeight);
        gl_matrix_1.vec2.set(this.points[1], halfWidth, halfHeight);
        gl_matrix_1.vec2.set(this.points[2], halfWidth, -halfHeight);
        gl_matrix_1.vec2.set(this.points[3], -halfWidth, -halfHeight);
        return this.setNeedsUpdate();
    };
    return Box;
}(Convex_1.Convex));
exports.Box = Box;
