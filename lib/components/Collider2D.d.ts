import { Component, Entity } from "@aicacia/ecs";
import { Body } from "../Body";
import { BodyEvent } from "../BodyEvent";
import { Contact } from "../phases/Contact";
import { World2D } from "../plugins/World2D";
import { Collider2DManager } from "./Collider2DManager";
export interface Collider2D {
    on(event: "add-to-scene" | "remove-from-scene", listener: () => void): this;
    on(event: BodyEvent.COLLIDING | BodyEvent.COLLIDE_START | BodyEvent.COLLIDE_END, listener: (this: Collider2D, otherBody: Collider2D, contact: Contact<Entity>) => void): this;
}
export declare class Collider2D extends Component {
    static Manager: typeof Collider2DManager;
    static requiredPlugins: (typeof World2D)[];
    private body;
    constructor(body: Body<Entity>);
    getBody(): Body<Entity>;
    onAdd(): this;
    onRemove(): this;
    onUpdate(): this;
    private onColliding;
    private onCollideStart;
    private onCollideEnd;
}
