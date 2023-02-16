"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesTransferEvent = void 0;
const assert_1 = __importDefault(require("assert"));
class BalancesTransferEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Balances.Transfer');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     *  Transfer succeeded (from, to, value, fees).
     */
    get isV1020() {
        return this._chain.getEventHash('Balances.Transfer') === '72e6f0d399a72f77551d560f52df25d757e0643d0192b3bc837cbd91b6f36b27';
    }
    /**
     *  Transfer succeeded (from, to, value, fees).
     */
    get asV1020() {
        (0, assert_1.default)(this.isV1020);
        return this._chain.decodeEvent(this.event);
    }
    /**
     *  Transfer succeeded (from, to, value).
     */
    get isV1050() {
        return this._chain.getEventHash('Balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c';
    }
    /**
     *  Transfer succeeded (from, to, value).
     */
    get asV1050() {
        (0, assert_1.default)(this.isV1050);
        return this._chain.decodeEvent(this.event);
    }
    /**
     * Transfer succeeded.
     */
    get isV9130() {
        return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66';
    }
    /**
     * Transfer succeeded.
     */
    get asV9130() {
        (0, assert_1.default)(this.isV9130);
        return this._chain.decodeEvent(this.event);
    }
}
exports.BalancesTransferEvent = BalancesTransferEvent;
//# sourceMappingURL=events.js.map