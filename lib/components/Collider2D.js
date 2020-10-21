"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collider2D = void 0;
var tslib_1 = require("tslib");
var engine_1 = require("@aicacia/engine");
var BodyEvent_1 = require("../BodyEvent");
var World2D_1 = require("../plugins/World2D");
var Collider2DManager_1 = require("./Collider2DManager");
var Collider2D = /** @class */ (function (_super) {
    tslib_1.__extends(Collider2D, _super);
    function Collider2D(body) {
        var _this = _super.call(this) || this;
        _this.onColliding = function (body, contact) {
            return _this.emit(BodyEvent_1.BodyEvent.COLLIDING, body.getUserData().unwrap().getRequiredComponent(Collider2D), contact);
        };
        _this.onCollideStart = function (body, contact) {
            return _this.emit(BodyEvent_1.BodyEvent.COLLIDE_START, body.getUserData().unwrap().getRequiredComponent(Collider2D), contact);
        };
        _this.onCollideEnd = function (body, contact) {
            return _this.emit(BodyEvent_1.BodyEvent.COLLIDE_END, body.getUserData().unwrap().getRequiredComponent(Collider2D), contact);
        };
        _this.body = body;
        return _this;
    }
    Collider2D.prototype.getBody = function () {
        return this.body;
    };
    Collider2D.prototype.onAdd = function () {
        var _this = this;
        this.body.setUserData(this.getRequiredEntity());
        engine_1.TransformComponent.getTransform(this.getRequiredEntity()).ifSome(function (transform) {
            transform.getLocalPosition2(_this.body.getPosition());
            _this.body.setRotation(transform.getLocalRotationZ());
        });
        this.getRequiredPlugin(World2D_1.World2D).getWorld().addBody(this.body);
        this.body.on(BodyEvent_1.BodyEvent.COLLIDING, this.onColliding);
        this.body.on(BodyEvent_1.BodyEvent.COLLIDE_START, this.onCollideStart);
        this.body.on(BodyEvent_1.BodyEvent.COLLIDE_END, this.onCollideEnd);
        return this;
    };
    Collider2D.prototype.onRemove = function () {
        this.body.off(BodyEvent_1.BodyEvent.COLLIDING, this.onColliding);
        this.body.off(BodyEvent_1.BodyEvent.COLLIDE_START, this.onCollideStart);
        this.body.off(BodyEvent_1.BodyEvent.COLLIDE_END, this.onCollideEnd);
        this.getRequiredPlugin(World2D_1.World2D).getWorld().removeBody(this.body);
        return this;
    };
    Collider2D.prototype.onUpdate = function () {
        var _this = this;
        engine_1.TransformComponent.getTransform(this.getRequiredEntity()).ifSome(function (transform) {
            transform.getLocalPosition2(_this.body.getPosition());
            _this.body.setRotation(transform.getLocalRotationZ());
        });
        return this;
    };
    Collider2D.Manager = Collider2DManager_1.Collider2DManager;
    Collider2D.requiredPlugins = [World2D_1.World2D];
    return Collider2D;
}(engine_1.Component));
exports.Collider2D = Collider2D;
