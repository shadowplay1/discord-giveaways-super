"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    giveawaysCheckingInterval: 1000,
    minGiveawayEntries: 1,
    updatesChecker: {
        checkUpdates: true,
        upToDateMessage: false
    },
    configurationChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: false
    },
    debug: false
};
