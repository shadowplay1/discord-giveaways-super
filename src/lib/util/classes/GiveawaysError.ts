import { DatabaseType } from '../../../types/databaseType.enum'
import { typeOf } from '../functions/typeOf.function'

/**
 * Giveaways error class.
 */
export class GiveawaysError extends Error {

    /**
     * Error code.
     * @type {GiveawaysErrorCodes}
     */
    public code: GiveawaysErrorCodes

    /**
     * Giveaways error constructor.
     * @param {GiveawaysErrorCodes} errorCode Error code to throw.
     */
    public constructor(error: GiveawaysErrorCodes | string, errorCode?: GiveawaysErrorCodes) {
        const isErrorCode = (errorMessages as any)[error] || errorCode

        super(isErrorCode ? (errorMessages as any)[error] : error)

        /**
         * Error name.
         * @type {string}
         */
        this.name = `GiveawaysError${isErrorCode
            ? ` [${error}]`
            : errorCode ? ` [${error}]` : ''}`

        /**
         * Error code.
         * @type {GiveawaysErrorCodes}
         */
        this.code = isErrorCode
            ? error as GiveawaysErrorCodes
            : errorCode ? errorCode : GiveawaysErrorCodes.MODULE_ERROR
    }
}

export enum GiveawaysErrorCodes {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    UNKNOWN_DATABASE = 'UNKNOWN_DATABASE',
    NO_DISCORD_CLIENT = 'NO_DISCORD_CLIENT',
    DATABASE_ERROR = 'DATABASE_ERROR',
    MODULE_ERROR = 'MODULE_ERROR',
    INTENT_MISSING = 'INTENT_MISSING',
    REQUIRED_ARGUMENT_MISSING = 'REQUIRED_ARGUMENT_MISSING',
    REQUIRED_CONFIG_OPTION_MISSING = 'REQUIRED_CONFIG_OPTION_MISSING',
    INVALID_TYPE = 'INVALID_TYPE',
    INVALID_TARGET_TYPE = 'INVALID_TARGET_TYPE'
}

export const errorMessages = {
    UNKNOWN_ERROR: 'Unknown error.',
    UNKNOWN_DATABASE: 'Unknown database type was specified.',
    NO_DISCORD_CLIENT: 'Discord Client should be specified.',

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
    },

    INTENT_MISSING(missingIntent: string): string {
        return `Required intent "${missingIntent}" is missing.`
    },

    INVALID_TYPE(parameter: string, requiredType: string, receivedType: string): string {
        return `${parameter} must be a ${requiredType}. Received type: ${typeOf(receivedType)}.`
    },

    INVALID_TARGET_TYPE(requiredType: string, receivedType: string): string {
        return `Target must be a ${requiredType}. Received type: ${typeOf(receivedType)}.`
    },

    /**
     * Returns the `REQUIRED_ARGUMENT_MISSING` error message.
     * @param parameter Parameter name.
     * @param method `{ManagerName}.{methodName}`
     * @returns Error message
     */
    REQUIRED_ARGUMENT_MISSING(parameter: string, method: `${string}.${string}`): string {
        return `${parameter} must be specified in '${method}()' method.`
    },

    REQUIRED_CONFIG_OPTION_MISSING(requiredConfigOption: string): string {
        return `Required configuration option "${requiredConfigOption}" is missing.`
    }
}
