"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var gl_matrix_1 = require("gl-matrix");
var engine_1 = require("@aicacia/engine");
var VEC2_SCALE_0 = gl_matrix_1.vec2.fromValues(1, 1);
var Body = /** @class */ (function (_super) {
    tslib_1.__extends(Body, _super);
    function Body() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = core_1.none();
        _this.userData = core_1.none();
        _this.aabb = AABB2_1.AABB2.create();
        _this.position = gl_matrix_1.vec2.create();
        _this.rotation = 0;
        _this.matrix = gl_matrix_1.mat2d.create();
        _this.needsUpdate = false;
        _this.aabbNeedsUpdate = false;
        _this.shapes = [];
        return _this;
    }
    Body.prototype.getUserData = function () {
        return this.userData;
    };
    Body.prototype.setUserData = function (userData) {
        this.userData.replace(userData);
        return this;
    };
    Body.prototype.UNSAFE_setWorld = function (world) {
        this.world.replace(world);
        return this;
    };
    Body.prototype.UNSAFE_removeWorld = function () {
        this.world.take();
        return this;
    };
    Body.prototype.getWorld = function () {
        return this.world;
    };
    Body.prototype.getAABB = function () {
        return this.updateAABBIfNeeded().aabb;
    };
    Body.prototype.getShapes = function () {
        return this.shapes;
    };
    Body.prototype.getPosition = function () {
        return this.position;
    };
    Body.prototype.setPosition = function (position) {
        gl_matrix_1.vec2.copy(this.position, position);
        return this.setNeedsUpdate();
    };
    Body.prototype.getRotation = function () {
        return this.rotation;
    };
    Body.prototype.setRotation = function (rotation) {
        this.rotation = rotation;
        return this.setNeedsUpdate();
    };
    Body.prototype.setNeedsUpdate = function (needsUpdate) {
        if (needsUpdate === void 0) { needsUpdate = true; }
        if (needsUpdate !== this.needsUpdate) {
            this.needsUpdate = needsUpdate;
            this.setAABBNeedsUpdate(needsUpdate);
        }
        return this;
    };
    Body.prototype.getNeedsUpdate = function () {
        return this.needsUpdate;
    };
    Body.prototype.setAABBNeedsUpdate = function (aabbNeedsUpdate) {
        if (aabbNeedsUpdate === void 0) { aabbNeedsUpdate = true; }
        if (aabbNeedsUpdate !== this.aabbNeedsUpdate) {
            this.aabbNeedsUpdate = aabbNeedsUpdate;
            this.shapes.forEach(function (shape) { return shape.setNeedsUpdate(aabbNeedsUpdate); });
        }
        return this;
    };
    Body.prototype.getAABBNeedsUpdate = function () {
        return this.aabbNeedsUpdate;
    };
    Body.prototype.getMatrix = function () {
        return this.updateMatrixIfNeeded().matrix;
    };
    Body.prototype.updateMatrixIfNeeded = function () {
        if (this.getNeedsUpdate()) {
            return this.updateMatrix();
        }
        else {
            return this;
        }
    };
    Body.prototype.updateMatrix = function () {
        this.needsUpdate = false;
        engine_1.composeMat2d(this.matrix, this.position, VEC2_SCALE_0, this.rotation);
        return this;
    };
    Body.prototype.updateAABBIfNeeded = function () {
        if (this.getAABBNeedsUpdate()) {
            return this.updateAABB();
        }
        else {
            return this;
        }
    };
    Body.prototype.updateAABB = function () {
        this.aabbNeedsUpdate = false;
        this.shapes.reduce(function (aabb, shape) {
            AABB2_1.AABB2.union(aabb, aabb, shape.getAABB());
            return aabb;
        }, AABB2_1.AABB2.identity(this.aabb));
        return this;
    };
    Body.prototype.addShapes = function (shapes) {
        var _this = this;
        shapes.forEach(function (shape) { return _this._addShape(shape); });
        return this;
    };
    Body.prototype.addShape = function () {
        var shapes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            shapes[_i] = arguments[_i];
        }
        return this.addShapes(shapes);
    };
    Body.prototype._addShape = function (shape) {
        shape.UNSAFE_setBody(this);
        this.shapes.push(shape);
        return this;
    };
    return Body;
}(events_1.EventEmitter));
exports.Body = Body;
var AABB2_1 = require("./AABB2");
