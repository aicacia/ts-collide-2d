import { Entity, Plugin, Time } from "@aicacia/engine";
import { World } from "../World";
export declare class World2D extends Plugin {
    static requiredPlugins: (typeof Time)[];
    protected world: World<Entity>;
    constructor(world?: World<Entity>);
    getWorld(): World<Entity>;
    onUpdate(): this;
}
