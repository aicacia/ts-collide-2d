"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxContactRendererHandler = void 0;
const gl_matrix_1 = require("gl-matrix");
const ecs_game_1 = require("@aicacia/ecs-game");
const web_1 = require("@aicacia/ecs-game/lib/web");
const World2D_1 = require("../../../plugins/World2D");
const RED_VEC4 = gl_matrix_1.vec4.fromValues(1, 0, 0, 1);
class CtxContactRendererHandler extends web_1.CtxRendererHandler {
    onRender() {
        this.getPlugin(World2D_1.World2D).ifSome((worldPlugin) => {
            const renderer = this.getRequiredRenderer();
            worldPlugin
                .getWorld()
                .getContacts()
                .forEach((contact) => renderer.render((ctx) => {
                ctx.fillStyle = ecs_game_1.toRgba(RED_VEC4);
                ctx.beginPath();
                ctx.arc(contact.position[0], contact.position[1], 0.05, 0, Math.PI * 2.0);
                ctx.fill();
                ctx.closePath();
                ctx.strokeStyle = ecs_game_1.toRgba(RED_VEC4);
                ctx.beginPath();
                ctx.moveTo(contact.position[0], contact.position[1]);
                ctx.lineTo(contact.position[0] + contact.normal[0] * -contact.depth, contact.position[1] + contact.normal[1] * -contact.depth);
                ctx.stroke();
                ctx.closePath();
            }, contact.sj.getMatrix()));
        });
        return this;
    }
}
exports.CtxContactRendererHandler = CtxContactRendererHandler;
