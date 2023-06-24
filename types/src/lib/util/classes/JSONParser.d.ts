/**
 * JSON parser class.
 */
export declare class JSONParser {
    /**
     * JSON database file path.
     * @type {string}
     */
    jsonFilePath: string;
    /**
     * JSON parser constructor.
     * @param {string} jsonFilePath JSON database file path.
     */
    constructor(jsonFilePath: string);
    /**
     * Fetches the JSON database object from specified file.
     * @returns {any} JSON database file object.
     */
    fetchDatabaseFile<V = any>(): Promise<V>;
    /**
     * Parses the key and fetches the value from JSON database.
     * @param {string} key The key in JSON database.
     * @returns {any} The data from JSON database.
     */
    get<V = any>(key: string): Promise<V>;
    /**
     * Parses the key and sets the value in JSON database.
     * @param {string} key The key in JSON database.
     * @returns {any} The data from JSON database.
     */
    set<V = any>(key: string, value: V): Promise<any>;
    /**
     * Parses the key and deletes it from JSON database.
     * @param {string} key The key in JSON database.
     * @returns {any} The data from JSON database.
     */
    delete(key: string): Promise<any>;
    /**
     * Clears the whole database
     * @returns {boolean} `true` if set successfully, `false` otherwise.
     */
    clear(): Promise<boolean>;
}
