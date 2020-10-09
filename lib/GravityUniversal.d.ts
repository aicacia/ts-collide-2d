import { vec2 } from "gl-matrix";
import { Constraint } from "./Constraint";
export declare class GravityUniversal<UserData> extends Constraint<UserData> {
    protected gravity: vec2;
    update(delta: number): this;
}
