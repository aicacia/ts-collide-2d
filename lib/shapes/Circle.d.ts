import { vec2 } from "gl-matrix";
import { Shape } from "./Shape";
export declare class Circle<UserData> extends Shape<UserData> {
    protected radius: number;
    getRadius(): number;
    setRadius(radius: number): this;
    getCentroid(out: vec2): vec2;
    getArea(): number;
    getInertia(mass: number): number;
    contains(point: vec2): boolean;
    update(): this;
}
export declare function pointInCircle(point: vec2, center: vec2, radius: number): boolean;
