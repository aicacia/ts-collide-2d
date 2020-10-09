"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World2D = void 0;
var tslib_1 = require("tslib");
var engine_1 = require("@aicacia/engine");
var World_1 = require("../World");
var World2D = /** @class */ (function (_super) {
    tslib_1.__extends(World2D, _super);
    function World2D(world) {
        if (world === void 0) { world = new World_1.World(); }
        var _this = _super.call(this) || this;
        _this.world = world;
        return _this;
    }
    World2D.prototype.getWorld = function () {
        return this.world;
    };
    World2D.prototype.onUpdate = function () {
        this.world.update(this.getRequiredPlugin(engine_1.Time).getDelta());
        return this;
    };
    World2D.requiredPlugins = [engine_1.Time];
    return World2D;
}(engine_1.Plugin));
exports.World2D = World2D;
