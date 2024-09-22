"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayState = void 0;
/**
 * An enum that determines the state of a giveaway.
 * @typedef {number} GiveawayState
 * @prop {number} STARTED The giveaway has started.
 * @prop {number} ENDED The giveaway has ended.
 */
var GiveawayState;
(function (GiveawayState) {
    GiveawayState[GiveawayState["STARTED"] = 1] = "STARTED";
    GiveawayState[GiveawayState["ENDED"] = 2] = "ENDED";
})(GiveawayState || (exports.GiveawayState = GiveawayState = {}));
