import { IGiveawaysOptionalConfiguration } from '../types/configurations'

export const defaultConfig: IGiveawaysOptionalConfiguration = {
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
}
