import { Component, Entity, TransformComponent } from "@aicacia/engine";
import { Body } from "../Body";
import { BodyEvent } from "../BodyEvent";
import { Contact } from "../phases/Contact";
import { World2D } from "../plugins/World2D";
import { Collider2DManager } from "./Collider2DManager";

// tslint:disable-next-line: interface-name
export interface Collider2D {
  on(event: "add-to-scene" | "remove-from-scene", listener: () => void): this;
  on(
    event:
      | BodyEvent.COLLIDING
      | BodyEvent.COLLIDE_START
      | BodyEvent.COLLIDE_END,
    listener: (
      this: Collider2D,
      otherBody: Collider2D,
      contact: Contact<Entity>
    ) => void
  ): this;
}

export class Collider2D extends Component {
  static Manager = Collider2DManager;
  static requiredPlugins = [World2D];

  private body: Body<Entity>;

  constructor(body: Body<Entity>) {
    super();

    this.body = body;
  }

  getBody() {
    return this.body;
  }

  onAdd() {
    this.body.setUserData(this.getRequiredEntity());

    TransformComponent.getTransform(this.getRequiredEntity()).ifSome(
      (transform) => {
        transform.getLocalPosition2(this.body.getPosition());
        this.body.setRotation(transform.getLocalRotationZ());
      }
    );

    this.getRequiredPlugin(World2D).getWorld().addBody(this.body);

    this.body.on(BodyEvent.COLLIDING, this.onColliding);
    this.body.on(BodyEvent.COLLIDE_START, this.onCollideStart);
    this.body.on(BodyEvent.COLLIDE_END, this.onCollideEnd);

    return this;
  }

  onRemove() {
    this.body.off(BodyEvent.COLLIDING, this.onColliding);
    this.body.off(BodyEvent.COLLIDE_START, this.onCollideStart);
    this.body.off(BodyEvent.COLLIDE_END, this.onCollideEnd);

    this.getRequiredPlugin(World2D).getWorld().removeBody(this.body);
    return this;
  }

  onUpdate() {
    TransformComponent.getTransform(this.getRequiredEntity()).ifSome(
      (transform) => {
        transform.getLocalPosition2(this.body.getPosition());
        this.body.setRotation(transform.getLocalRotationZ());
      }
    );
    return this;
  }

  private onColliding = (body: Body<Entity>, contact: Contact<Entity>) =>
    this.emit(
      BodyEvent.COLLIDING,
      body.getUserData().unwrap().getRequiredComponent(Collider2D),
      contact
    );
  private onCollideStart = (body: Body<Entity>, contact: Contact<Entity>) =>
    this.emit(
      BodyEvent.COLLIDE_START,
      body.getUserData().unwrap().getRequiredComponent(Collider2D),
      contact
    );
  private onCollideEnd = (body: Body<Entity>, contact: Contact<Entity>) =>
    this.emit(
      BodyEvent.COLLIDE_END,
      body.getUserData().unwrap().getRequiredComponent(Collider2D),
      contact
    );
}
