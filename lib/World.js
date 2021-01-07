"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = exports.DEFAULT_ANGULAR_DAMPING = exports.DEFAULT_LINEAR_DAMPING = void 0;
const hash_1 = require("@aicacia/hash");
const events_1 = require("events");
const BodyEvent_1 = require("./BodyEvent");
const BroadPhase_1 = require("./phases/BroadPhase");
const NarrowPhase_1 = require("./phases/NarrowPhase");
exports.DEFAULT_LINEAR_DAMPING = 0.01;
exports.DEFAULT_ANGULAR_DAMPING = Math.PI * 2.0 * exports.DEFAULT_LINEAR_DAMPING;
class World extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.bodies = [];
        this.bodiesToAdd = [];
        this.bodiesToRemove = [];
        this.broadPhase = new BroadPhase_1.BroadPhase();
        this.narrowPhase = new NarrowPhase_1.NarrowPhase();
        this.lastColliding = new Map();
        this.colliding = new Map();
        this.contacts = [];
    }
    addBodies(bodies) {
        this.bodiesToAdd.push(...bodies);
        return this;
    }
    addBody(...bodies) {
        return this.addBodies(bodies);
    }
    removeBodies(bodies) {
        this.bodiesToRemove.push(...bodies);
        return this;
    }
    removeBody(...bodies) {
        return this.removeBodies(bodies);
    }
    getBodies() {
        return this.bodies;
    }
    getContacts() {
        return this.contacts;
    }
    contains(point) {
        const shapes = [];
        for (const body of this.bodies) {
            for (const shape of body.getShapes()) {
                if (shape.contains(point)) {
                    shapes.push(shape);
                }
            }
        }
        return shapes;
    }
    maintain() {
        this.emit("maintain");
        this.bodiesToAdd.forEach((body) => this.addBodyNow(body));
        this.bodiesToAdd.length = 0;
        this.bodiesToRemove.forEach((body) => this.removeBodyNow(body));
        this.bodiesToRemove.length = 0;
        return this;
    }
    update(delta) {
        const lastColliding = this.lastColliding;
        this.emit("update", delta);
        this.maintain();
        const pairs = this.broadPhase.run(this.bodies), contacts = this.narrowPhase.run(pairs);
        this.lastColliding = this.colliding;
        lastColliding.clear();
        this.colliding = lastColliding;
        contacts.forEach((contact) => {
            const bi = contact.si.getBody().unwrap(), bj = contact.sj.getBody().unwrap(), hash = this.getHash(bi, bj), lastCollide = this.lastColliding.has(hash), newCollide = this.colliding.has(hash);
            if (lastCollide && !newCollide) {
                bi.emit(BodyEvent_1.BodyEvent.COLLIDING, bj, contact);
                bj.emit(BodyEvent_1.BodyEvent.COLLIDING, bi, contact);
            }
            if (!lastCollide && !newCollide) {
                bi.emit(BodyEvent_1.BodyEvent.COLLIDE_START, bj, contact);
                bj.emit(BodyEvent_1.BodyEvent.COLLIDE_START, bi, contact);
            }
            this.colliding.set(hash, contact);
        });
        for (const [hash, contact] of this.lastColliding.entries()) {
            if (!this.colliding.has(hash)) {
                const bi = contact.si.getBody().unwrap(), bj = contact.sj.getBody().unwrap();
                bi.emit(BodyEvent_1.BodyEvent.COLLIDE_END, bj, contact);
                bj.emit(BodyEvent_1.BodyEvent.COLLIDE_END, bi, contact);
            }
        }
        this.contacts = contacts;
        return this;
    }
    addBodyNow(body) {
        if (this.bodies.indexOf(body) === -1) {
            this.bodies.push(body);
            body.UNSAFE_setWorld(this);
        }
        return this;
    }
    removeBodyNow(body) {
        const index = this.bodies.indexOf(body);
        if (this.bodies.indexOf(body) !== -1) {
            this.bodies.splice(index, 1);
            body.UNSAFE_removeWorld();
        }
        return this;
    }
    getHash(a, b) {
        return hash_1.hash(a) + hash_1.hash(b);
    }
}
exports.World = World;
