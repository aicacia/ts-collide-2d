"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var gl_matrix_1 = require("gl-matrix");
var engine_1 = require("@aicacia/engine");
var AABB2_1 = require("../AABB2");
var VEC2_SCALE_0 = gl_matrix_1.vec2.fromValues(1, 1), MAT2D_0 = gl_matrix_1.mat2d.create();
var Shape = /** @class */ (function (_super) {
    tslib_1.__extends(Shape, _super);
    function Shape() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.body = core_1.none();
        _this.aabb = AABB2_1.AABB2.create();
        _this.matrix = gl_matrix_1.mat2d.create();
        _this.localPosition = gl_matrix_1.vec2.create();
        _this.localRotation = 0;
        _this.position = gl_matrix_1.vec2.create();
        _this.rotation = 0;
        _this.needsUpdate = true;
        _this.filterMask = 1;
        _this.filterGroup = 1;
        _this.density = 1.0;
        _this.friction = 0.5;
        _this.elasticity = 0.25;
        return _this;
    }
    Shape.prototype.UNSAFE_setBody = function (body) {
        this.body = core_1.some(body);
        return this;
    };
    Shape.prototype.getBody = function () {
        return this.body;
    };
    Shape.prototype.getFilterMask = function () {
        return this.filterMask;
    };
    Shape.prototype.setFilterMask = function (filterMask) {
        this.filterMask = filterMask;
        return this;
    };
    Shape.prototype.getFilterGroup = function () {
        return this.filterGroup;
    };
    Shape.prototype.setFilterGroup = function (filterGroup) {
        this.filterGroup = filterGroup;
        return this;
    };
    Shape.prototype.getDensity = function () {
        return this.density;
    };
    Shape.prototype.setDensity = function (density) {
        this.density = density;
        return this;
    };
    Shape.prototype.getFriction = function () {
        return this.friction;
    };
    Shape.prototype.setFriction = function (friction) {
        this.friction = friction;
        return this;
    };
    Shape.prototype.getElasticity = function () {
        return this.elasticity;
    };
    Shape.prototype.setElasticity = function (elasticity) {
        this.elasticity = elasticity;
        return this;
    };
    Shape.prototype.getAABB = function () {
        return this.updateIfNeeded().aabb;
    };
    Shape.prototype.getPosition = function () {
        return this.updateIfNeeded().position;
    };
    Shape.prototype.getLocalPosition = function () {
        return this.position;
    };
    Shape.prototype.setLocalPosition = function (position) {
        gl_matrix_1.vec2.copy(this.localPosition, position);
        return this.setNeedsUpdate();
    };
    Shape.prototype.getLocalRotation = function () {
        return this.localRotation;
    };
    Shape.prototype.getRotation = function () {
        return this.updateIfNeeded().rotation;
    };
    Shape.prototype.setLocalRotation = function (localRotation) {
        this.localRotation = localRotation;
        return this.setNeedsUpdate();
    };
    Shape.prototype.setNeedsUpdate = function (needsUpdate) {
        if (needsUpdate === void 0) { needsUpdate = true; }
        if (needsUpdate !== this.needsUpdate) {
            this.needsUpdate = needsUpdate;
            this.body.map(function (body) { return body.setAABBNeedsUpdate(needsUpdate); });
        }
        return this;
    };
    Shape.prototype.getNeedsUpdate = function () {
        return this.needsUpdate;
    };
    Shape.prototype.getMatrix = function () {
        return this.updateIfNeeded().matrix;
    };
    Shape.prototype.updateIfNeeded = function () {
        if (this.getNeedsUpdate()) {
            return this.update();
        }
        else {
            return this;
        }
    };
    Shape.prototype.update = function () {
        var _this = this;
        this.needsUpdate = false;
        var localMatrix = engine_1.composeMat2d(MAT2D_0, this.localPosition, VEC2_SCALE_0, this.localRotation);
        this.body
            .ifSome(function (body) { return gl_matrix_1.mat2d.mul(_this.matrix, body.getMatrix(), localMatrix); })
            .ifNone(function () { return gl_matrix_1.mat2d.copy(_this.matrix, localMatrix); });
        this.rotation = engine_1.decomposeMat2d(this.matrix, this.position, VEC2_SCALE_0);
        return this;
    };
    return Shape;
}(events_1.EventEmitter));
exports.Shape = Shape;
