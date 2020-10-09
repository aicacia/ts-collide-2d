import { Body } from "../Body";
import { Shape } from "../shapes";
export declare class BroadPhase<UserData> {
    run(bodies: Array<Body<UserData>>): Array<[Shape<UserData>, Shape<UserData>]>;
}
