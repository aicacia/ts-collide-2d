"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxBody2DRendererHandler = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var engine_1 = require("@aicacia/engine");
var web_1 = require("@aicacia/engine/lib/web");
var Circle_1 = require("../../../shapes/Circle");
var Collider2DManager_1 = require("../../../components/Collider2DManager");
var GREEN_VEC4 = gl_matrix_1.vec4.fromValues(0, 1, 0, 1);
var CtxBody2DRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(CtxBody2DRendererHandler, _super);
    function CtxBody2DRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtxBody2DRendererHandler.prototype.onRender = function () {
        var _this = this;
        this.getManager(Collider2DManager_1.Collider2DManager).ifSome(function (manager) {
            var renderer = _this.getRequiredRenderer();
            manager.getComponents().forEach(function (rCollider2d) {
                rCollider2d
                    .getBody()
                    .getShapes()
                    .forEach(function (shape) {
                    renderer.render(function (ctx) {
                        if (shape instanceof Circle_1.Circle) {
                            ctx.fillStyle = engine_1.toRgba(GREEN_VEC4);
                            ctx.beginPath();
                            ctx.arc(0, 0, shape.getRadius(), 0, Math.PI * 2.0);
                            ctx.stroke();
                        }
                    }, shape.getMatrix());
                });
            });
        });
        return this;
    };
    return CtxBody2DRendererHandler;
}(web_1.CtxRendererHandler));
exports.CtxBody2DRendererHandler = CtxBody2DRendererHandler;
