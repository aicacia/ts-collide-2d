import { AABB2 } from "../AABB2";
import { Body } from "../Body";
import { Shape } from "../shapes";

export class BroadPhase<UserData> {
  run(
    bodies: Array<Body<UserData>>
  ): Array<[Shape<UserData>, Shape<UserData>]> {
    const pairs: Array<[Shape<UserData>, Shape<UserData>]> = [],
      count = bodies.length;

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count && j !== i; j++) {
        const bi = bodies[i],
          bj = bodies[j];

        if (AABB2.intersects(bi.getAABB(), bj.getAABB())) {
          const shapesi = bi.getShapes(),
            shapesj = bj.getShapes();

          for (let k = 0, kl = shapesi.length; k < kl; k++) {
            for (let l = 0, ll = shapesj.length; l < ll; l++) {
              const si = shapesi[k],
                sj = shapesj[l];

              if (AABB2.intersects(si.getAABB(), sj.getAABB())) {
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
