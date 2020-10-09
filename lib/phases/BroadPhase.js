"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadPhase = void 0;
var AABB2_1 = require("../AABB2");
var BroadPhase = /** @class */ (function () {
    function BroadPhase() {
    }
    BroadPhase.prototype.run = function (bodies) {
        var pairs = [], count = bodies.length;
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count && j !== i; j++) {
                var bi = bodies[i], bj = bodies[j];
                if (AABB2_1.AABB2.intersects(bi.getAABB(), bj.getAABB())) {
                    var shapesi = bi.getShapes(), shapesj = bj.getShapes();
                    for (var k = 0, kl = shapesi.length; k < kl; k++) {
                        for (var l = 0, ll = shapesj.length; l < ll; l++) {
                            var si = shapesi[k], sj = shapesj[l];
                            if (AABB2_1.AABB2.intersects(si.getAABB(), sj.getAABB())) {
                                pairs.push([si, sj]);
                            }
                        }
                    }
                }
            }
        }
        return pairs;
    };
    return BroadPhase;
}());
exports.BroadPhase = BroadPhase;
