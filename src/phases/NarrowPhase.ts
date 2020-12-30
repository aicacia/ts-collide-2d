import { IConstructor, none, Option, some } from "@aicacia/core";
import { hash } from "@aicacia/hash";
import { vec2 } from "gl-matrix";
import { Box, Circle, Convex, Shape } from "../shapes";
import { pointInCircle } from "../shapes/Circle";
import { pointInConvex } from "../shapes/Convex";
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

export function circleToCircleHandler<UserData>(
  si: Circle<UserData>,
  sj: Circle<UserData>,
  contacts: Array<Contact<UserData>>
) {
  return circleToCircle(
    si,
    sj,
    si.getPosition(),
    sj.getPosition(),
    si.getRadius(),
    sj.getRadius(),
    contacts
  );
}

export function circleToConvexHandler<UserData>(
  si: Circle<UserData>,
  sj: Convex<UserData>,
  contacts: Array<Contact<UserData>>
) {
  return circleToConvex(
    si,
    sj,
    si.getPosition(),
    si.getRadius(),
    sj.getPoints(),
    contacts
  );
}

const CIRCLE_TO_CONVEX_VEC2_0 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_1 = vec2.create(),
  CIRCLE_TO_CONVEX_VEC2_2 = vec2.create();

function circleToConvex<UserData>(
  si: Shape<UserData>,
  sj: Shape<UserData>,
  xi: vec2,
  ri: number,
  points: vec2[],
  contacts: Array<Contact<UserData>>
) {
  const pointOnLine = CIRCLE_TO_CONVEX_VEC2_0,
    normal = CIRCLE_TO_CONVEX_VEC2_1,
    tmp0 = CIRCLE_TO_CONVEX_VEC2_2;

  closetEdgeToPoint(pointOnLine, points, xi).map(([startIndex, endIndex]) => {
    const start = points[startIndex],
      end = points[endIndex],
      isCircleCenterInPoints = pointInConvex(xi, points);

    if (isCircleCenterInPoints || pointInCircle(pointOnLine, xi, ri)) {
      let depth = 0;

      if (vec2.equals(start, pointOnLine) || vec2.equals(end, pointOnLine)) {
        vec2.sub(normal, pointOnLine, xi);
        depth = ri - vec2.len(normal);
        vec2.normalize(normal, normal);
      } else {
        vec2.set(normal, end[1] - start[1], start[0] - end[0]);
        vec2.sub(tmp0, pointOnLine, xi);

        if (isCircleCenterInPoints) {
          depth = ri + vec2.len(tmp0);
        } else {
          depth = ri - vec2.len(tmp0);
        }
        vec2.normalize(normal, normal);
      }

      contacts.push(new Contact(si, sj, pointOnLine, normal, depth));
    }
  });
}

const CIRCLE_TO_CIRCLE_VEC2_0 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_1 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_2 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_3 = vec2.create();

function circleToCircle<UserData>(
  si: Shape<UserData>,
  sj: Shape<UserData>,
  xi: vec2,
  xj: vec2,
  ri: number,
  rj: number,
  contacts: Array<Contact<UserData>>
) {
  const d = vec2.sub(CIRCLE_TO_CIRCLE_VEC2_0, xj, xi),
    r = ri + rj,
    rsq = r * r,
    dsq = vec2.squaredLength(d);

  if (dsq <= rsq) {
    const depth = Math.sqrt(dsq) - Math.sqrt(rsq),
      normal = vec2.normalize(CIRCLE_TO_CIRCLE_VEC2_1, d),
      position = vec2.add(
        CIRCLE_TO_CIRCLE_VEC2_2,
        xi,
        vec2.scale(CIRCLE_TO_CIRCLE_VEC2_3, normal, ri)
      );

    contacts.push(new Contact(si, sj, position, normal, depth));
  }
}

const CLOSTEST_EDGE_TO_CICRLE_VEC2_0 = vec2.create(),
  CLOSTEST_EDGE_TO_CICRLE_VEC2_1 = vec2.create();

function closetEdgeToPoint(
  out: vec2,
  points: vec2[],
  point: vec2
): Option<[number, number]> {
  const tmp0 = CLOSTEST_EDGE_TO_CICRLE_VEC2_0,
    tmp1 = CLOSTEST_EDGE_TO_CICRLE_VEC2_1;

  let minDistance = Infinity,
    startIndex = -1,
    endIndex = -1;

  for (let i = 0, il = points.length; i < il; i++) {
    const si = i === 0 ? il - 1 : i - 1,
      ei = i,
      dsq = vec2.sqrLen(
        vec2.sub(
          tmp1,
          point,
          projectPointOntoLine(tmp0, point, points[si], points[ei])
        )
      );

    if (dsq < minDistance) {
      minDistance = dsq;
      startIndex = si;
      endIndex = ei;
      vec2.copy(out, tmp0);
    }
  }

  if (startIndex !== -1) {
    return some([startIndex, endIndex]);
  } else {
    return none();
  }
}

const PROJECT_POINT_TO_LINE_VEC2_0 = vec2.create(),
  PROJECT_POINT_TO_LINE_VEC2_1 = vec2.create(),
  PROJECT_POINT_TO_LINE_VEC2_2 = vec2.create(),
  PROJECT_POINT_TO_LINE_VEC2_3 = vec2.create();

function projectPointOntoLine(out: vec2, point: vec2, start: vec2, end: vec2) {
  const line = PROJECT_POINT_TO_LINE_VEC2_0,
    circleToLineStart = PROJECT_POINT_TO_LINE_VEC2_1,
    lineNormal = PROJECT_POINT_TO_LINE_VEC2_2,
    tmp0 = PROJECT_POINT_TO_LINE_VEC2_3;

  vec2.sub(line, end, start);
  vec2.sub(circleToLineStart, point, start);

  const lineLength = vec2.len(line);

  if (lineLength > 0) {
    vec2.scale(lineNormal, line, 1 / lineLength);
  } else {
    vec2.zero(lineNormal);
  }

  const dotProject = vec2.dot(circleToLineStart, lineNormal);

  if (dotProject <= 0) {
    return vec2.copy(out, start);
  } else if (dotProject >= lineLength) {
    return vec2.copy(out, end);
  } else {
    return vec2.add(out, start, vec2.scale(tmp0, lineNormal, dotProject));
  }
}
