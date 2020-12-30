import { IConstructor, Option } from "@aicacia/core";
import { Circle, Convex, Shape } from "../shapes";
import { Contact } from "./Contact";
declare type IHandler = <UserData>(si: Shape<UserData>, sj: Shape<UserData>, contacts: Array<Contact<UserData>>) => void;
export declare class NarrowPhase<UserData> {
    private handlers;
    constructor();
    run(pairs: Array<[Shape<UserData>, Shape<UserData>]>): Array<Contact<UserData>>;
    setHandler(a: IConstructor<Shape<UserData>>, b: IConstructor<Shape<UserData>>, handler: any): this;
    getHandler(si: Shape<UserData>, sj: Shape<UserData>): Option<IHandler>;
    private getHash;
}
export declare function circleToCircleHandler<UserData>(si: Circle<UserData>, sj: Circle<UserData>, contacts: Array<Contact<UserData>>): void;
export declare function circleToConvexHandler<UserData>(si: Circle<UserData>, sj: Convex<UserData>, contacts: Array<Contact<UserData>>): void;
export {};
