import { Entity, Plugin } from "@aicacia/ecs";
import { Time } from "@aicacia/ecs-game";
import { World } from "../World";
export declare class World2D extends Plugin {
    static requiredPlugins: (typeof Time)[];
    protected world: World<Entity>;
    constructor(world?: World<Entity>);
    getWorld(): World<Entity>;
    onUpdate(): this;
}
