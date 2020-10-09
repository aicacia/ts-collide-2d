import { IConstructor, none, Option } from "@aicacia/core";
import { hash } from "@aicacia/hash";
import { vec2 } from "gl-matrix";
import { projectPointOnAxis } from "@aicacia/engine";
import { Box, Circle, Convex, Shape } from "../shapes";
import { Contact } from "./Contact";

type IHandler = <UserData>(
  si: Shape<UserData>,
  sj: Shape<UserData>,
  contacts: Array<Contact<UserData>>
) => void;

export class NarrowPhase<UserData> {
  private handlers: Map<number, IHandler> = new Map();

  constructor() {
    this.setHandler(Circle, Circle, circleToCircleHandler)
      .setHandler(Circle, Convex, circleToConvexHandler)
      .setHandler(Circle, Box, circleToConvexHandler);
  }

  run(
    pairs: Array<[Shape<UserData>, Shape<UserData>]>
  ): Array<Contact<UserData>> {
    const contacts: Array<Contact<UserData>> = [];

    for (let i = 0, il = pairs.length; i < il; i++) {
      const [si, sj] = pairs[i];

      this.getHandler(si, sj)
        .map((handler) => handler(si, sj, contacts))
        .orElse(() =>
          this.getHandler(sj, si).map((handler) => handler(sj, si, contacts))
        )
        .expect(`no handler for ${si} ${sj}`);
    }
    return contacts;
  }

  setHandler(
    a: IConstructor<Shape<UserData>>,
    b: IConstructor<Shape<UserData>>,
    handler: any
  ) {
    this.handlers.set(this.getHash(a, b), handler);
    return this;
  }
  getHandler(si: Shape<UserData>, sj: Shape<UserData>) {
    return Option.from(
      this.handlers.get(
        this.getHash(
          Object.getPrototypeOf(si).constructor,
          Object.getPrototypeOf(sj).constructor
        )
      )
    );
  }

  private getHash(
    a: IConstructor<Shape<UserData>>,
    b: IConstructor<Shape<UserData>>
  ) {
    let hashed = 0;
    hashed = (31 * hashed + hash(a)) | 0;
    hashed = (31 * hashed + hash(b)) | 0;
    return hashed;
  }
}

export const circleToCircleHandler = <UserData>(
  si: Circle<UserData>,
  sj: Circle<UserData>,
  contacts: Array<Contact<UserData>>
) => {
  return circleToCircle(
    si,
    sj,
    si.getPosition(),
    sj.getPosition(),
    si.getRadius(),
    sj.getRadius(),
    contacts
  );
};

const CIRCLE_TO_CONVEX_VEC2_0 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_1 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_2 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_3 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_4 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_5 = vec2.create();

export const circleToConvexHandler = <UserData>(
  si: Circle<UserData>,
  sj: Convex<UserData>,
  _contacts: Array<Contact<UserData>>
) => {
  const closetPoint = CIRCLE_TO_CONVEX_VEC2_0,
    axis = CIRCLE_TO_CONVEX_VEC2_1,
    convexMin = CIRCLE_TO_CONVEX_VEC2_2,
    convexMax = CIRCLE_TO_CONVEX_VEC2_3,
    circleMin = CIRCLE_TO_CONVEX_VEC2_4,
    circleMax = CIRCLE_TO_CONVEX_VEC2_5,
    xi = si.getPosition();

  closetToPoint(closetPoint, sj.getPoints(), xi).map((index) => {
    vec2.sub(axis, xi, closetPoint);
    projectPointsToAxis(sj.getPoints(), axis, convexMin, convexMax);
    projectCircleToAxis(xi, si.getRadius(), axis, circleMin, circleMax);

    if (
      Math.min(
        vec2.squaredLength(circleMax) - vec2.squaredLength(convexMin),
        vec2.squaredLength(circleMin) - vec2.squaredLength(convexMax)
      ) <= 0.0
    ) {
      const edgeA = CIRCLE_TO_CONVEX_VEC2_0,
        edgeB = CIRCLE_TO_CONVEX_VEC2_1;

      getEdge(edgeA, edgeB, index, sj.getPoints());
    }
  });
};

const CIRCLE_TO_CIRCLE_VEC2_0 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_1 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_2 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_3 = vec2.create();

const circleToCircle = <UserData>(
  si: Shape<UserData>,
  sj: Shape<UserData>,
  xi: vec2,
  xj: vec2,
  ri: number,
  rj: number,
  contacts: Array<Contact<UserData>>
) => {
  const d = vec2.sub(CIRCLE_TO_CIRCLE_VEC2_0, xi, xj),
    r = ri + rj,
    rsq = r * r,
    dsq = vec2.squaredLength(d);

  if (dsq < rsq) {
    const depth = Math.sqrt(rsq) - Math.sqrt(dsq),
      normal = vec2.normalize(CIRCLE_TO_CIRCLE_VEC2_1, d),
      position = vec2.add(
        CIRCLE_TO_CIRCLE_VEC2_2,
        xi,
        vec2.scale(CIRCLE_TO_CIRCLE_VEC2_3, normal, ri)
      );

    contacts.push(new Contact(si, sj, position, normal, depth));
  }
};

const PROJECT_CIRCLE_TO_AXIS_VEC2_0 = vec2.create(),
  PROJECT_CIRCLE_TO_AXIS_VEC2_1 = vec2.create(),
  PROJECT_CIRCLE_TO_AXIS_VEC2_2 = vec2.create();

const projectCircleToAxis = (
  center: vec2,
  radius: number,
  axis: vec2,
  min: vec2,
  max: vec2
) => {
  const projectedPoint = projectPointOnAxis(
    PROJECT_CIRCLE_TO_AXIS_VEC2_0,
    center,
    axis
  );
  const normalizedAxis = vec2.normalize(PROJECT_CIRCLE_TO_AXIS_VEC2_1, axis),
    offset = vec2.scale(PROJECT_CIRCLE_TO_AXIS_VEC2_2, normalizedAxis, radius);

  vec2.sub(min, projectedPoint, offset);
  vec2.add(max, projectedPoint, offset);
};

const PROJECT_POINTS_TO_AXIS_VEC2_0 = vec2.create();

const projectPointsToAxis = (
  points: vec2[],
  axis: vec2,
  min: vec2,
  max: vec2
) => {
  vec2.set(min, Infinity, Infinity);
  vec2.set(max, -Infinity, -Infinity);

  points.forEach((point) => {
    const projectedPoint = projectPointOnAxis(
      PROJECT_POINTS_TO_AXIS_VEC2_0,
      point,
      axis
    );

    vec2.min(min, min, projectedPoint);
    vec2.max(max, max, projectedPoint);
  });
};

const CLOSEST_TO_POINT_VEC2_0 = vec2.create();

const closetToPoint = (out: vec2, points: vec2[], point: vec2) => {
  let minDistance = Infinity;
  const minIndex = none<number>();

  points.forEach((p, index) => {
    const d = vec2.sub(CLOSEST_TO_POINT_VEC2_0, p, point),
      dsq = vec2.squaredLength(d);

    if (dsq < minDistance) {
      minDistance = dsq;
      vec2.copy(out, p);
      minIndex.replace(index);
    }
  });

  return minIndex;
};

const getEdge = (a: vec2, b: vec2, index: number, points: vec2[]) => {
  const nextIndex = index + 1;
  vec2.copy(a, points[index]);
  vec2.copy(b, nextIndex < points.length ? points[nextIndex] : points[0]);
};
