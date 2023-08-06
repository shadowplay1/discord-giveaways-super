import { DatabaseType } from '../../../types/databaseType.enum';
import { DiscordID } from '../../../types/misc/utils';
/**
 * Giveaways error class.
 * @extends {Error}
 */
export declare class GiveawaysError extends Error {
    /**
     * Error code.
     * @type {GiveawaysErrorCodes}
     */
    code: GiveawaysErrorCodes;
    /**
     * Giveaways error constructor.
     * @param {GiveawaysErrorCodes} errorCode Error code to throw.
     */
    constructor(error: GiveawaysErrorCodes | string, errorCode?: GiveawaysErrorCodes);
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
export declare enum GiveawaysErrorCodes {
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    UNKNOWN_DATABASE = "UNKNOWN_DATABASE",
    NO_DISCORD_CLIENT = "NO_DISCORD_CLIENT",
    DATABASE_ERROR = "DATABASE_ERROR",
    MODULE_ERROR = "MODULE_ERROR",
    INTENT_MISSING = "INTENT_MISSING",
    REQUIRED_ARGUMENT_MISSING = "REQUIRED_ARGUMENT_MISSING",
    REQUIRED_CONFIG_OPTION_MISSING = "REQUIRED_CONFIG_OPTION_MISSING",
    INVALID_TYPE = "INVALID_TYPE",
    INVALID_TARGET_TYPE = "INVALID_TARGET_TYPE",
    UNKNOWN_GIVEAWAY = "UNKNOWN_GIVEAWAY",
    INVALID_TIME = "INVALID_TIME",
    GIVEAWAY_ALREADY_ENDED = "GIVEAWAY_ALREADY_ENDED",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INVALID_INPUT = "INVALID_INPUT"
}
export declare const errorMessages: {
    UNKNOWN_ERROR: string;
    UNKNOWN_DATABASE: string;
    NO_DISCORD_CLIENT: string;
    INVALID_TIME: string;
    DATABASE_ERROR(databaseType: DatabaseType, errorType?: 'malformed' | 'notFound'): string;
    UNKNOWN_GIVEAWAY(giveawayMessageID: string): string;
    GIVEAWAY_ALREADY_ENDED(giveawayPrize: string, giveawayID: number): string;
    INTENT_MISSING(missingIntent: string): string;
    INVALID_TYPE<T = any>(parameter: string, requiredType: string, receivedType: T): string;
    INVALID_TARGET_TYPE<T_1 = any>(requiredType: string, receivedType: T_1): string;
    REQUIRED_ARGUMENT_MISSING(parameter: string, method: `${string}.${string}`): string;
    INVALID_INPUT(parameter: string, method: `${string}.${string}`, issue: string): string;
    REQUIRED_CONFIG_OPTION_MISSING(requiredConfigOption: string): string;
    USER_NOT_FOUND<UserID extends string>(userID: DiscordID<UserID>): string;
};
