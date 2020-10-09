import { vec2 } from "gl-matrix";
import { Shape } from "../shapes";

export class Contact<UserData> {
  si: Shape<UserData>;
  sj: Shape<UserData>;
  position: vec2 = vec2.create();
  normal: vec2 = vec2.create();
  depth = 0.0;

  constructor(
    si: Shape<UserData>,
    sj: Shape<UserData>,
    position: vec2,
    normal: vec2,
    depth: number
  ) {
    this.si = si;
    this.sj = sj;
    vec2.copy(this.position, position);
    vec2.copy(this.normal, normal);
    this.depth = depth;
  }
}
