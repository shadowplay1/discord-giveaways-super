"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = exports.GiveawaysErrorCodes = exports.GiveawaysError = void 0;
const databaseType_enum_1 = require("../../../types/databaseType.enum");
const typeOf_function_1 = require("../functions/typeOf.function");
/**
 * Giveaways error class.
 * @extends {Error}
 */
class GiveawaysError extends Error {
    /**
     * Error code.
     * @type {GiveawaysErrorCodes}
     */
    code;
    /**
     * Giveaways error constructor.
     * @param {GiveawaysErrorCodes} errorCode Error code to throw.
     */
    constructor(error, errorCode) {
        const errorMsg = exports.errorMessages;
        const isErrorCode = errorMsg[error];
        super(isErrorCode ? errorMsg[error] : error);
        /**
         * Error name.
         * @type {string}
         */
        this.name = `GiveawaysError${isErrorCode
            ? ` [${error}]`
            : errorCode ? ` [${errorCode}]` : ''}`;
        /**
         * Error code.
         * @type {GiveawaysErrorCodes}
         */
        this.code = isErrorCode
            ? error
            : errorCode ? errorCode : GiveawaysErrorCodes.MODULE_ERROR;
    }
}
exports.GiveawaysError = GiveawaysError;
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
var GiveawaysErrorCodes;
(function (GiveawaysErrorCodes) {
    GiveawaysErrorCodes["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    GiveawaysErrorCodes["UNKNOWN_DATABASE"] = "UNKNOWN_DATABASE";
    GiveawaysErrorCodes["NO_DISCORD_CLIENT"] = "NO_DISCORD_CLIENT";
    GiveawaysErrorCodes["DATABASE_ERROR"] = "DATABASE_ERROR";
    GiveawaysErrorCodes["MODULE_ERROR"] = "MODULE_ERROR";
    GiveawaysErrorCodes["INTENT_MISSING"] = "INTENT_MISSING";
    GiveawaysErrorCodes["REQUIRED_ARGUMENT_MISSING"] = "REQUIRED_ARGUMENT_MISSING";
    GiveawaysErrorCodes["REQUIRED_CONFIG_OPTION_MISSING"] = "REQUIRED_CONFIG_OPTION_MISSING";
    GiveawaysErrorCodes["INVALID_TYPE"] = "INVALID_TYPE";
    GiveawaysErrorCodes["INVALID_TARGET_TYPE"] = "INVALID_TARGET_TYPE";
    GiveawaysErrorCodes["UNKNOWN_GIVEAWAY"] = "UNKNOWN_GIVEAWAY";
    GiveawaysErrorCodes["INVALID_TIME"] = "INVALID_TIME";
    GiveawaysErrorCodes["GIVEAWAY_ALREADY_ENDED"] = "GIVEAWAY_ALREADY_ENDED";
    GiveawaysErrorCodes["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GiveawaysErrorCodes["INVALID_INPUT"] = "INVALID_INPUT";
})(GiveawaysErrorCodes || (exports.GiveawaysErrorCodes = GiveawaysErrorCodes = {}));
exports.errorMessages = {
    UNKNOWN_ERROR: 'Unknown error.',
    UNKNOWN_DATABASE: 'Unknown database type was specified.',
    NO_DISCORD_CLIENT: 'Discord Client should be specified.',
    INVALID_TIME: 'Invalid giveaway time was specified.',
    DATABASE_ERROR(databaseType, errorType) {
        if (databaseType == databaseType_enum_1.DatabaseType.JSON) {
            if (errorType == 'malformed') {
                return 'Database file is malformed.';
            }
            if (errorType == 'notFound') {
                return 'Database file path contains unexisting directories.';
            }
        }
        return `Unknown ${databaseType} error.`;
    },
    UNKNOWN_GIVEAWAY(giveawayMessageID) {
        return `Unknown giveaway with message ID ${giveawayMessageID}.`;
    },
    GIVEAWAY_ALREADY_ENDED(giveawayPrize, giveawayID) {
        return `Giveaway "${giveawayPrize}" (ID: ${giveawayID}) has already ended.`;
    },
    INTENT_MISSING(missingIntent) {
        return `Required intent "${missingIntent}" is missing.`;
    },
    INVALID_TYPE(parameter, requiredType, receivedType) {
        return `${parameter} must be a ${requiredType}. Received type: ${(0, typeOf_function_1.typeOf)(`${receivedType}`)}.`;
    },
    INVALID_TARGET_TYPE(requiredType, receivedType) {
        return `Target must be ${requiredType.toLowerCase().startsWith('a') ? 'an' : 'a'} ${requiredType}. ` +
            `Received type: ${(0, typeOf_function_1.typeOf)(receivedType)}.`;
    },
    // `method` parameter should be specified in format: `{ManagerName}.{methodName}`
    REQUIRED_ARGUMENT_MISSING(parameter, method) {
        return `${parameter} must be specified in '${method}()' method.`;
    },
    INVALID_INPUT(parameter, method, issue) {
        return `Invaid value of ${parameter} parameter in ${method} method: ${issue}`;
    },
    REQUIRED_CONFIG_OPTION_MISSING(requiredConfigOption) {
        return `Required configuration option "${requiredConfigOption}" is missing.`;
    },
    USER_NOT_FOUND(userID) {
        return `Specified user with ID ${userID} was not found.`;
    }
};
