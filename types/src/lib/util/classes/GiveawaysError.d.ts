import { DatabaseType } from '../../../types/databaseType.enum';
/**
 * Giveaways error class.
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
    INVALID_TARGET_TYPE = "INVALID_TARGET_TYPE"
}
export declare const errorMessages: {
    UNKNOWN_ERROR: string;
    UNKNOWN_DATABASE: string;
    NO_DISCORD_CLIENT: string;
    DATABASE_ERROR(databaseType: DatabaseType, errorType?: 'malformed' | 'notFound'): string;
    INTENT_MISSING(missingIntent: string): string;
    INVALID_TYPE(parameter: string, requiredType: string, receivedType: string): string;
    INVALID_TARGET_TYPE(requiredType: string, receivedType: string): string;
    /**
     * Returns the `REQUIRED_ARGUMENT_MISSING` error message.
     * @param parameter Parameter name.
     * @param method `{ManagerName}.{methodName}`
     * @returns Error message
     */
    REQUIRED_ARGUMENT_MISSING(parameter: string, method: `${string}.${string}`): string;
    REQUIRED_CONFIG_OPTION_MISSING(requiredConfigOption: string): string;
};
