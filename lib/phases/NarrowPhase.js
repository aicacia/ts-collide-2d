"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.circleToConvexHandler = exports.circleToCircleHandler = exports.NarrowPhase = void 0;
const core_1 = require("@aicacia/core");
const hash_1 = require("@aicacia/hash");
const gl_matrix_1 = require("gl-matrix");
const ecs_game_1 = require("@aicacia/ecs-game");
const shapes_1 = require("../shapes");
const Contact_1 = require("./Contact");
class NarrowPhase {
    constructor() {
        this.handlers = new Map();
        this.setHandler(shapes_1.Circle, shapes_1.Circle, exports.circleToCircleHandler)
            .setHandler(shapes_1.Circle, shapes_1.Convex, exports.circleToConvexHandler)
            .setHandler(shapes_1.Circle, shapes_1.Box, exports.circleToConvexHandler);
    }
    run(pairs) {
        const contacts = [];
        for (let i = 0, il = pairs.length; i < il; i++) {
            const [si, sj] = pairs[i];
            this.getHandler(si, sj)
                .map((handler) => handler(si, sj, contacts))
                .orElse(() => this.getHandler(sj, si).map((handler) => handler(sj, si, contacts)))
                .expect(`no handler for ${si} ${sj}`);
        }
        return contacts;
    }
    setHandler(a, b, handler) {
        this.handlers.set(this.getHash(a, b), handler);
        return this;
    }
    getHandler(si, sj) {
        return core_1.Option.from(this.handlers.get(this.getHash(Object.getPrototypeOf(si).constructor, Object.getPrototypeOf(sj).constructor)));
    }
    getHash(a, b) {
        let hashed = 0;
        hashed = (31 * hashed + hash_1.hash(a)) | 0;
        hashed = (31 * hashed + hash_1.hash(b)) | 0;
        return hashed;
    }
}
exports.NarrowPhase = NarrowPhase;
const circleToCircleHandler = (si, sj, contacts) => {
    return circleToCircle(si, sj, si.getPosition(), sj.getPosition(), si.getRadius(), sj.getRadius(), contacts);
};
exports.circleToCircleHandler = circleToCircleHandler;
const CIRCLE_TO_CONVEX_VEC2_0 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_1 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_2 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_3 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_4 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_5 = gl_matrix_1.vec2.create();
const circleToConvexHandler = (si, sj, _contacts) => {
    const closetPoint = CIRCLE_TO_CONVEX_VEC2_0, axis = CIRCLE_TO_CONVEX_VEC2_1, convexMin = CIRCLE_TO_CONVEX_VEC2_2, convexMax = CIRCLE_TO_CONVEX_VEC2_3, circleMin = CIRCLE_TO_CONVEX_VEC2_4, circleMax = CIRCLE_TO_CONVEX_VEC2_5, xi = si.getPosition();
    closetToPoint(closetPoint, sj.getPoints(), xi).map((index) => {
        gl_matrix_1.vec2.sub(axis, xi, closetPoint);
        projectPointsToAxis(sj.getPoints(), axis, convexMin, convexMax);
        projectCircleToAxis(xi, si.getRadius(), axis, circleMin, circleMax);
        if (Math.min(gl_matrix_1.vec2.squaredLength(circleMax) - gl_matrix_1.vec2.squaredLength(convexMin), gl_matrix_1.vec2.squaredLength(circleMin) - gl_matrix_1.vec2.squaredLength(convexMax)) <= 0.0) {
            const edgeA = CIRCLE_TO_CONVEX_VEC2_0, edgeB = CIRCLE_TO_CONVEX_VEC2_1;
            getEdge(edgeA, edgeB, index, sj.getPoints());
        }
    });
};
exports.circleToConvexHandler = circleToConvexHandler;
const CIRCLE_TO_CIRCLE_VEC2_0 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_1 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_2 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_3 = gl_matrix_1.vec2.create();
const circleToCircle = (si, sj, xi, xj, ri, rj, contacts) => {
    const d = gl_matrix_1.vec2.sub(CIRCLE_TO_CIRCLE_VEC2_0, xi, xj), r = ri + rj, rsq = r * r, dsq = gl_matrix_1.vec2.squaredLength(d);
    if (dsq < rsq) {
        const depth = Math.sqrt(rsq) - Math.sqrt(dsq), normal = gl_matrix_1.vec2.normalize(CIRCLE_TO_CIRCLE_VEC2_1, d), position = gl_matrix_1.vec2.add(CIRCLE_TO_CIRCLE_VEC2_2, xi, gl_matrix_1.vec2.scale(CIRCLE_TO_CIRCLE_VEC2_3, normal, ri));
        contacts.push(new Contact_1.Contact(si, sj, position, normal, depth));
    }
};
const PROJECT_CIRCLE_TO_AXIS_VEC2_0 = gl_matrix_1.vec2.create(), PROJECT_CIRCLE_TO_AXIS_VEC2_1 = gl_matrix_1.vec2.create(), PROJECT_CIRCLE_TO_AXIS_VEC2_2 = gl_matrix_1.vec2.create();
const projectCircleToAxis = (center, radius, axis, min, max) => {
    const projectedPoint = ecs_game_1.projectPointOnAxis(PROJECT_CIRCLE_TO_AXIS_VEC2_0, center, axis);
    const normalizedAxis = gl_matrix_1.vec2.normalize(PROJECT_CIRCLE_TO_AXIS_VEC2_1, axis), offset = gl_matrix_1.vec2.scale(PROJECT_CIRCLE_TO_AXIS_VEC2_2, normalizedAxis, radius);
    gl_matrix_1.vec2.sub(min, projectedPoint, offset);
    gl_matrix_1.vec2.add(max, projectedPoint, offset);
};
const PROJECT_POINTS_TO_AXIS_VEC2_0 = gl_matrix_1.vec2.create();
const projectPointsToAxis = (points, axis, min, max) => {
    gl_matrix_1.vec2.set(min, Infinity, Infinity);
    gl_matrix_1.vec2.set(max, -Infinity, -Infinity);
    points.forEach((point) => {
        const projectedPoint = ecs_game_1.projectPointOnAxis(PROJECT_POINTS_TO_AXIS_VEC2_0, point, axis);
        gl_matrix_1.vec2.min(min, min, projectedPoint);
        gl_matrix_1.vec2.max(max, max, projectedPoint);
    });
};
const CLOSEST_TO_POINT_VEC2_0 = gl_matrix_1.vec2.create();
const closetToPoint = (out, points, point) => {
    let minDistance = Infinity;
    const minIndex = core_1.none();
    points.forEach((p, index) => {
        const d = gl_matrix_1.vec2.sub(CLOSEST_TO_POINT_VEC2_0, p, point), dsq = gl_matrix_1.vec2.squaredLength(d);
        if (dsq < minDistance) {
            minDistance = dsq;
            gl_matrix_1.vec2.copy(out, p);
            minIndex.replace(index);
        }
    });
    return minIndex;
};
const getEdge = (a, b, index, points) => {
    const nextIndex = index + 1;
    gl_matrix_1.vec2.copy(a, points[index]);
    gl_matrix_1.vec2.copy(b, nextIndex < points.length ? points[nextIndex] : points[0]);
};
