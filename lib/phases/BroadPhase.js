"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadPhase = void 0;
const AABB2_1 = require("../AABB2");
class BroadPhase {
    run(bodies) {
        const pairs = [], count = bodies.length;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count && j !== i; j++) {
                const bi = bodies[i], bj = bodies[j];
                if (AABB2_1.AABB2.intersects(bi.getAABB(), bj.getAABB())) {
                    const shapesi = bi.getShapes(), shapesj = bj.getShapes();
                    for (let k = 0, kl = shapesi.length; k < kl; k++) {
                        for (let l = 0, ll = shapesj.length; l < ll; l++) {
                            const si = shapesi[k], sj = shapesj[l];
                            if (AABB2_1.AABB2.intersects(si.getAABB(), sj.getAABB())) {
                                pairs.push([si, sj]);
                            }
                        }
                    }
                }
            }
        }
        return pairs;
    }
}
exports.BroadPhase = BroadPhase;
