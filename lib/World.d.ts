/// <reference types="node" />
import { EventEmitter } from "events";
import { BroadPhase } from "./phases/BroadPhase";
import { Contact } from "./phases/Contact";
import { NarrowPhase } from "./phases/NarrowPhase";
export declare const DEFAULT_LINEAR_DAMPING = 0.01;
export declare const DEFAULT_ANGULAR_DAMPING: number;
export declare class World<UserData> extends EventEmitter {
    protected bodies: Array<Body<UserData>>;
    protected bodiesToAdd: Array<Body<UserData>>;
    protected bodiesToRemove: Array<Body<UserData>>;
    protected broadPhase: BroadPhase<UserData>;
    protected narrowPhase: NarrowPhase<UserData>;
    protected lastColliding: Map<number, Contact<UserData>>;
    protected colliding: Map<number, Contact<UserData>>;
    protected contacts: Contact<UserData>[];
    addBodies(bodies: Array<Body<UserData>>): this;
    addBody(...bodies: Array<Body<UserData>>): this;
    removeBodies(bodies: Array<Body<UserData>>): this;
    removeBody(...bodies: Array<Body<UserData>>): this;
    getBodies(): ReadonlyArray<Body<UserData>>;
    getContacts(): ReadonlyArray<Contact<UserData>>;
    contains(point: vec2): Shape<UserData>[];
    maintain(): this;
    update(delta: number): this;
    private addBodyNow;
    private removeBodyNow;
    private getHash;
}
import { Body } from "./Body";
import { vec2 } from "gl-matrix";
import { Shape } from "./shapes";
