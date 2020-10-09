/// <reference types="node" />
import { Option } from "@aicacia/core";
import { EventEmitter } from "events";
import { World } from "./World";
export declare abstract class Constraint<UserData> extends EventEmitter {
    protected world: Option<World<UserData>>;
    UNSAFE_setWorld(world: World<UserData>): this;
    UNSAFE_removeWorld(): this;
    getWorld(): Option<World<UserData>>;
    abstract update(delta: number): this;
}
