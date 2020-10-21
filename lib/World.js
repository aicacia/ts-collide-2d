"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = exports.DEFAULT_ANGULAR_DAMPING = exports.DEFAULT_LINEAR_DAMPING = void 0;
var tslib_1 = require("tslib");
var hash_1 = require("@aicacia/hash");
var events_1 = require("events");
var BodyEvent_1 = require("./BodyEvent");
var BroadPhase_1 = require("./phases/BroadPhase");
var NarrowPhase_1 = require("./phases/NarrowPhase");
exports.DEFAULT_LINEAR_DAMPING = 0.01;
exports.DEFAULT_ANGULAR_DAMPING = Math.PI * 2.0 * exports.DEFAULT_LINEAR_DAMPING;
var World = /** @class */ (function (_super) {
    tslib_1.__extends(World, _super);
    function World() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bodies = [];
        _this.bodiesToAdd = [];
        _this.bodiesToRemove = [];
        _this.broadPhase = new BroadPhase_1.BroadPhase();
        _this.narrowPhase = new NarrowPhase_1.NarrowPhase();
        _this.lastColliding = new Map();
        _this.colliding = new Map();
        return _this;
    }
    World.prototype.addBodies = function (bodies) {
        var _a;
        (_a = this.bodiesToAdd).push.apply(_a, tslib_1.__spread(bodies));
        return this;
    };
    World.prototype.addBody = function () {
        var bodies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bodies[_i] = arguments[_i];
        }
        return this.addBodies(bodies);
    };
    World.prototype.removeBodies = function (bodies) {
        var _a;
        (_a = this.bodiesToRemove).push.apply(_a, tslib_1.__spread(bodies));
        return this;
    };
    World.prototype.removeBody = function () {
        var bodies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bodies[_i] = arguments[_i];
        }
        return this.removeBodies(bodies);
    };
    World.prototype.getBodies = function () {
        return this.bodies;
    };
    World.prototype.maintain = function () {
        var _this = this;
        this.emit("maintain");
        this.bodiesToAdd.forEach(function (body) { return _this.addBodyNow(body); });
        this.bodiesToAdd.length = 0;
        this.bodiesToRemove.forEach(function (body) { return _this.removeBodyNow(body); });
        this.bodiesToRemove.length = 0;
        return this;
    };
    World.prototype.update = function (delta) {
        var e_1, _a;
        var _this = this;
        var lastColliding = this.lastColliding;
        this.emit("update", delta);
        this.maintain();
        var pairs = this.broadPhase.run(this.bodies), contacts = this.narrowPhase.run(pairs);
        this.lastColliding = this.colliding;
        lastColliding.clear();
        this.colliding = lastColliding;
        contacts.forEach(function (contact) {
            var bi = contact.si.getBody().unwrap(), bj = contact.sj.getBody().unwrap(), hash = _this.getHash(bi, bj), lastCollide = _this.lastColliding.has(hash), newCollide = _this.colliding.has(hash);
            if (lastCollide && !newCollide) {
                bi.emit(BodyEvent_1.BodyEvent.COLLIDING, bj, contact);
                bj.emit(BodyEvent_1.BodyEvent.COLLIDING, bi, contact);
            }
            if (!lastCollide && !newCollide) {
                bi.emit(BodyEvent_1.BodyEvent.COLLIDE_START, bj, contact);
                bj.emit(BodyEvent_1.BodyEvent.COLLIDE_START, bi, contact);
            }
            _this.colliding.set(hash, contact);
        });
        try {
            for (var _b = tslib_1.__values(this.lastColliding.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), hash_2 = _d[0], contact = _d[1];
                if (!this.colliding.has(hash_2)) {
                    var bi = contact.si.getBody().unwrap(), bj = contact.sj.getBody().unwrap();
                    bi.emit(BodyEvent_1.BodyEvent.COLLIDE_END, bj, contact);
                    bj.emit(BodyEvent_1.BodyEvent.COLLIDE_END, bi, contact);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    World.prototype.addBodyNow = function (body) {
        if (this.bodies.indexOf(body) === -1) {
            this.bodies.push(body);
            body.UNSAFE_setWorld(this);
        }
        return this;
    };
    World.prototype.removeBodyNow = function (body) {
        var index = this.bodies.indexOf(body);
        if (this.bodies.indexOf(body) !== -1) {
            this.bodies.splice(index, 1);
            body.UNSAFE_removeWorld();
        }
        return this;
    };
    World.prototype.getHash = function (a, b) {
        return hash_1.hash(a) + hash_1.hash(b);
    };
    return World;
}(events_1.EventEmitter));
exports.World = World;
