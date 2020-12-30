import { vec2 } from "gl-matrix";
import { Shape } from "./Shape";
export declare class Convex<UserData> extends Shape<UserData> {
    protected localPoints: vec2[];
    protected points: vec2[];
    getPoints(): vec2[];
    getLocalPoints(): vec2[];
    setPoints(localPoints: vec2[]): this;
    getCentroid(out: vec2): vec2;
    getArea(): number;
    getInertia(_mass: number): number;
    contains(point: vec2): boolean;
    update(): this;
}
export declare function pointInConvex(point: vec2, points: vec2[]): boolean;
