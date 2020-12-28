import { hash } from "@aicacia/hash";
import { EventEmitter } from "events";
import { BodyEvent } from "./BodyEvent";
import { BroadPhase } from "./phases/BroadPhase";
import { Contact } from "./phases/Contact";
import { NarrowPhase } from "./phases/NarrowPhase";

export const DEFAULT_LINEAR_DAMPING = 0.01;
export const DEFAULT_ANGULAR_DAMPING: number =
  Math.PI * 2.0 * DEFAULT_LINEAR_DAMPING;

export class World<UserData> extends EventEmitter {
  protected bodies: Array<Body<UserData>> = [];
  protected bodiesToAdd: Array<Body<UserData>> = [];
  protected bodiesToRemove: Array<Body<UserData>> = [];

  protected broadPhase: BroadPhase<UserData> = new BroadPhase();
  protected narrowPhase: NarrowPhase<UserData> = new NarrowPhase();

  protected lastColliding: Map<number, Contact<UserData>> = new Map();
  protected colliding: Map<number, Contact<UserData>> = new Map();

  protected contacts: Contact<UserData>[] = [];

  addBodies(bodies: Array<Body<UserData>>) {
    this.bodiesToAdd.push(...bodies);
    return this;
  }
  addBody(...bodies: Array<Body<UserData>>) {
    return this.addBodies(bodies);
  }

  removeBodies(bodies: Array<Body<UserData>>) {
    this.bodiesToRemove.push(...bodies);
    return this;
  }
  removeBody(...bodies: Array<Body<UserData>>) {
    return this.removeBodies(bodies);
  }

  getBodies(): ReadonlyArray<Body<UserData>> {
    return this.bodies;
  }

  getContacts(): ReadonlyArray<Contact<UserData>> {
    return this.contacts;
  }

  maintain() {
    this.emit("maintain");

    this.bodiesToAdd.forEach((body) => this.addBodyNow(body));
    this.bodiesToAdd.length = 0;
    this.bodiesToRemove.forEach((body) => this.removeBodyNow(body));
    this.bodiesToRemove.length = 0;

    return this;
  }

  update(delta: number) {
    const lastColliding = this.lastColliding;

    this.emit("update", delta);

    this.maintain();

    const pairs = this.broadPhase.run(this.bodies),
      contacts = this.narrowPhase.run(pairs);

    this.lastColliding = this.colliding;
    lastColliding.clear();
    this.colliding = lastColliding;

    contacts.forEach((contact) => {
      const bi = contact.si.getBody().unwrap(),
        bj = contact.sj.getBody().unwrap(),
        hash = this.getHash(bi, bj),
        lastCollide = this.lastColliding.has(hash),
        newCollide = this.colliding.has(hash);

      if (lastCollide && !newCollide) {
        bi.emit(BodyEvent.COLLIDING, bj, contact);
        bj.emit(BodyEvent.COLLIDING, bi, contact);
      }
      if (!lastCollide && !newCollide) {
        bi.emit(BodyEvent.COLLIDE_START, bj, contact);
        bj.emit(BodyEvent.COLLIDE_START, bi, contact);
      }

      this.colliding.set(hash, contact);
    });

    for (const [hash, contact] of this.lastColliding.entries()) {
      if (!this.colliding.has(hash)) {
        const bi = contact.si.getBody().unwrap(),
          bj = contact.sj.getBody().unwrap();

        bi.emit(BodyEvent.COLLIDE_END, bj, contact);
        bj.emit(BodyEvent.COLLIDE_END, bi, contact);
      }
    }

    this.contacts = contacts;

    return this;
  }

  private addBodyNow<B extends Body<UserData>>(body: B) {
    if (this.bodies.indexOf(body) === -1) {
      this.bodies.push(body);
      body.UNSAFE_setWorld(this);
    }
    return this;
  }

  private removeBodyNow<B extends Body<UserData>>(body: B) {
    const index = this.bodies.indexOf(body);

    if (this.bodies.indexOf(body) !== -1) {
      this.bodies.splice(index, 1);
      body.UNSAFE_removeWorld();
    }

    return this;
  }

  private getHash(a: Body<UserData>, b: Body<UserData>) {
    return hash(a) + hash(b);
  }
}

import { Body } from "./Body";
