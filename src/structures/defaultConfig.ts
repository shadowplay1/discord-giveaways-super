import { IGiveawaysConfigurationWithoutDatabase } from '../types/configurations'

export = {
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
} satisfies IGiveawaysConfigurationWithoutDatabase
