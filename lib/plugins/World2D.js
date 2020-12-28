"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World2D = void 0;
const ecs_1 = require("@aicacia/ecs");
const ecs_game_1 = require("@aicacia/ecs-game");
const World_1 = require("../World");
class World2D extends ecs_1.Plugin {
    constructor(world = new World_1.World()) {
        super();
        this.world = world;
    }
    getWorld() {
        return this.world;
    }
    onUpdate() {
        this.world.update(this.getRequiredPlugin(ecs_game_1.Time).getDelta());
        return this;
    }
}
exports.World2D = World2D;
World2D.requiredPlugins = [ecs_game_1.Time];
