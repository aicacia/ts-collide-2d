"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var gl_matrix_1 = require("gl-matrix");
var engine_1 = require("@aicacia/engine");
var BodyType_1 = require("./BodyType");
var VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create(), VEC2_SCALE_0 = gl_matrix_1.vec2.fromValues(1, 1);
var Body = /** @class */ (function (_super) {
    tslib_1.__extends(Body, _super);
    function Body() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = BodyType_1.BodyType.Dynamic;
        _this.world = core_1.none();
        _this.userData = core_1.none();
        _this.velocity = gl_matrix_1.vec2.create();
        _this.angularVelocity = 0;
        _this.linearDamping = core_1.none();
        _this.angularDamping = core_1.none();
        _this.mass = 1.0;
        _this.invMass = 1.0;
        _this.inertia = 0.0;
        _this.invInertia = 0.0;
        _this.aabb = AABB2_1.AABB2.create();
        _this.position = gl_matrix_1.vec2.create();
        _this.rotation = 0;
        _this.matrix = gl_matrix_1.mat2d.create();
        _this.needsUpdate = false;
        _this.aabbNeedsUpdate = false;
        _this.shapes = [];
        return _this;
    }
    Body.prototype.getType = function () {
        return this.type;
    };
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
        return this.resetMassData();
    };
    Body.prototype.addShape = function () {
        var shapes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            shapes[_i] = arguments[_i];
        }
        return this.addShapes(shapes);
    };
    Body.prototype.setType = function (type) {
        if (type !== this.type) {
            this.type = type;
            return this.resetMassData();
        }
        else {
            return this;
        }
    };
    Body.prototype.getLinearDamping = function () {
        var _this = this;
        return this.linearDamping.unwrapOrElse(function () {
            return _this.world
                .map(function (world) { return world.getLinearDamping(); })
                .unwrapOr(World_1.DEFAULT_LINEAR_DAMPING);
        });
    };
    Body.prototype.setLinearDamping = function (linearDamping) {
        this.linearDamping.replace(linearDamping);
        return this;
    };
    Body.prototype.getAngularDamping = function () {
        var _this = this;
        return this.angularDamping.unwrapOrElse(function () {
            return _this.world
                .map(function (world) { return world.getAngularDamping(); })
                .unwrapOr(World_1.DEFAULT_ANGULAR_DAMPING);
        });
    };
    Body.prototype.setAngularDamping = function (angularDamping) {
        this.angularDamping.replace(angularDamping);
        return this;
    };
    Body.prototype.getVelocity = function () {
        return this.velocity;
    };
    Body.prototype.setVelocity = function (velocity) {
        gl_matrix_1.vec2.copy(this.velocity, velocity);
        return this;
    };
    Body.prototype.addVelocity = function (velocity) {
        gl_matrix_1.vec2.add(this.velocity, this.velocity, velocity);
        return this;
    };
    Body.prototype.getAngularVelocity = function () {
        return this.angularVelocity;
    };
    Body.prototype.setAngularVelocity = function (angularVelocity) {
        this.angularVelocity = angularVelocity;
        return this;
    };
    Body.prototype.addAngularVelocity = function (angularVelocity) {
        this.angularVelocity += angularVelocity;
        return this;
    };
    Body.prototype.update = function (delta) {
        switch (this.type) {
            case BodyType_1.BodyType.Static: {
                break;
            }
            default: {
                gl_matrix_1.vec2.add(this.position, this.position, gl_matrix_1.vec2.scale(VEC2_0, this.velocity, delta));
                this.rotation += this.angularVelocity * delta;
                gl_matrix_1.vec2.scale(this.velocity, this.velocity, 1.0 - this.getLinearDamping());
                this.angularVelocity =
                    this.angularVelocity * (1.0 - this.getAngularDamping());
                this.setNeedsUpdate();
                break;
            }
        }
        return this;
    };
    Body.prototype.getMass = function () {
        return this.mass;
    };
    Body.prototype.getInvMass = function () {
        return this.invMass;
    };
    Body.prototype.setMass = function (mass) {
        if (this.mass !== mass && mass > 0) {
            this.mass = mass;
            this.invMass = 1.0 / mass;
        }
        return this;
    };
    Body.prototype.getInertia = function () {
        return this.inertia;
    };
    Body.prototype.getInvInertia = function () {
        return this.invInertia;
    };
    Body.prototype.setInertia = function (inertia) {
        if (this.inertia !== inertia && inertia > 0) {
            this.inertia = inertia;
            this.invInertia = 1.0 / inertia;
        }
        return this;
    };
    Body.prototype.resetMassData = function () {
        if (this.type !== BodyType_1.BodyType.Static) {
            var totalCentroid_1 = gl_matrix_1.vec2.zero(VEC2_0);
            var totalMass_1 = 0.0, totalInertia_1 = 0.0;
            this.shapes.forEach(function (shape) {
                var centroid = shape.getCentroid(VEC2_1), mass = shape.getArea() * shape.getDensity(), inertia = shape.getInertia(mass);
                gl_matrix_1.vec2.add(totalCentroid_1, totalCentroid_1, gl_matrix_1.vec2.scale(centroid, centroid, mass));
                totalMass_1 += mass;
                totalInertia_1 += inertia;
            });
            this.setMass(totalMass_1);
            gl_matrix_1.vec2.copy(totalCentroid_1, gl_matrix_1.vec2.scale(totalCentroid_1, totalCentroid_1, this.invMass));
            this.setMass(totalMass_1);
            this.setInertia(totalInertia_1 - totalMass_1 * gl_matrix_1.vec2.squaredLength(totalCentroid_1));
        }
        return this;
    };
    Body.prototype._addShape = function (shape) {
        shape.UNSAFE_setBody(this);
        this.shapes.push(shape);
        return this;
    };
    return Body;
}(events_1.EventEmitter));
exports.Body = Body;
var World_1 = require("./World");
var AABB2_1 = require("./AABB2");
