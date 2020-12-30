import { vec4 } from "gl-matrix";
import { toRgba } from "@aicacia/ecs-game";
import { CtxRendererHandler } from "@aicacia/ecs-game/lib/web";
import { World2D } from "../../../plugins/World2D";

const RED_VEC4 = vec4.fromValues(1, 0, 0, 1);

export class CtxContactRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getPlugin(World2D).ifSome((worldPlugin) => {
      const renderer = this.getRequiredRenderer();

      worldPlugin
        .getWorld()
        .getContacts()
        .forEach((contact) =>
          renderer.render((ctx) => {
            ctx.fillStyle = toRgba(RED_VEC4);
            ctx.beginPath();
            ctx.arc(
              contact.position[0],
              contact.position[1],
              0.05,
              0,
              Math.PI * 2.0
            );
            ctx.fill();
            ctx.closePath();

            ctx.strokeStyle = toRgba(RED_VEC4);
            ctx.beginPath();
            ctx.moveTo(contact.position[0], contact.position[1]);
            ctx.lineTo(
              contact.position[0] + contact.normal[0] * contact.depth,
              contact.position[1] + contact.normal[1] * contact.depth
            );
            ctx.stroke();
            ctx.closePath();
          }, contact.si.getMatrix())
        );
    });
    return this;
  }
}
