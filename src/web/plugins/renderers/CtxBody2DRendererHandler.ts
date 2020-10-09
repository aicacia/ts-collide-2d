import { vec4 } from "gl-matrix";
import { toRgba } from "@aicacia/engine";
import { CtxRendererHandler } from "@aicacia/engine/lib/web";
import { Circle } from "../../../shapes/Circle";
import { Collider2DManager } from "../../../components/Collider2DManager";

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
                ctx.fillStyle = toRgba(GREEN_VEC4);
                ctx.beginPath();
                ctx.arc(0, 0, shape.getRadius(), 0, Math.PI * 2.0);
                ctx.stroke();
              }
            }, shape.getMatrix());
          });
      });
    });
    return this;
  }
}
