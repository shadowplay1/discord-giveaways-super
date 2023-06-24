import { Giveaways } from '../../Giveaways';
import { Database } from '../../types/configurations';
import { DatabaseType } from '../../types/databaseType.enum';
import { JSONParser } from '../util/classes/JSONParser';
/**
 * Database manager class.
 */
export declare class DatabaseManager<TDatabase extends DatabaseType> {
    /**
     * Giveaways instance.
     * @type {Giveaways<DatabaseType>}
     */
    giveaways: Giveaways<TDatabase>;
    /**
     * Database instance.
     * @type {Database<DatabaseType>}
     */
    db: Database<TDatabase>;
    /**
     * Database type.
     * @type {DatabaseType}
     */
    databaseType: TDatabase;
    /**
     * JSON parser instance.
     * @type {JSONParser}
     */
    jsonParser?: JSONParser;
    /**
     * Database manager constructor.
     * @param {Giveaways<DatabaseType>} giveaways Giveaways instance.
     */
    constructor(giveaways: Giveaways<TDatabase>);
    /**
     * Gets the object keys in database root or in object by specified key.
     * @param {string} key The key in database.
     * @returns {string[]} Database object keys array.
     */
    getKeys(key?: string): Promise<string[]>;
    /**
     * Gets the value from database by specified key.
     * @param {string} key The key in database.
     * @returns {any} Value from database.
     */
    get<V = any>(key: string): Promise<V>;
    /**
     * Gets the value from database by specified key.
     *
     * - This method is an alias to {@link DatabaseManager.get()} method.
     * @param {string} key The key in database.
     * @returns {any} Value from database.
     */
    fetch<V = any>(key: string): Promise<V>;
    /**
     * Determines if specified key exists in database.
     * @param {string} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    has<V = any>(key: string): Promise<boolean>;
    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     * @param {string} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    includes<V = any>(key: string): Promise<boolean>;
    /**
     * Sets data in database.
     * @param {string} key The key in database.
     * @param {any} value Any data to set.
     * @returns {boolean} `true` if set successfully, `false` otherwise.
     */
    set<V = any>(key: string, value: V): Promise<boolean>;
    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    clear(): Promise<boolean>;
    /**
     * Clears the whole database.
     *
     * - This method is an alias to {@link DatabaseManager.clear()} method.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    deleteAll(): Promise<boolean>;
    /**
     * Adds a number to the data in database.
     * @param {string} key The key in database.
     * @param {number} numberToAdd Any number to add.
     * @returns {boolean} `true` if added successfully, `false` otherwise.
     */
    add(key: string, numberToAdd: number): Promise<boolean>;
    /**
     * Subtracts a number to the data in database.
     * @param {string} key The key in database.
     * @param {number} numberToSubtract Any number to subtract.
     * @returns {boolean} `true` if subtracted successfully, `false` otherwise.
     */
    subtract(key: string, numberToSubtract: number): Promise<boolean>;
    /**
     * Deletes the data from database.
     * @param {string} key The key in database.
     * @returns {boolean} `true` if deleted successfully, `false` otherwise.
     */
    delete(key: string): Promise<boolean>;
    /**
     * Pushes a value into specified array in database.
     * @param {string} key The key in database.
     * @param {any} value Any value to push into database array.
     * @returns {Promise<boolean>} `true` if pushed successfully, `false` otherwise.
     */
    push<V = any>(key: string, value: V): Promise<boolean>;
    /**
     * Changes the specified element's value in a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the target array.
     * @param {any} newValue The new value to set.
     * @returns {Promise<boolean>} `true` if pulled successfully, `false` otherwise.
     */
    pull<V = any>(key: string, index: number, newValue: V): Promise<boolean>;
    /**
     * Removes an element from a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the target array.
     * @returns {Promise<boolean>} `true` if popped successfully, `false` otherwise.
     */
    pop(key: string, index: number): Promise<boolean>;
    /**
     * Gets the whole database object.
     * @returns {Promise<V>} Database object.
     */
    all<V = any>(): Promise<V>;
}
