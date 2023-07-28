import { Giveaways } from '../../Giveaways'

import { Database } from '../../types/configurations'
import { IDatabaseStructure } from '../../types/databaseStructure.interface'
import { DatabaseType } from '../../types/databaseType.enum'

import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from '../util/classes/GiveawaysError'
import { JSONParser } from '../util/classes/JSONParser'
import { Logger } from '../util/classes/Logger'

/**
 * Database manager class.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will determine
 * which connection configuration should be used.
 * - `TKey` ({@link string}) - The type of database key that will be used.
 * - `TValue` ({@link any}) - The type of database values that will be used.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 * @template TKey The type of database key that will be used.
 * @template TValue The type of database values that will be used.
 */
export class DatabaseManager<TDatabaseType extends DatabaseType, TKey extends string, TValue> {

    /**
     * Database cache.
     * @type {Map<string, IDatabaseStructure>}
     * @private
     */
    private _cache: Map<string, IDatabaseStructure>

    /**
     * Giveaways logger.
     * @type {Logger}
     * @private
     */
    private readonly _logger: Logger

    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     */
    public giveaways: Giveaways<TDatabaseType, TKey, TValue>

    /**
     * Database instance.
     * @type {Database<TDatabaseType, TKey, TValue>}
     */
    public db: Database<TDatabaseType, TKey, TValue>

    /**
     * Database type.
     * @type {DatabaseType}
     */
    public databaseType: TDatabaseType

    /**
     * JSON parser instance.
     * @type {JSONParser}
     */
    public jsonParser?: JSONParser

    /**
     * Database manager constructor.
     * @param {Giveaways<DatabaseType>} giveaways {@link Giveaways} instance.
     */
    public constructor(giveaways: Giveaways<TDatabaseType, TKey, TValue>) {

        /**
         * Database cache.
         * @type {Map<string, IDatabaseStructure>}
         * @private
         */
        this._cache = new Map<string, IDatabaseStructure>()

        /**
         * Giveaways logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(giveaways.options.debug)

        /**
         * {@link Giveaways} instance.
         * @type {Giveaways<DatabaseType>}
         */
        this.giveaways = giveaways

        /**
         * Database instance.
         * @type {Database<TDatabaseType, TKey, TValue>}
         */
        this.db = giveaways.db

        /**
         * Database type.
         * @type {DatabaseType}
         */
        this.databaseType = giveaways.options.database

        /**
         * JSON parser instance.
         * @type {?JSONParser}
         */
        this.jsonParser = null as any

        this._init()
    }

    /**
     * Initializes the database manager.
     * @returns {void}
     */
    private _init(): void {
        if (this.isJSON()) {
            this.jsonParser = new JSONParser(this.giveaways.options.connection.path as string)
        }

        this._logger.debug('Loading the cache...')
        this._loadCache()
    }

    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is JSON.
     * @returns {boolean} Whether the database type is JSON.
     */
    public isJSON(): this is Required<DatabaseManager<DatabaseType.JSON, TKey, TValue>> {
        return this.giveaways.options.database == DatabaseType.JSON
    }

    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is MongoDB.
     * @returns {boolean} Whether the database type is MongoDB.
     */
    public isMongoDB(): this is DatabaseManager<DatabaseType.MONGODB, TKey, TValue> {
        return this.giveaways.options.database == DatabaseType.MONGODB
    }

    /**
     * [TYPE GUARD FUNCTION] - Determines if the databse type is Enmap.
     * @returns {boolean} Whether the database type is Enmap.
     */
    public isEnmap(): this is DatabaseManager<DatabaseType.ENMAP, TKey, TValue> {
        return this.giveaways.options.database == DatabaseType.ENMAP
    }

    /**
     * Gets the object keys in database root or in object by specified key.
     * @param {TKey} [key] The key in database. Omitting this argument will get the keys from the root of database.
     * @returns {string[]} Database object keys array.
     */
    public async getKeys(key?: TKey): Promise<string[]> {
        const database = key == undefined ? await this.all() : await this.get(key)
        return Object.keys(database)
    }

    /**
     * Gets the value from database by specified key.
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    public async get<V>(key: TKey): Promise<V> {

        if (this.isJSON()) {
            const data = this.jsonParser.get<V>(key)
            return data
        }

        if (this.isMongoDB()) {
            const data = await this.db.get<V>(key)
            return data
        }

        if (this.isEnmap()) {
            const data = this.db.get(key)
            return data as V
        }

        return {} as V
    }

    /**
     * Gets the value from database by specified key.
     *
     * - This method is an alias to {@link DatabaseManager.get()} method.
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    public async fetch<V = any>(key: TKey): Promise<V> {
        return this.get<V>(key)
    }

    /**
     * Determines if specified key exists in database.
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public async has(key: TKey): Promise<boolean> {
        const data = await this.get(key)
        return !!data
    }

    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public async includes(key: TKey): Promise<boolean> {
        return this.has(key)
    }

    /**
     * Sets data in database.
     * @param {TKey} key The key in database.
     * @param {V} value Any data to set.
     * @returns {boolean} `true` if set successfully, `false` otherwise.
     * @template V The type that represents the specified `value` in the method.
     */
    public async set<V = any>(key: TKey, value: V): Promise<boolean> {
        if (this.isJSON()) {
            await this.jsonParser.set(key, value)
            return true
        }

        if (this.isMongoDB()) {
            const database = this.db
            await database.set(key, value as any)

            return true
        }

        if (this.isEnmap()) {
            const database = this.db
            database.set(key, value as any)

            return true
        }

        return false
    }


    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    public async clear(): Promise<boolean> {
        if (this.isJSON()) {
            await this.jsonParser.clear()
            return true
        }

        if (this.isMongoDB()) {
            const database = this.db
            await database.clear()

            return true
        }

        if (this.isEnmap()) {
            const database = this.db
            database.deleteAll()

            return true
        }

        return false
    }

    /**
     * Clears the whole database.
     *
     * - This method is an alias to {@link DatabaseManager.clear()} method.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    public async deleteAll(): Promise<boolean> {
        return this.clear()
    }

    /**
     * Adds a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToAdd Any number to add.
     * @returns {boolean} `true` if added successfully, `false` otherwise.
     */
    public async add(key: TKey, numberToAdd: number): Promise<boolean> {
        if (this.isJSON()) {
            const targetNumber = await this.jsonParser.get<number>(key)

            if (isNaN(targetNumber)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            await this.jsonParser.set(key, targetNumber + numberToAdd)
            return true
        }

        if (this.isMongoDB()) {
            const targetNumber = await this.db.get<number>(key)

            if (isNaN(targetNumber)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            await this.db.set(key, targetNumber + numberToAdd as any)
            return true
        }

        if (this.isEnmap()) {
            const targetNumber = this.db.get(key) as number

            if (isNaN(targetNumber)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            this.db.set(key, targetNumber + numberToAdd as any)
            return true
        }

        return false
    }


    /**
     * Subtracts a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToSubtract Any number to subtract.
     * @returns {boolean} `true` if subtracted successfully, `false` otherwise.
     */
    public async subtract(key: TKey, numberToSubtract: number): Promise<boolean> {
        if (this.isJSON()) {
            const targetNumber = await this.jsonParser.get<number>(key)

            if (isNaN(targetNumber)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            await this.jsonParser.set(key, targetNumber - numberToSubtract)
            return true
        }

        if (this.isMongoDB()) {
            const targetNumber = await this.db.get<number>(key)

            if (isNaN(targetNumber)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            await this.db.set(key, targetNumber - numberToSubtract as any)
            return true
        }

        if (this.isEnmap()) {
            const targetNumber = this.db.get(key) as number

            if (isNaN(targetNumber)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            this.db.set(key, targetNumber - numberToSubtract as any)
            return true
        }

        return false
    }

    /**
     * Deletes the data from database.
     * @param {TKey} key The key in database.
     * @returns {boolean} `true` if deleted successfully, `false` otherwise.
     */
    public async delete(key: TKey): Promise<boolean> {
        if (this.isJSON()) {
            await this.jsonParser.delete(key)
            return true
        }

        if (this.isMongoDB()) {
            await this.db.delete(key)
            return true
        }

        if (this.isEnmap()) {
            this.db.delete(key)
            return true
        }

        return false
    }

    /**
     * Pushes a value into specified array in database.
     * @param {TKey} key The key in database.
     * @param {V} value Any value to push into database array.
     * @returns {Promise<boolean>} `true` if pushed successfully, `false` otherwise.
     * @template V The type that represents the specified `value` in the method.
     */
    public async push<V = any>(key: TKey, value: V): Promise<boolean> {
        if (this.isJSON()) {
            const targetArray = await this.jsonParser.get<V[]>(key) || []

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.push(value)
            await this.jsonParser.set(key, targetArray)

            return true
        }

        if (this.isMongoDB()) {
            const targetArray = await this.db.get<V[]>(key)

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.push(value)
            await this.db.set(key, targetArray)

            return true
        }

        if (this.isEnmap()) {
            const targetArray = (this.db.get(key) || []) as any[]

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.push(value)
            this.db.set(key, targetArray as any)

            return true
        }

        return false
    }

    /**
     * Changes the specified element's value in a specified array in the database.
     * @param {TKey} key The key in database.
     * @param {number} index The index in the target array.
     * @param {V} newValue The new value to set.
     * @returns {Promise<boolean>} `true` if pulled successfully, `false` otherwise.
     * @template V The type that represents the specified `newValue` in the method.
     */
    public async pull<V = any>(key: TKey, index: number, newValue: V): Promise<boolean> {
        if (this.isJSON()) {
            const targetArray = await this.jsonParser.get<V[]>(key) || []

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.splice(index, 1, newValue)
            await this.jsonParser.set(key, targetArray)

            return true
        }

        if (this.isMongoDB()) {
            const targetArray = await this.db.get<V[]>(key)

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.splice(index, 1, newValue)
            await this.db.set(key, targetArray)

            return true
        }

        if (this.isEnmap()) {
            const targetArray = (this.db.get(key) || []) as any[]

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.splice(index, 1, newValue)
            this.db.set(key, targetArray as any)

            return true
        }

        return false
    }


    /**
     * Removes an element from a specified array in the database.
     * @param {TKey} key The key in database.
     * @param {number} index The index in the target array.
     * @returns {Promise<boolean>} `true` if popped successfully, `false` otherwise.
     */
    public async pop(key: TKey, index: number): Promise<boolean> {
        if (this.isJSON()) {
            const targetArray = await this.jsonParser.get<any[]>(key) || []

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.splice(index, 1)
            await this.jsonParser.set(key, targetArray)

            return true
        }

        if (this.isMongoDB()) {
            const targetArray = await this.db.get<any[]>(key)

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.splice(index, 1)
            await this.db.set(key, targetArray)

            return true
        }

        if (this.isEnmap()) {
            const targetArray = this.db.get(key) || []

            if (!Array.isArray(targetArray)) {
                throw new GiveawaysError(
                    errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                    GiveawaysErrorCodes.INVALID_TARGET_TYPE
                )
            }

            targetArray.splice(index, 1)
            this.db.set(key, targetArray as any)

            return true
        }

        return false
    }


    /**
     * Gets all the data in database.
     * @returns {Promise<V>} Database object.
     * @template V The type that represents the returning value in the method.
     */
    public async all<V = any>(): Promise<V> {
        if (this.isJSON()) {
            const data = this.jsonParser.fetchDatabaseFile<V>()
            return data
        }

        if (this.isMongoDB()) {
            const data = await this.db.all<V>()
            return data
        }

        if (this.isEnmap()) {
            const allData: Record<string, any> = {}

            for (const databaseKey of this.db.keys()) {
                const keys = databaseKey.split('.')
                let currentObject = allData

                for (let i = 0; i < keys.length; i++) {
                    const currentKey = keys[i]

                    if (keys.length - 1 === i) {
                        currentObject[currentKey] = this.db.get(databaseKey) || null
                    } else {
                        if (!currentObject[currentKey]) {
                            currentObject[currentKey] = {}
                        }
                        currentObject = currentObject[currentKey]
                    }
                }
            }

            return allData as V
        }

        return {} as V
    }

    /**
     * Gets the whole database object by making a direct database request.
     * @returns {Promise<V>} Database object.
     * @template V The type that represents the returning value in the method.
     * @private
     */
    private async _allDatabase<V = any>(): Promise<V> {
        if (this.isJSON()) {
            const data = this.jsonParser.fetchDatabaseFile<V>()
            return data
        }

        if (this.isMongoDB()) {
            const data = await this.db.all<V>()
            return data
        }

        if (this.isEnmap()) {
            const allData: Record<string, any> = {}

            for (const databaseKey of this.db.keys()) {
                const keys = databaseKey.split('.')
                let currentObject = allData

                for (let i = 0; i < keys.length; i++) {
                    const currentKey = keys[i]

                    if (keys.length - 1 === i) {
                        currentObject[currentKey] = this.db.get(databaseKey) || null
                    } else {
                        if (!currentObject[currentKey]) {
                            currentObject[currentKey] = {}
                        }
                        currentObject = currentObject[currentKey]
                    }
                }
            }

            return allData as V
        }

        return {} as V
    }

    /**
     * Loads the database into cache.
     * @returns {Promise<void>}
     */
    private async _loadCache(): Promise<void> {
        const database = await this.all()

        for (const [key, value] of Object.entries(database) as [string, any]) {
            this._cache.set(key, value)
        }
    }
}
