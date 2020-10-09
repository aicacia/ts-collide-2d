"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constraint = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var Constraint = /** @class */ (function (_super) {
    tslib_1.__extends(Constraint, _super);
    function Constraint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = core_1.none();
        return _this;
    }
    Constraint.prototype.UNSAFE_setWorld = function (world) {
        this.world.replace(world);
        return this;
    };
    Constraint.prototype.UNSAFE_removeWorld = function () {
        this.world.take();
        return this;
    };
    Constraint.prototype.getWorld = function () {
        return this.world;
    };
    return Constraint;
}(events_1.EventEmitter));
exports.Constraint = Constraint;
