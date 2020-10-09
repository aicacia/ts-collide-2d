"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var Shape_1 = require("./Shape");
var Circle = /** @class */ (function (_super) {
    tslib_1.__extends(Circle, _super);
    function Circle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radius = 0.5;
        return _this;
    }
    Circle.prototype.getRadius = function () {
        return this.radius;
    };
    Circle.prototype.setRadius = function (radius) {
        this.radius = radius;
        return this.setNeedsUpdate();
    };
    Circle.prototype.getCentroid = function (out) {
        return gl_matrix_1.vec2.copy(out, this.localPosition);
    };
    Circle.prototype.getArea = function () {
        return this.radius * this.radius * Math.PI;
    };
    Circle.prototype.getInertia = function (mass) {
        return (mass *
            (this.radius * this.radius * 0.5 +
                gl_matrix_1.vec2.dot(this.localPosition, this.localPosition)));
    };
    Circle.prototype.update = function () {
        _super.prototype.update.call(this);
        this.aabb.min[0] = this.position[0] - this.radius;
        this.aabb.min[1] = this.position[1] - this.radius;
        this.aabb.max[0] = this.position[0] + this.radius;
        this.aabb.max[1] = this.position[1] + this.radius;
        return this;
    };
    return Circle;
}(Shape_1.Shape));
exports.Circle = Circle;
