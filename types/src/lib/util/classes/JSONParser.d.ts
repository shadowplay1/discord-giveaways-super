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
     * Minifies the JSON content in database file to save some space.
     * @type {boolean}
     */
    minifyJSON: boolean;
    /**
     * JSON parser constructor.
     * @param {string} jsonFilePath JSON database file path.
     * @param {boolean} minifyJSON Minifies the JSON content in database file to save some space.
     */
    constructor(jsonFilePath: string, minifyJSON?: boolean);
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
    fetchDatabaseFile<V = any>(): Promise<V>;
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
    get<V = any>(key: string): Promise<V>;
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
    set<V = any, R = any>(key: string, value: V): Promise<R>;
    /**
     * Parses the key and deletes it from JSON database.
     * @param {string} key The key in JSON database.
     * @returns {Promise<boolean>} `true` if deleted successfully.
     */
    delete(key: string): Promise<boolean>;
    /**
     * Clears the database.
     * @returns {Promise<boolean>} `true` if cleared successfully.
     */
    clearDatabase(): Promise<boolean>;
}
