"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const databaseType_enum_1 = require("../../types/databaseType.enum");
const GiveawaysError_1 = require("../util/classes/GiveawaysError");
const JSONParser_1 = require("../util/classes/JSONParser");
const Logger_1 = require("../util/classes/Logger");
const CacheManager_1 = require("./CacheManager");
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
class DatabaseManager {
    /**
     * Database cache manager.
     * @type {CacheManager<TKey, IDatabaseGuild>}
     * @private
     */
    _cache;
    /**
     * Giveaways logger.
     * @type {Logger}
     * @private
     */
    _logger;
    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     */
    giveaways;
    /**
     * Database instance.
     * @type {Database<TDatabaseType, TKey, TValue>}
     */
    db;
    /**
     * Database type.
     * @type {DatabaseType}
     */
    databaseType;
    /**
     * JSON parser instance.
     * @type {JSONParser}
     */
    jsonParser;
    /**
     * Database manager constructor.
     * @param {Giveaways<DatabaseType>} giveaways {@link Giveaways} instance.
     */
    constructor(giveaways) {
        /**
         * Database cache.
         * @type {CacheManager<TKey, IDatabaseGuild>}
         * @private
         */
        this._cache = new CacheManager_1.CacheManager();
        /**
         * Giveaways logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger_1.Logger(giveaways.options.debug);
        /**
         * {@link Giveaways} instance.
         * @type {Giveaways<DatabaseType>}
         */
        this.giveaways = giveaways;
        /**
         * Database instance.
         * @type {Database<TDatabaseType, TKey, TValue>}
         */
        this.db = giveaways.db;
        /**
         * Database type.
         * @type {DatabaseType}
         */
        this.databaseType = giveaways.options.database;
        /**
         * JSON parser instance.
         * @type {?JSONParser}
         */
        this.jsonParser = null;
        this._init();
    }
    /**
     * Initializes the database manager.
     * @returns {Promise<void>}
     */
    async _init() {
        if (this.isJSON()) {
            this.jsonParser = new JSONParser_1.JSONParser(this.giveaways.options.connection.path);
        }
        this._logger.debug('Loading the cache...');
        await this._loadCache();
    }
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
    async _debug(operation, key, toDebug, sendDebugLog = true) {
        try {
            const callbackResult = await toDebug();
            if (this.giveaways.options.debug && sendDebugLog) {
                this._logger.debug(`Performed "${operation}" operation on key "${key}".`);
            }
            return {
                error: null,
                result: callbackResult
            };
        }
        catch (err) {
            if (this.giveaways.options.debug && sendDebugLog) {
                this._logger.error(`Failed to perform "${operation}" operation on key "${key}": ${err.stack}`);
            }
            return {
                error: err,
                result: null
            };
        }
    }
    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is JSON.
     * @returns {boolean} Whether the database type is JSON.
     */
    isJSON() {
        return this.giveaways.options.database == databaseType_enum_1.DatabaseType.JSON;
    }
    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is MongoDB.
     * @returns {boolean} Whether the database type is MongoDB.
     */
    isMongoDB() {
        return this.giveaways.options.database == databaseType_enum_1.DatabaseType.MONGODB;
    }
    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is Enmap.
     * @returns {boolean} Whether the database type is Enmap.
     */
    isEnmap() {
        return this.giveaways.options.database == databaseType_enum_1.DatabaseType.ENMAP;
    }
    /**
     * Gets the object keys in database root or in object by specified key.
     * @param {TKey} [key] The key in database. Omitting this argument will get the keys from the root of database.
     * @returns {string[]} Database object keys array.
     */
    getKeys(key) {
        const database = key == undefined
            ? this.all()
            : this.get(key);
        return Object.keys(database);
    }
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
    get(key) {
        const data = this._cache.get(key);
        return data;
    }
    /**
     * Gets the value from **database** by specified key.
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    async getFromDatabase(key) {
        if (this.isJSON()) {
            const data = await this.jsonParser.get(key);
            return data;
        }
        if (this.isMongoDB()) {
            const data = await this.db.get(key);
            return data;
        }
        if (this.isEnmap()) {
            const data = this.db.get(key);
            return data;
        }
        return {};
    }
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
    fetch(key) {
        return this.get(key);
    }
    /**
     * Determines if specified key exists in database.
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    has(key) {
        const data = this.get(key);
        return !!data;
    }
    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     *
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    includes(key) {
        return this.has(key);
    }
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
    async set(key, value, sendDebugLog = true) {
        return this._debug('set', key, async () => {
            this._cache.set(key, value);
            if (this.isJSON()) {
                const data = await this.jsonParser.set(key, value);
                return data;
            }
            if (this.isMongoDB()) {
                const data = await this.db.set(key, value);
                return data;
            }
            if (this.isEnmap()) {
                this.db.set(key, value);
                const data = this.db.get(key);
                return data;
            }
            return {};
        }, sendDebugLog);
    }
    /**
     * Clears the database.
     * @param {boolean} [sendDebugLog=true] Whether the debug log should be sent in the console if debug mode is enabled.
     * @returns {Promise<boolean>} `true` if cleared successfully, `false` otherwise.
     */
    async clear(sendDebugLog = true) {
        this._cache.clear();
        if (this.giveaways.options.debug && sendDebugLog) {
            this._logger.debug('Performed "clear" operation on all database.');
        }
        if (this.isJSON()) {
            await this.jsonParser.clearDatabase();
            return true;
        }
        if (this.isMongoDB()) {
            await this.db.clear();
            return true;
        }
        if (this.isEnmap()) {
            this.db.deleteAll();
            return true;
        }
        return false;
    }
    /**
     * Clears the database.
     *
     * - This method is an alias to {@link DatabaseManager.clear()} method.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    async deleteAll() {
        if (this.giveaways.options.debug) {
            this._logger.debug('Performed "deleteAll" operation on all database.');
        }
        return this.clear(false);
    }
    /**
     * Adds a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToAdd Any number to add.
     * @returns {Promise<IDebugResult<boolean>>} `true` if added successfully, `false` otherwise.
     */
    async add(key, numberToAdd) {
        return this._debug('add', key, async () => {
            const targetNumber = this._cache.get(key);
            if (!isNaN(targetNumber)) {
                this._cache.set(key, targetNumber + numberToAdd);
            }
            if (this.isJSON()) {
                const targetNumber = await this.jsonParser.get(key);
                if (isNaN(targetNumber)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('number', targetNumber), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                await this.jsonParser.set(key, targetNumber + numberToAdd);
                return true;
            }
            if (this.isMongoDB()) {
                const targetNumber = await this.db.get(key);
                if (isNaN(targetNumber)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('number', targetNumber), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                await this.db.set(key, targetNumber + numberToAdd);
                return true;
            }
            if (this.isEnmap()) {
                const targetNumber = this.db.get(key);
                if (isNaN(targetNumber)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('number', targetNumber), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                this.db.set(key, targetNumber + numberToAdd);
                return true;
            }
            return false;
        });
    }
    /**
     * Subtracts a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToSubtract Any number to subtract.
     * @returns {Promise<IDebugResult<boolean>>} `true` if subtracted successfully, `false` otherwise.
     */
    async subtract(key, numberToSubtract) {
        return this._debug('subtract', key, async () => {
            const targetNumber = this._cache.get(key);
            if (!isNaN(targetNumber)) {
                this._cache.set(key, targetNumber + numberToSubtract);
            }
            if (this.isJSON()) {
                const targetNumber = await this.jsonParser.get(key);
                if (isNaN(targetNumber)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('number', targetNumber), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                await this.jsonParser.set(key, targetNumber - numberToSubtract);
                return true;
            }
            if (this.isMongoDB()) {
                const targetNumber = await this.db.get(key);
                if (isNaN(targetNumber)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('number', targetNumber), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                await this.db.set(key, targetNumber - numberToSubtract);
                return true;
            }
            if (this.isEnmap()) {
                const targetNumber = this.db.get(key);
                if (isNaN(targetNumber)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('number', targetNumber), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                this.db.set(key, targetNumber - numberToSubtract);
                return true;
            }
            return false;
        });
    }
    /**
     * Deletes the data from database.
     * @param {TKey} key The key in database.
     * @returns {Promise<IDebugResult<boolean>>} `true` if deleted successfully, `false` otherwise.
     */
    async delete(key) {
        return this._debug('delete', key, async () => {
            this._cache.delete(key);
            if (this.isJSON()) {
                await this.jsonParser.delete(key);
                return true;
            }
            if (this.isMongoDB()) {
                await this.db.delete(key);
                return true;
            }
            if (this.isEnmap()) {
                this.db.delete(key);
                return true;
            }
            return false;
        });
    }
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
    async push(key, value) {
        return this._debug('push', key, async () => {
            const targetArray = this._cache.get(key) || [];
            if (Array.isArray(targetArray)) {
                targetArray.push(value);
                this._cache.set(key, targetArray);
            }
            if (this.isJSON()) {
                const targetArray = await this.jsonParser.get(key) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.push(value);
                await this.jsonParser.set(key, targetArray);
                return true;
            }
            if (this.isMongoDB()) {
                const targetArray = (await this.db.get(key)) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.push(value);
                await this.db.set(key, targetArray);
                return true;
            }
            if (this.isEnmap()) {
                const targetArray = (this.db.get(key) || []);
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.push(value);
                this.db.set(key, targetArray);
                return true;
            }
            return false;
        });
    }
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
    async pull(key, index, newValue) {
        return this._debug('pull', key, async () => {
            const targetArray = this._cache.get(key) || [];
            if (Array.isArray(targetArray)) {
                targetArray.splice(index, 1, newValue);
                this._cache.set(key, targetArray);
            }
            if (this.isJSON()) {
                const targetArray = await this.jsonParser.get(key) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.splice(index, 1, newValue);
                await this.jsonParser.set(key, targetArray);
                return true;
            }
            if (this.isMongoDB()) {
                const targetArray = (await this.db.get(key)) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.splice(index, 1, newValue);
                await this.db.set(key, targetArray);
                return true;
            }
            if (this.isEnmap()) {
                const targetArray = (this.db.get(key) || []);
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.splice(index, 1, newValue);
                this.db.set(key, targetArray);
                return true;
            }
            return false;
        });
    }
    /**
     * Removes an element from a specified array in the database.
     * @param {TKey} key The key in database.
     * @param {number} index The index in the target array.
     * @returns {Promise<IDebugResult<boolean>>} `true` if popped successfully, `false` otherwise.
     */
    async pop(key, index) {
        return this._debug('pop', key, async () => {
            const targetArray = this._cache.get(key) || [];
            if (Array.isArray(targetArray)) {
                targetArray.splice(index, 1);
                this._cache.set(key, targetArray);
            }
            if (this.isJSON()) {
                const targetArray = await this.jsonParser.get(key) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.splice(index, 1);
                await this.jsonParser.set(key, targetArray);
                return true;
            }
            if (this.isMongoDB()) {
                const targetArray = (await this.db.get(key)) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.splice(index, 1);
                await this.db.set(key, targetArray);
                return true;
            }
            if (this.isEnmap()) {
                const targetArray = this.db.get(key) || [];
                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TARGET_TYPE('array', targetArray), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TARGET_TYPE);
                }
                targetArray.splice(index, 1);
                this.db.set(key, targetArray);
                return true;
            }
            return false;
        });
    }
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
    all() {
        const data = this._cache.getCacheObject();
        return data;
    }
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
    async _allFromDatabase() {
        if (this.isJSON()) {
            const data = await this.jsonParser.fetchDatabaseFile();
            return data;
        }
        if (this.isMongoDB()) {
            const data = await this.db.all();
            return data;
        }
        if (this.isEnmap()) {
            const allData = {};
            for (const databaseKey of this.db.keys()) {
                const keys = databaseKey.split('.');
                let currentObject = allData;
                for (let i = 0; i < keys.length; i++) {
                    const currentKey = keys[i];
                    if (keys.length - 1 === i) {
                        currentObject[currentKey] = this.db.get(databaseKey) || null;
                    }
                    else {
                        if (!currentObject[currentKey]) {
                            currentObject[currentKey] = {};
                        }
                        currentObject = currentObject[currentKey];
                    }
                }
            }
            return allData;
        }
        return {};
    }
    /**
     * Loads the database into cache.
     * @returns {Promise<void>}
     */
    async _loadCache() {
        const database = await this._allFromDatabase();
        for (const guildID in database) {
            const guildDatabase = database[guildID];
            this._cache.set(guildID, guildDatabase);
        }
    }
}
exports.DatabaseManager = DatabaseManager;
