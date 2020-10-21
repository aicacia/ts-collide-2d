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
    addBodies(bodies: Array<Body<UserData>>): this;
    addBody(...bodies: Array<Body<UserData>>): this;
    removeBodies(bodies: Array<Body<UserData>>): this;
    removeBody(...bodies: Array<Body<UserData>>): this;
    getBodies(): Body<UserData>[];
    maintain(): this;
    update(delta: number): this;
    private addBodyNow;
    private removeBodyNow;
    private getHash;
}
import { Body } from "./Body";
