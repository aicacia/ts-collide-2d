import { vec4 } from "gl-matrix";
import { toRgba } from "@aicacia/ecs-game";
import { CtxRendererHandler } from "@aicacia/ecs-game/lib/web";
import { Circle } from "../../../shapes/Circle";
import { Collider2DManager } from "../../../components/Collider2DManager";
import { Convex } from "../../../shapes";

const GREEN_VEC4 = vec4.fromValues(0, 1, 0, 1);

export class CtxBody2DRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(Collider2DManager).ifSome((manager) => {
      const renderer = this.getRequiredRenderer();

      manager.getComponents().forEach((rCollider2d) => {
        rCollider2d
          .getBody()
          .getShapes()
          .forEach((shape) => {
            renderer.render((ctx) => {
              if (shape instanceof Circle) {
                ctx.strokeStyle = toRgba(GREEN_VEC4);
                ctx.beginPath();
                ctx.arc(0, 0, shape.getRadius(), 0, Math.PI * 2.0);
                ctx.stroke();
                ctx.closePath();
              } else if (shape instanceof Convex) {
                const points = shape.getLocalPoints();
                if (points.length > 1) {
                  const first = points[0];
                  ctx.strokeStyle = toRgba(GREEN_VEC4);
                  ctx.beginPath();
                  ctx.moveTo(first[0], first[1]);
                  for (let i = 1, il = points.length; i < il; i++) {
                    ctx.lineTo(points[i][0], points[i][1]);
                  }
                  ctx.lineTo(first[0], first[1]);
                  ctx.stroke();
                  ctx.closePath();
                }
              }
            }, shape.getMatrix());
          });
      });
    });
    return this;
  }
}
