"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxBody2DRendererHandler = void 0;
const gl_matrix_1 = require("gl-matrix");
const ecs_game_1 = require("@aicacia/ecs-game");
const web_1 = require("@aicacia/ecs-game/lib/web");
const Circle_1 = require("../../../shapes/Circle");
const Collider2DManager_1 = require("../../../components/Collider2DManager");
const shapes_1 = require("../../../shapes");
const GREEN_VEC4 = gl_matrix_1.vec4.fromValues(0, 1, 0, 1);
class CtxBody2DRendererHandler extends web_1.CtxRendererHandler {
    onRender() {
        this.getManager(Collider2DManager_1.Collider2DManager).ifSome((manager) => {
            const renderer = this.getRequiredRenderer();
            manager.getComponents().forEach((rCollider2d) => {
                rCollider2d
                    .getBody()
                    .getShapes()
                    .forEach((shape) => {
                    renderer.render((ctx) => {
                        if (shape instanceof Circle_1.Circle) {
                            ctx.strokeStyle = ecs_game_1.toRgba(GREEN_VEC4);
                            ctx.beginPath();
                            ctx.arc(0, 0, shape.getRadius(), 0, Math.PI * 2.0);
                            ctx.stroke();
                            ctx.closePath();
                        }
                        else if (shape instanceof shapes_1.Convex) {
                            const points = shape.getLocalPoints();
                            if (points.length > 1) {
                                const first = points[0];
                                ctx.strokeStyle = ecs_game_1.toRgba(GREEN_VEC4);
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
exports.CtxBody2DRendererHandler = CtxBody2DRendererHandler;
