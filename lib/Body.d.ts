/// <reference types="node" />
import { Option } from "@aicacia/core";
import { EventEmitter } from "events";
import { mat2d, vec2 } from "gl-matrix";
import { BodyEvent } from "./BodyEvent";
import { Shape } from "./shapes";
export interface Body<UserData> {
    on(event: BodyEvent.COLLIDING | BodyEvent.COLLIDE_START | BodyEvent.COLLIDE_END, listener: (this: Body<UserData>, otherBody: Body<UserData>, contact: Contact<UserData>) => void): this;
}
export declare class Body<UserData> extends EventEmitter {
    protected world: Option<World<UserData>>;
    protected userData: Option<UserData>;
    protected aabb: AABB2;
    protected position: vec2;
    protected rotation: number;
    protected matrix: mat2d;
    protected needsUpdate: boolean;
    protected aabbNeedsUpdate: boolean;
    protected shapes: Array<Shape<UserData>>;
    getUserData(): Option<UserData>;
    setUserData(userData: UserData): this;
    UNSAFE_setWorld(world: World<UserData>): this;
    UNSAFE_removeWorld(): this;
    getWorld(): Option<World<UserData>>;
    getAABB(): AABB2;
    getShapes(): ReadonlyArray<Shape<UserData>>;
    getPosition(): vec2;
    setPosition(position: vec2): this;
    getRotation(): number;
    setRotation(rotation: number): this;
    setNeedsUpdate(needsUpdate?: boolean): this;
    getNeedsUpdate(): boolean;
    setAABBNeedsUpdate(aabbNeedsUpdate?: boolean): this;
    getAABBNeedsUpdate(): boolean;
    getMatrix(): mat2d;
    updateMatrixIfNeeded(): this;
    updateMatrix(): this;
    updateAABBIfNeeded(): this;
    updateAABB(): this;
    addShapes(shapes: Array<Shape<UserData>>): this;
    addShape(...shapes: Array<Shape<UserData>>): this;
    private _addShape;
}
import { Contact } from "./phases/Contact";
import { World } from "./World";
import { AABB2 } from "./AABB2";
