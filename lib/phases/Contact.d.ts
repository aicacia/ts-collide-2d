import { vec2 } from "gl-matrix";
import { Shape } from "../shapes";
export declare class Contact<UserData> {
    si: Shape<UserData>;
    sj: Shape<UserData>;
    position: vec2;
    normal: vec2;
    depth: number;
    constructor(si: Shape<UserData>, sj: Shape<UserData>, position: vec2, normal: vec2, depth: number);
}
