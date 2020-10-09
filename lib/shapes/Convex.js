"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convex = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var AABB2_1 = require("../AABB2");
var Shape_1 = require("./Shape");
var Convex = /** @class */ (function (_super) {
    tslib_1.__extends(Convex, _super);
    function Convex() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.localPoints = [];
        _this.points = [];
        return _this;
    }
    Convex.prototype.getPoints = function () {
        return this.points;
    };
    Convex.prototype.setPoints = function (localPoints) {
        this.localPoints = localPoints;
        this.points.length = 0;
        localPoints.reduce(function (points, localPoint) {
            points.push(gl_matrix_1.vec2.copy(gl_matrix_1.vec2.create(), localPoint));
            return points;
        }, this.points);
        return this.setNeedsUpdate();
    };
    Convex.prototype.getCentroid = function (out) {
        gl_matrix_1.vec2.copy(out, this.localPosition);
        this.localPoints.forEach(function (localPoint) {
            gl_matrix_1.vec2.min(out, out, localPoint);
            gl_matrix_1.vec2.max(out, out, localPoint);
        });
        return out;
    };
    Convex.prototype.getArea = function () {
        var area = 0.0, j = this.localPoints.length - 1;
        for (var i = 0; i < this.localPoints.length; i++) {
            var prev = this.localPoints[j], next = this.localPoints[i];
            area += (prev[0] + next[0]) * (prev[1] - next[1]);
            j = i;
        }
        return area;
    };
    Convex.prototype.getInertia = function (_mass) {
        var inertia = 0.0, j = this.localPoints.length - 1;
        for (var i = 0; i < this.localPoints.length; i++) {
            var prev = this.localPoints[j], next = this.localPoints[i], area = triangleArea(prev, next), mass = this.density * area;
            inertia += triangleInertia(prev, next, mass);
            j = i;
        }
        return inertia;
    };
    Convex.prototype.update = function () {
        var _this = this;
        _super.prototype.update.call(this);
        this.localPoints.forEach(function (localPoint, index) {
            var point = gl_matrix_1.vec2.transformMat2d(_this.points[index], localPoint, _this.matrix);
            AABB2_1.AABB2.expandPoint(_this.aabb, _this.aabb, point);
        });
        return this;
    };
    return Convex;
}(Shape_1.Shape));
exports.Convex = Convex;
function triangleArea(a, b) {
    return (a[0] * b[1] - a[1] * b[0]) * 0.5;
}
function triangleInertia(a, b, triangleMass) {
    return ((triangleMass / 6) * (gl_matrix_1.vec2.dot(a, a) + gl_matrix_1.vec2.dot(b, b) + gl_matrix_1.vec2.dot(a, b)));
}
