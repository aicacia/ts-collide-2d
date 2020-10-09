"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.circleToConvexHandler = exports.circleToCircleHandler = exports.NarrowPhase = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var hash_1 = require("@aicacia/hash");
var gl_matrix_1 = require("gl-matrix");
var engine_1 = require("@aicacia/engine");
var shapes_1 = require("../shapes");
var Contact_1 = require("./Contact");
var NarrowPhase = /** @class */ (function () {
    function NarrowPhase() {
        this.handlers = new Map();
        this.setHandler(shapes_1.Circle, shapes_1.Circle, exports.circleToCircleHandler)
            .setHandler(shapes_1.Circle, shapes_1.Convex, exports.circleToConvexHandler)
            .setHandler(shapes_1.Circle, shapes_1.Box, exports.circleToConvexHandler);
    }
    NarrowPhase.prototype.run = function (pairs) {
        var _this = this;
        var contacts = [];
        var _loop_1 = function (i, il) {
            var _a = tslib_1.__read(pairs[i], 2), si = _a[0], sj = _a[1];
            this_1.getHandler(si, sj)
                .map(function (handler) { return handler(si, sj, contacts); })
                .orElse(function () {
                return _this.getHandler(sj, si).map(function (handler) { return handler(sj, si, contacts); });
            })
                .expect("no handler for " + si + " " + sj);
        };
        var this_1 = this;
        for (var i = 0, il = pairs.length; i < il; i++) {
            _loop_1(i, il);
        }
        return contacts;
    };
    NarrowPhase.prototype.setHandler = function (a, b, handler) {
        this.handlers.set(this.getHash(a, b), handler);
        return this;
    };
    NarrowPhase.prototype.getHandler = function (si, sj) {
        return core_1.Option.from(this.handlers.get(this.getHash(Object.getPrototypeOf(si).constructor, Object.getPrototypeOf(sj).constructor)));
    };
    NarrowPhase.prototype.getHash = function (a, b) {
        var hashed = 0;
        hashed = (31 * hashed + hash_1.hash(a)) | 0;
        hashed = (31 * hashed + hash_1.hash(b)) | 0;
        return hashed;
    };
    return NarrowPhase;
}());
exports.NarrowPhase = NarrowPhase;
exports.circleToCircleHandler = function (si, sj, contacts) {
    return circleToCircle(si, sj, si.getPosition(), sj.getPosition(), si.getRadius(), sj.getRadius(), contacts);
};
var CIRCLE_TO_CONVEX_VEC2_0 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_1 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_2 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_3 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_4 = gl_matrix_1.vec2.create(), CIRCLE_TO_CONVEX_VEC2_5 = gl_matrix_1.vec2.create();
exports.circleToConvexHandler = function (si, sj, _contacts) {
    var closetPoint = CIRCLE_TO_CONVEX_VEC2_0, axis = CIRCLE_TO_CONVEX_VEC2_1, convexMin = CIRCLE_TO_CONVEX_VEC2_2, convexMax = CIRCLE_TO_CONVEX_VEC2_3, circleMin = CIRCLE_TO_CONVEX_VEC2_4, circleMax = CIRCLE_TO_CONVEX_VEC2_5, xi = si.getPosition();
    closetToPoint(closetPoint, sj.getPoints(), xi).map(function (index) {
        gl_matrix_1.vec2.sub(axis, xi, closetPoint);
        projectPointsToAxis(sj.getPoints(), axis, convexMin, convexMax);
        projectCircleToAxis(xi, si.getRadius(), axis, circleMin, circleMax);
        if (Math.min(gl_matrix_1.vec2.squaredLength(circleMax) - gl_matrix_1.vec2.squaredLength(convexMin), gl_matrix_1.vec2.squaredLength(circleMin) - gl_matrix_1.vec2.squaredLength(convexMax)) <= 0.0) {
            var edgeA = CIRCLE_TO_CONVEX_VEC2_0, edgeB = CIRCLE_TO_CONVEX_VEC2_1;
            getEdge(edgeA, edgeB, index, sj.getPoints());
        }
    });
};
var CIRCLE_TO_CIRCLE_VEC2_0 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_1 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_2 = gl_matrix_1.vec2.create(), CIRCLE_TO_CIRCLE_VEC2_3 = gl_matrix_1.vec2.create();
var circleToCircle = function (si, sj, xi, xj, ri, rj, contacts) {
    var d = gl_matrix_1.vec2.sub(CIRCLE_TO_CIRCLE_VEC2_0, xi, xj), r = ri + rj, rsq = r * r, dsq = gl_matrix_1.vec2.squaredLength(d);
    if (dsq < rsq) {
        var depth = Math.sqrt(rsq) - Math.sqrt(dsq), normal = gl_matrix_1.vec2.normalize(CIRCLE_TO_CIRCLE_VEC2_1, d), position = gl_matrix_1.vec2.add(CIRCLE_TO_CIRCLE_VEC2_2, xi, gl_matrix_1.vec2.scale(CIRCLE_TO_CIRCLE_VEC2_3, normal, ri));
        contacts.push(new Contact_1.Contact(si, sj, position, normal, depth));
    }
};
var PROJECT_CIRCLE_TO_AXIS_VEC2_0 = gl_matrix_1.vec2.create(), PROJECT_CIRCLE_TO_AXIS_VEC2_1 = gl_matrix_1.vec2.create(), PROJECT_CIRCLE_TO_AXIS_VEC2_2 = gl_matrix_1.vec2.create();
var projectCircleToAxis = function (center, radius, axis, min, max) {
    var projectedPoint = engine_1.projectPointOnAxis(PROJECT_CIRCLE_TO_AXIS_VEC2_0, center, axis);
    var normalizedAxis = gl_matrix_1.vec2.normalize(PROJECT_CIRCLE_TO_AXIS_VEC2_1, axis), offset = gl_matrix_1.vec2.scale(PROJECT_CIRCLE_TO_AXIS_VEC2_2, normalizedAxis, radius);
    gl_matrix_1.vec2.sub(min, projectedPoint, offset);
    gl_matrix_1.vec2.add(max, projectedPoint, offset);
};
var PROJECT_POINTS_TO_AXIS_VEC2_0 = gl_matrix_1.vec2.create();
var projectPointsToAxis = function (points, axis, min, max) {
    gl_matrix_1.vec2.set(min, Infinity, Infinity);
    gl_matrix_1.vec2.set(max, -Infinity, -Infinity);
    points.forEach(function (point) {
        var projectedPoint = engine_1.projectPointOnAxis(PROJECT_POINTS_TO_AXIS_VEC2_0, point, axis);
        gl_matrix_1.vec2.min(min, min, projectedPoint);
        gl_matrix_1.vec2.max(max, max, projectedPoint);
    });
};
var CLOSEST_TO_POINT_VEC2_0 = gl_matrix_1.vec2.create();
var closetToPoint = function (out, points, point) {
    var minDistance = Infinity;
    var minIndex = core_1.none();
    points.forEach(function (p, index) {
        var d = gl_matrix_1.vec2.sub(CLOSEST_TO_POINT_VEC2_0, p, point), dsq = gl_matrix_1.vec2.squaredLength(d);
        if (dsq < minDistance) {
            minDistance = dsq;
            gl_matrix_1.vec2.copy(out, p);
            minIndex.replace(index);
        }
    });
    return minIndex;
};
var getEdge = function (a, b, index, points) {
    var nextIndex = index + 1;
    gl_matrix_1.vec2.copy(a, points[index]);
    gl_matrix_1.vec2.copy(b, nextIndex < points.length ? points[nextIndex] : points[0]);
};
