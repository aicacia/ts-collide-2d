"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravityUniversal = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var BodyType_1 = require("./BodyType");
var Constraint_1 = require("./Constraint");
var VEC2_0 = gl_matrix_1.vec2.create();
var GravityUniversal = /** @class */ (function (_super) {
    tslib_1.__extends(GravityUniversal, _super);
    function GravityUniversal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gravity = gl_matrix_1.vec2.fromValues(0, -9.801);
        return _this;
    }
    GravityUniversal.prototype.update = function (delta) {
        var _this = this;
        this.getWorld().ifSome(function (world) {
            var gravityVelocity = gl_matrix_1.vec2.scale(VEC2_0, _this.gravity, delta);
            world.getBodies().forEach(function (body) {
                if (body.getType() === BodyType_1.BodyType.Dynamic) {
                    var velocity = body.getVelocity();
                    gl_matrix_1.vec2.add(velocity, velocity, gravityVelocity);
                }
            });
        });
        return this;
    };
    return GravityUniversal;
}(Constraint_1.Constraint));
exports.GravityUniversal = GravityUniversal;
