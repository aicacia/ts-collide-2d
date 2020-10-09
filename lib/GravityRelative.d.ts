import { Body } from "./Body";
import { Constraint } from "./Constraint";
export declare class GravityRelative<UserData> extends Constraint<UserData> {
    static G: number;
    protected constaint: number;
    protected body: Body<UserData>;
    constructor(body: Body<UserData>);
    getConstaint(): number;
    setConstaint(constaint: number): this;
    getBody(): Body<UserData>;
    setBody(body: Body<UserData>): this;
    update(delta: number): this;
}
