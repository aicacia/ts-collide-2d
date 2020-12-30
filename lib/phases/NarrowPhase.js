"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.circleToConvexHandler = exports.circleToCircleHandler = exports.NarrowPhase = void 0;
const core_1 = require("@aicacia/core");
const hash_1 = require("@aicacia/hash");
const gl_matrix_1 = require("gl-matrix");
const shapes_1 = require("../shapes");
const Circle_1 = require("../shapes/Circle");
const Convex_1 = require("../shapes/Convex");
const Contact_1 = require("./Contact");
class NarrowPhase {
    constructor() {
        this.handlers = new Map();
        this.setHandler(shapes_1.Circle, shapes_1.Circle, circleToCircleHandler)
            .setHandler(shapes_1.Circle, shapes_1.Convex, circleToConvexHandler)
            .setHandler(shapes_1.Circle, shapes_1.Box, circleToConvexHandler);
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
function circleToCircleHandler(si, sj, contacts) {
    return circleToCircle(si, sj, si.getPosition(), sj.getPosition(), si.getRadius(), sj.getRadius(), contacts);
}
exports.circleToCircleHandler = circleToCircleHandler;
function circleToConvexHandler(si, sj, contacts) {
    return circleToConvex(si, sj, si.getPosition(), si.getRadius(), sj.getPoints(), contacts);
}
exports.circleToConvexHandler = circleToConvexHandler;
const CIRCLE_TO_CONVEX_VEC2_0 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_1 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_2 = gl_matrix_1.vec2.create();
function circleToConvex(si, sj, xi, ri, points, contacts) {
    const pointOnLine = CIRCLE_TO_CONVEX_VEC2_0, normal = CIRCLE_TO_CONVEX_VEC2_1, tmp0 = CIRCLE_TO_CONVEX_VEC2_2;
    closetEdgeToPoint(pointOnLine, points, xi).map(([startIndex, endIndex]) => {
        const start = points[startIndex], end = points[endIndex], isCircleCenterInPoints = Convex_1.pointInConvex(xi, points);
        if (isCircleCenterInPoints || Circle_1.pointInCircle(pointOnLine, xi, ri)) {
            let depth = 0;
            if (gl_matrix_1.vec2.equals(start, pointOnLine) || gl_matrix_1.vec2.equals(end, pointOnLine)) {
                gl_matrix_1.vec2.sub(normal, pointOnLine, xi);
                depth = ri - gl_matrix_1.vec2.len(normal);
                gl_matrix_1.vec2.normalize(normal, normal);
            }
            else {
                gl_matrix_1.vec2.set(normal, end[1] - start[1], start[0] - end[0]);
                gl_matrix_1.vec2.sub(tmp0, pointOnLine, xi);
                if (isCircleCenterInPoints) {
                    depth = ri + gl_matrix_1.vec2.len(tmp0);
                }
                else {
                    depth = ri - gl_matrix_1.vec2.len(tmp0);
                }
                gl_matrix_1.vec2.normalize(normal, normal);
            }
            contacts.push(new Contact_1.Contact(si, sj, pointOnLine, normal, depth));
        }
    });
}
const CIRCLE_TO_CIRCLE_VEC2_0 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_1 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_2 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_3 = gl_matrix_1.vec2.create();
function circleToCircle(si, sj, xi, xj, ri, rj, contacts) {
    const d = gl_matrix_1.vec2.sub(CIRCLE_TO_CIRCLE_VEC2_0, xj, xi), r = ri + rj, rsq = r * r, dsq = gl_matrix_1.vec2.squaredLength(d);
    if (dsq <= rsq) {
        const depth = Math.sqrt(dsq) - Math.sqrt(rsq), normal = gl_matrix_1.vec2.normalize(CIRCLE_TO_CIRCLE_VEC2_1, d), position = gl_matrix_1.vec2.add(CIRCLE_TO_CIRCLE_VEC2_2, xi, gl_matrix_1.vec2.scale(CIRCLE_TO_CIRCLE_VEC2_3, normal, ri));
        contacts.push(new Contact_1.Contact(si, sj, position, normal, depth));
    }
}
const CLOSTEST_EDGE_TO_CICRLE_VEC2_0 = gl_matrix_1.vec2.create(), CLOSTEST_EDGE_TO_CICRLE_VEC2_1 = gl_matrix_1.vec2.create();
function closetEdgeToPoint(out, points, point) {
    const tmp0 = CLOSTEST_EDGE_TO_CICRLE_VEC2_0, tmp1 = CLOSTEST_EDGE_TO_CICRLE_VEC2_1;
    let minDistance = Infinity, startIndex = -1, endIndex = -1;
    for (let i = 0, il = points.length; i < il; i++) {
        const si = i === 0 ? il - 1 : i - 1, ei = i, dsq = gl_matrix_1.vec2.sqrLen(gl_matrix_1.vec2.sub(tmp1, point, projectPointOntoLine(tmp0, point, points[si], points[ei])));
        if (dsq < minDistance) {
            minDistance = dsq;
            startIndex = si;
            endIndex = ei;
            gl_matrix_1.vec2.copy(out, tmp0);
        }
    }
    if (startIndex !== -1) {
        return core_1.some([startIndex, endIndex]);
    }
    else {
        return core_1.none();
    }
}
const PROJECT_POINT_TO_LINE_VEC2_0 = gl_matrix_1.vec2.create(), PROJECT_POINT_TO_LINE_VEC2_1 = gl_matrix_1.vec2.create(), PROJECT_POINT_TO_LINE_VEC2_2 = gl_matrix_1.vec2.create(), PROJECT_POINT_TO_LINE_VEC2_3 = gl_matrix_1.vec2.create();
function projectPointOntoLine(out, point, start, end) {
    const line = PROJECT_POINT_TO_LINE_VEC2_0, circleToLineStart = PROJECT_POINT_TO_LINE_VEC2_1, lineNormal = PROJECT_POINT_TO_LINE_VEC2_2, tmp0 = PROJECT_POINT_TO_LINE_VEC2_3;
    gl_matrix_1.vec2.sub(line, end, start);
    gl_matrix_1.vec2.sub(circleToLineStart, point, start);
    const lineLength = gl_matrix_1.vec2.len(line);
    if (lineLength > 0) {
        gl_matrix_1.vec2.scale(lineNormal, line, 1 / lineLength);
    }
    else {
        gl_matrix_1.vec2.zero(lineNormal);
    }
    const dotProject = gl_matrix_1.vec2.dot(circleToLineStart, lineNormal);
    if (dotProject <= 0) {
        return gl_matrix_1.vec2.copy(out, start);
    }
    else if (dotProject >= lineLength) {
        return gl_matrix_1.vec2.copy(out, end);
    }
    else {
        return gl_matrix_1.vec2.add(out, start, gl_matrix_1.vec2.scale(tmp0, lineNormal, dotProject));
    }
}
