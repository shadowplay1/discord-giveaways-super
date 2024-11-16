"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParser = void 0;
const promises_1 = require("fs/promises");
const typeOf_function_1 = require("../functions/typeOf.function");
/**
 * JSON parser class.
 */
class JSONParser {
    /**
     * JSON database file path.
     * @type {string}
     */
    jsonFilePath;
    /**
     * Minifies the JSON content in database file to save some space.
     * @type {boolean}
     */
    minifyJSON;
    /**
     * JSON parser constructor.
     * @param {string} jsonFilePath JSON database file path.
     * @param {boolean} minifyJSON Minifies the JSON content in database file to save some space.
     */
    constructor(jsonFilePath, minifyJSON = false) {
        /**
         * JSON database file path.
         * @type {string}
         */
        this.jsonFilePath = jsonFilePath;
        /**
         * Minifies the JSON content in database file to save some space.
         * @type {boolean}
         */
        this.minifyJSON = minifyJSON;
    }
    /**
     * Fetches the JSON database object from specified file.
     *
     * Type parameters:
     *
     * - `V` - The type of database object to return.
     *
     * @returns {Promise<V>} JSON database file object.
     *
     * @template V The type of database object to return.
     */
    async fetchDatabaseFile() {
        const fileContent = await (0, promises_1.readFile)(this.jsonFilePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    /**
     * Parses the key and fetches the value from JSON database.
     *
     * Type parameters:
     *
     * - `V` - The type of data being returned.
     *
     * @param {string} key The key in JSON database.
     * @returns {Promise<V>} The data from JSON database.
     *
     * @template V The type of data being returned.
     */
    async get(key) {
        let data = await this.fetchDatabaseFile();
        let parsedData = data;
        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                data = parsedData?.[keys[i]] || null;
            }
            parsedData = parsedData?.[keys[i]];
        }
        return data;
    }
    /**
     * Parses the key and sets the value in JSON database.
     *
     * Type parameters:
     *
     * - `V` - The type of data being set.
     * - `R` - The type of data being returned.
     *
     * @param {string} key The key in JSON database.
     * @returns {Promise<R>} The data from JSON database.
     *
     * @template V The type of data being set.
     * @template R The type of data being returned.
     */
    async set(key, value) {
        const data = await this.fetchDatabaseFile();
        let updatedData = data;
        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                updatedData[keys[i]] = value;
            }
            else if (!(0, typeOf_function_1.isObject)(data[keys[i]])) {
                updatedData[keys[i]] = {};
            }
            updatedData = updatedData?.[keys[i]];
        }
        await (0, promises_1.writeFile)(this.jsonFilePath, JSON.stringify(data, null, this.minifyJSON ? undefined : '\t'));
        return data;
    }
    /**
     * Parses the key and deletes it from JSON database.
     * @param {string} key The key in JSON database.
     * @returns {Promise<boolean>} `true` if deleted successfully.
     */
    async delete(key) {
        const data = await this.fetchDatabaseFile();
        let updatedData = data;
        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                delete updatedData[keys[i]];
            }
            else if (!(0, typeOf_function_1.isObject)(data[keys[i]])) {
                updatedData[keys[i]] = {};
            }
            updatedData = updatedData?.[keys[i]];
        }
        await (0, promises_1.writeFile)(this.jsonFilePath, JSON.stringify(data, null, this.minifyJSON ? undefined : '\t'));
        return true;
    }
    /**
     * Clears the database.
     * @returns {Promise<boolean>} `true` if cleared successfully.
     */
    async clearDatabase() {
        await (0, promises_1.writeFile)(this.jsonFilePath, '{}');
        return true;
    }
}
exports.JSONParser = JSONParser;
