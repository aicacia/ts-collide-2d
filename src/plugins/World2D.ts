import { Entity, Plugin, Time } from "@aicacia/engine";
import { World } from "../World";

export class World2D extends Plugin {
  static requiredPlugins = [Time];

  protected world: World<Entity>;

  constructor(world: World<Entity> = new World()) {
    super();

    this.world = world;
  }

  getWorld() {
    return this.world;
  }

  onUpdate() {
    this.world.update(this.getRequiredPlugin(Time).getDelta());
    return this;
  }
}
