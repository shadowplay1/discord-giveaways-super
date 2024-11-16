import { Giveaways } from '../../Giveaways';
import { Database } from '../../types/configurations';
import { DatabaseType } from '../../types/databaseType.enum';
import { IDebugResult } from '../../types/debug.interface';
import { JSONParser } from '../util/classes/JSONParser';
/**
 * Database manager class.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will determine
 * which connection configuration should be used.
 *
 * - `TKey` ({@link string}) - The type of database key that will be used.
 * - `TValue` ({@link any}) - The type of database values that will be used.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 * @template TKey The type of database key that will be used.
 * @template TValue The type of database values that will be used.
 */
export declare class DatabaseManager<TDatabaseType extends DatabaseType, TKey extends string, TValue> {
    /**
     * Database cache manager.
     * @type {CacheManager<TKey, IDatabaseGuild>}
     * @private
     */
    private _cache;
    /**
     * Giveaways logger.
     * @type {Logger}
     * @private
     */
    private readonly _logger;
    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     */
    giveaways: Giveaways<TDatabaseType, TKey, TValue>;
    /**
     * Database instance.
     * @type {Database<TDatabaseType, TKey, TValue>}
     */
    db: Database<TDatabaseType, TKey, TValue>;
    /**
     * Database type.
     * @type {DatabaseType}
     */
    databaseType: TDatabaseType;
    /**
     * JSON parser instance.
     * @type {JSONParser}
     */
    jsonParser?: JSONParser;
    /**
     * Database manager constructor.
     * @param {Giveaways<DatabaseType>} giveaways {@link Giveaways} instance.
     */
    constructor(giveaways: Giveaways<TDatabaseType, TKey, TValue>);
    /**
     * Initializes the database manager.
     * @returns {Promise<void>}
     */
    private _init;
    /**
     * Evaluates a database operation ands sends a debug log in the console.
     *
     * Type parameters:
     *
     * - `F` ({@link Function}) - The function type to be passed as database operation callback.
     *
     * @param {string} operation The database operation to put in the debug log.
     * @param {string} key The key of the database the operation was performed on.
     * @param {Function} toDebug The database operation callback function to call.
     * @param {boolean} [sendDebugLog=true] Whether the debug log should be sent in the console if debug mode is enabled.
     *
     * @returns {Promise<IDebugResult<ExtractPromisedType<ReturnType<F>>>>}
     * Return type of the database callback operation function.
     *
     * @template F The function type to be passed as database operation callback.
     * @private
     */
    private _debug;
    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is JSON.
     * @returns {boolean} Whether the database type is JSON.
     */
    isJSON(): this is Required<DatabaseManager<DatabaseType.JSON, TKey, TValue>>;
    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is MongoDB.
     * @returns {boolean} Whether the database type is MongoDB.
     */
    isMongoDB(): this is DatabaseManager<DatabaseType.MONGODB, TKey, TValue>;
    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is Enmap.
     * @returns {boolean} Whether the database type is Enmap.
     */
    isEnmap(): this is DatabaseManager<DatabaseType.ENMAP, TKey, TValue>;
    /**
     * Gets the object keys in database root or in object by specified key.
     * @param {TKey} [key] The key in database. Omitting this argument will get the keys from the root of database.
     * @returns {string[]} Database object keys array.
     */
    getKeys(key?: TKey): string[];
    /**
     * Gets the value from the **cache** by specified key.
     *
     * Type parameters:
     *
     * - `V` - The type of data being returned.
     *
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     *
     * @template V The type of data being returned.
     */
    get<V = any>(key: TKey): V;
    /**
     * Gets the value from **database** by specified key.
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    getFromDatabase<V = any>(key: TKey): Promise<V>;
    /**
     * Gets the value from the **cache** by specified key.
     *
     * - This method is an alias to {@link DatabaseManager.get()} method.
     *
     * Type parameters:
     *
     * - `V` - The type of data being returned.
     *
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     *
     * @template V The type of data being returned.
     */
    fetch<V = TValue>(key: TKey): V;
    /**
     * Determines if specified key exists in database.
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    has(key: TKey): boolean;
    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     *
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    includes(key: TKey): boolean;
    /**
     * Sets data in database.
     *
     * Type parameters:
     *
     * - `V` - The type of data being set.
     * - `R` - The type of data being returned.
     *
     * @param {TKey} key The key in database.
     * @param {V} value Any data to set.
     * @param {boolean} [sendDebugLog=true] Whether the debug log should be sent in the console if debug mode is enabled.
     * @returns {Promise<IDebugResult<R>>} The data from the database.
     *
     * @template V The type of data being set.
     * @template R The type of data being returned.
     */
    set<V = TValue, R = any>(key: TKey, value: V, sendDebugLog?: boolean): Promise<IDebugResult<R>>;
    /**
     * Clears the database.
     * @param {boolean} [sendDebugLog=true] Whether the debug log should be sent in the console if debug mode is enabled.
     * @returns {Promise<boolean>} `true` if cleared successfully, `false` otherwise.
     */
    clear(sendDebugLog?: boolean): Promise<boolean>;
    /**
     * Clears the database.
     *
     * - This method is an alias to {@link DatabaseManager.clear()} method.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    deleteAll(): Promise<boolean>;
    /**
     * Adds a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToAdd Any number to add.
     * @returns {Promise<IDebugResult<boolean>>} `true` if added successfully, `false` otherwise.
     */
    add(key: TKey, numberToAdd: number): Promise<IDebugResult<boolean>>;
    /**
     * Subtracts a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToSubtract Any number to subtract.
     * @returns {Promise<IDebugResult<boolean>>} `true` if subtracted successfully, `false` otherwise.
     */
    subtract(key: TKey, numberToSubtract: number): Promise<IDebugResult<boolean>>;
    /**
     * Deletes the data from database.
     * @param {TKey} key The key in database.
     * @returns {Promise<IDebugResult<boolean>>} `true` if deleted successfully, `false` otherwise.
     */
    delete(key: TKey): Promise<IDebugResult<boolean>>;
    /**
     * Pushes a value into specified array in database.
     *
     * Type parameters:
     *
     * - `V` - The type of data being pushed.
     *
     * @param {TKey} key The key in database.
     * @param {V} value Any value to push into database array.
     * @returns {Promise<IDebugResult<boolean>>} `true` if pushed successfully, `false` otherwise.
     *
     * @template V The type of data being pushed.
     */
    push<V = TValue>(key: TKey, value: V): Promise<IDebugResult<boolean>>;
    /**
     * Changes the specified element's value in a specified array in the database.
     *
     * Type parameters:
     *
     * - `V` - The type of data being pulled.
     *
     * @param {TKey} key The key in database.
     * @param {number} index The index in the target array.
     * @param {V} newValue The new value to set.
     * @returns {Promise<IDebugResult<boolean>>} `true` if pulled successfully, `false` otherwise.
     *
     * @template V The type of data being pulled.
     */
    pull<V = TValue>(key: TKey, index: number, newValue: V): Promise<IDebugResult<boolean>>;
    /**
     * Removes an element from a specified array in the database.
     * @param {TKey} key The key in database.
     * @param {number} index The index in the target array.
     * @returns {Promise<IDebugResult<boolean>>} `true` if popped successfully, `false` otherwise.
     */
    pop(key: TKey, index: number): Promise<IDebugResult<boolean>>;
    /**
     * Gets all the data in database.
     *
     * Type parameters:
     *
     * - `V` - The type of database object to return.
     *
     * @returns {V} Database object.
     * @template V The type of database object to return
     */
    all<V = TValue>(): V;
    /**
     * Gets the whole database object by making a direct database request.
     *
     * Type parameters:
     *
     * - `V` - The type of database object to return.
     *
     * @returns {Promise<V>} Database object.
     * @private
     *
     * @template V The type of database object to return.
     */
    private _allFromDatabase;
    /**
     * Loads the database into cache.
     * @returns {Promise<void>}
     */
    private _loadCache;
}
