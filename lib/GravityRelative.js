"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravityRelative = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var BodyType_1 = require("./BodyType");
var Constraint_1 = require("./Constraint");
var VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create();
var GravityRelative = /** @class */ (function (_super) {
    tslib_1.__extends(GravityRelative, _super);
    function GravityRelative(body) {
        var _this = _super.call(this) || this;
        _this.constaint = GravityRelative.G;
        _this.body = body;
        return _this;
    }
    GravityRelative.prototype.getConstaint = function () {
        return this.constaint;
    };
    GravityRelative.prototype.setConstaint = function (constaint) {
        this.constaint = constaint;
        return this;
    };
    GravityRelative.prototype.getBody = function () {
        return this.body;
    };
    GravityRelative.prototype.setBody = function (body) {
        this.body = body;
        return this;
    };
    GravityRelative.prototype.update = function (delta) {
        var _this = this;
        this.getWorld().ifSome(function (world) {
            var massA = _this.body.getMass(), positionA = _this.body.getPosition();
            world.getBodies().forEach(function (bodyB) {
                if (bodyB.getType() === BodyType_1.BodyType.Dynamic) {
                    var positionB = bodyB.getPosition(), direction = gl_matrix_1.vec2.subtract(VEC2_0, positionA, positionB), rsq = gl_matrix_1.vec2.squaredLength(direction);
                    if (rsq > 0) {
                        var bodyVelocity = bodyB.getVelocity(), invRsq = 1.0 / rsq, linearVelocity = _this.constaint * massA * invRsq * delta, gravityVelocity = gl_matrix_1.vec2.scale(VEC2_1, gl_matrix_1.vec2.normalize(direction, direction), linearVelocity);
                        gl_matrix_1.vec2.add(bodyVelocity, bodyVelocity, gravityVelocity);
                    }
                }
            });
        });
        return this;
    };
    GravityRelative.G = 6.6743e-11;
    return GravityRelative;
}(Constraint_1.Constraint));
exports.GravityRelative = GravityRelative;
