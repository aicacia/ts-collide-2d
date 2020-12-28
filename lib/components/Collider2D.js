"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collider2D = void 0;
const ecs_1 = require("@aicacia/ecs");
const ecs_game_1 = require("@aicacia/ecs-game");
const BodyEvent_1 = require("../BodyEvent");
const World2D_1 = require("../plugins/World2D");
const Collider2DManager_1 = require("./Collider2DManager");
class Collider2D extends ecs_1.Component {
    constructor(body) {
        super();
        this.onColliding = (body, contact) => this.emit(BodyEvent_1.BodyEvent.COLLIDING, body.getUserData().unwrap().getRequiredComponent(Collider2D), contact);
        this.onCollideStart = (body, contact) => this.emit(BodyEvent_1.BodyEvent.COLLIDE_START, body.getUserData().unwrap().getRequiredComponent(Collider2D), contact);
        this.onCollideEnd = (body, contact) => this.emit(BodyEvent_1.BodyEvent.COLLIDE_END, body.getUserData().unwrap().getRequiredComponent(Collider2D), contact);
        this.body = body;
    }
    getBody() {
        return this.body;
    }
    onAdd() {
        this.body.setUserData(this.getRequiredEntity());
        ecs_game_1.TransformComponent.getTransform(this.getRequiredEntity()).ifSome((transform) => {
            transform.getLocalPosition2(this.body.getPosition());
            this.body.setRotation(transform.getLocalRotationZ());
        });
        this.getRequiredPlugin(World2D_1.World2D).getWorld().addBody(this.body);
        this.body.on(BodyEvent_1.BodyEvent.COLLIDING, this.onColliding);
        this.body.on(BodyEvent_1.BodyEvent.COLLIDE_START, this.onCollideStart);
        this.body.on(BodyEvent_1.BodyEvent.COLLIDE_END, this.onCollideEnd);
        return this;
    }
    onRemove() {
        this.body.off(BodyEvent_1.BodyEvent.COLLIDING, this.onColliding);
        this.body.off(BodyEvent_1.BodyEvent.COLLIDE_START, this.onCollideStart);
        this.body.off(BodyEvent_1.BodyEvent.COLLIDE_END, this.onCollideEnd);
        this.getRequiredPlugin(World2D_1.World2D).getWorld().removeBody(this.body);
        return this;
    }
    onUpdate() {
        ecs_game_1.TransformComponent.getTransform(this.getRequiredEntity()).ifSome((transform) => {
            transform.getLocalPosition2(this.body.getPosition());
            this.body.setRotation(transform.getLocalRotationZ());
        });
        return this;
    }
}
exports.Collider2D = Collider2D;
Collider2D.Manager = Collider2DManager_1.Collider2DManager;
Collider2D.requiredPlugins = [World2D_1.World2D];
