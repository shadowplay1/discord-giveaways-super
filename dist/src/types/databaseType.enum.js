"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseType = void 0;
/**
 * An enum containing the possible database types.
 * @typedef {string} DatabaseType
 * @prop {string} JSON - The JSON database type.
 * @prop {string} MONGODB - The MongoDB database type.
 * @prop {string} ENMAP - The Enmap database type.
 */
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["JSON"] = "JSON";
    DatabaseType["MONGODB"] = "MongoDB";
    DatabaseType["ENMAP"] = "Enmap";
})(DatabaseType || (exports.DatabaseType = DatabaseType = {}));
