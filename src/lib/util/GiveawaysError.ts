import { DatabaseType } from '../../types/databaseType.enum'

/**
 * Giveaways error class.
 */
export class GiveawaysError extends Error {
    public code: GiveawaysErrorCodes

    /**
     * Giveaways error constructor.
     * @param {GiveawaysErrorCodes} errorCode Error code to throw.
     */
    public constructor(error: GiveawaysErrorCodes | string) {
        const isErrorCode = (errorMessages as any)[error]

        super(isErrorCode ? (errorMessages as any)[error] + '.' : error)

        /**
         * Error name.
         * @type {string}
         */
        this.name = `GiveawaysError${isErrorCode ? ` [${error}]` : ''}`

        /**
         * Error code.
         * @type {GiveawaysErrorCodes}
         */
        this.code = isErrorCode ? error as GiveawaysErrorCodes : GiveawaysErrorCodes.MODULE_ERROR
    }
}

export enum GiveawaysErrorCodes {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    UNKNOWN_DATABASE = 'UNKNOWN_DATABASE',
    NO_DISCORD_CLIENT = 'NO_DISCORD_CLIENT',
    DATABASE_ERROR = 'DATABASE_ERROR',
    MODULE_ERROR = 'MODULE_ERROR'
}

export const errorMessages = {
    UNKNOWN_ERROR: 'Unknown error',
    UNKNOWN_DATABASE: 'Unknown database type was specified',
    NO_DISCORD_CLIENT: 'Discord Client should be specified',

    DATABASE_ERROR(databaseType: DatabaseType, errorType?: 'malformed' | 'notFound'): string {
        if (databaseType == DatabaseType.JSON) {
            if (errorType == 'malformed') {
                return 'Database file is malformed.'
            }

            if (errorType == 'notFound') {
                return 'Database file path contains unexisting directories.'
            }
        }

        return `Unknown ${databaseType} error.`
    }
}
