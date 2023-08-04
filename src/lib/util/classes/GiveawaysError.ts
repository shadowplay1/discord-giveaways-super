import { DatabaseType } from '../../../types/databaseType.enum'
import { DiscordID } from '../../../types/misc/utils'
import { typeOf } from '../functions/typeOf.function'

/**
 * Giveaways error class.
 * @extends {Error}
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
        const errorMsg: Record<string, any> = errorMessages
        const isErrorCode = errorMsg[error]

        super(isErrorCode ? errorMsg[error] : error)

        /**
         * Error name.
         * @type {string}
         */
        this.name = `GiveawaysError${isErrorCode
            ? ` [${error}]`
            : errorCode ? ` [${errorCode}]` : ''}`

        /**
         * Error code.
         * @type {GiveawaysErrorCodes}
         */
        this.code = isErrorCode
            ? error as GiveawaysErrorCodes
            : errorCode ? errorCode : GiveawaysErrorCodes.MODULE_ERROR
    }
}

/**
 * An enum representing the error codes for the Giveaways module.
 * @typedef {string} GiveawaysErrorCodes
 * @prop {string} UNKNOWN_ERROR An unknown error occurred.
 * @prop {string} UNKNOWN_DATABASE The database is unknown or inaccessible.
 * @prop {string} NO_DISCORD_CLIENT No Discord client was provided.
 * @prop {string} DATABASE_ERROR There was an error with the database.
 * @prop {string} MODULE_ERROR There was an error with the Giveaways module.
 * @prop {string} INTENT_MISSING The required intent is missing.
 * @prop {string} REQUIRED_ARGUMENT_MISSING A required argument is missing.
 * @prop {string} REQUIRED_CONFIG_OPTION_MISSING A required configuration option is missing.
 * @prop {string} INVALID_TYPE The type is invalid.
 * @prop {string} INVALID_TARGET_TYPE The target type is invalid.
 * @prop {string} UNKNOWN_GIVEAWAY The giveaway is unknown.
 * @prop {string} INVALID_TIME The time is invalid.
 * @prop {string} GIVEAWAY_ALREADY_ENDED Giveaway already ended.
 * @prop {string} USER_NOT_FOUND User not found.
 * @prop {string} INVALID_INPUT Invalid input.
 */
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
    INVALID_TARGET_TYPE = 'INVALID_TARGET_TYPE',
    UNKNOWN_GIVEAWAY = 'UNKNOWN_GIVEAWAY',
    INVALID_TIME = 'INVALID_TIME',
    GIVEAWAY_ALREADY_ENDED = 'GIVEAWAY_ALREADY_ENDED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INVALID_INPUT = 'INVALID_INPUT'
}

export const errorMessages = {
    UNKNOWN_ERROR: 'Unknown error.',
    UNKNOWN_DATABASE: 'Unknown database type was specified.',
    NO_DISCORD_CLIENT: 'Discord Client should be specified.',
    INVALID_TIME: 'Invalid giveaway time was specified.',

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

    UNKNOWN_GIVEAWAY(giveawayMessageID: string): string {
        return `Unknown giveaway with message ID ${giveawayMessageID}.`
    },

    GIVEAWAY_ALREADY_ENDED(giveawayPrize: string, giveawayID: number): string {
        return `Giveaway "${giveawayPrize}" (ID: ${giveawayID}) has already ended.`
    },

    INTENT_MISSING(missingIntent: string): string {
        return `Required intent "${missingIntent}" is missing.`
    },

    INVALID_TYPE<T = any>(parameter: string, requiredType: string, receivedType: T): string {
        return `${parameter} must be a ${requiredType}. Received type: ${typeOf(`${receivedType}`)}.`
    },

    INVALID_TARGET_TYPE<T = any>(requiredType: string, receivedType: T): string {
        return `Target must be ${requiredType.toLowerCase().startsWith('a') ? 'an' : 'a'} ${requiredType}. ` +
            `Received type: ${typeOf(receivedType)}.`
    },

    // `method` parameter should be specified in format: `{ManagerName}.{methodName}`
    REQUIRED_ARGUMENT_MISSING(parameter: string, method: `${string}.${string}`): string {
        return `${parameter} must be specified in '${method}()' method.`
    },

    INVALID_INPUT(parameter: string, method: `${string}.${string}`, issue: string): string {
        return `Invaid value of ${parameter} parameter in ${method} method: ${issue}`
    },

    REQUIRED_CONFIG_OPTION_MISSING(requiredConfigOption: string): string {
        return `Required configuration option "${requiredConfigOption}" is missing.`
    },

    USER_NOT_FOUND<UserID extends string>(userID: DiscordID<UserID>): string {
        return `Specified user with ID ${userID} was not found.`
    }
}
