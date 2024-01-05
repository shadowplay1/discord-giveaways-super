import { Giveaways } from '../../Giveaways'

import { Database } from '../../types/configurations'
import { IDatabaseGuild } from '../../types/databaseStructure.interface'
import { DatabaseType } from '../../types/databaseType.enum'

import { ExtractPromisedType } from '../../types/misc/utils'
import { IDebugResult } from '../../types/debug.interface'

import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from '../util/classes/GiveawaysError'
import { JSONParser } from '../util/classes/JSONParser'
import { Logger } from '../util/classes/Logger'

import { CacheManager } from './CacheManager'

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
     * Database cache manager.
     * @type {CacheManager<TKey, IDatabaseGuild>}
     * @private
     */
    private _cache: CacheManager<TKey, IDatabaseGuild>

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
         * @type {CacheManager<TKey, IDatabaseGuild>}
         * @private
         */
        this._cache = new CacheManager<TKey, IDatabaseGuild>()

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
     * @returns {Promise<void>}
     */
    private async _init(): Promise<void> {
        if (this.isJSON()) {
            this.jsonParser = new JSONParser(this.giveaways.options.connection.path as string)
        }

        this._logger.debug('Loading the cache...')
        await this._loadCache()
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
     * @returns {Promise<ExtractPromisedType<ReturnType<R>>>} Return type of the database callback operation function.
     * @template F The function type to be passed as database operation callback.
     * @private
     */
    private async _debug<F extends () => Promise<any>>(
        operation: string,
        key: string,
        toDebug: F,
        sendDebugLog: boolean = true
    ): Promise<IDebugResult<ExtractPromisedType<ReturnType<F>>>> {
        try {
            const callbackResult = await toDebug()

            if (this.giveaways.options.debug && sendDebugLog) {
                this._logger.debug(`Performed "${operation}" operation on key "${key}".`)
            }

            return {
                error: null,
                result: callbackResult
            }
        } catch (err: any) {
            if (this.giveaways.options.debug && sendDebugLog) {
                this._logger.error(`Failed to perform "${operation}" operation on key "${key}": ${err.stack}`)
            }

            return {
                error: err,
                result: null
            }
        }
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
    public getKeys(key?: TKey): string[] {
        const database = key == undefined
            ? this.all<any>()
            : this.get<any>(key)

        return Object.keys(database)
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
    public get<V = any>(key: TKey): V {
        const data = this._cache.get<V>(key)
        return data
    }

    /**
     * Gets the value from **database** by specified key.
     * @param {TKey} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    public async getFromDatabase<V = any>(key: TKey): Promise<V> {
        if (this.isJSON()) {
            const data = await this.jsonParser.get<V>(key)
            return data
        }

        if (this.isMongoDB()) {
            const data = await this.db.get<V>(key)
            return data
        }

        if (this.isEnmap()) {
            const data = this.db.get(key)
            return data as any
        }

        return {} as V
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
    public fetch<V = TValue>(key: TKey): V {
        return this.get<V>(key)
    }

    /**
     * Determines if specified key exists in database.
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public has(key: TKey): boolean {
        const data = this.get(key)
        return !!data
    }

    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     *
     * @param {TKey} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public includes(key: TKey): boolean {
        return this.has(key)
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
    public async set<V = TValue, R = any>(key: TKey, value: V, sendDebugLog: boolean = true): Promise<IDebugResult<R>> {
        return this._debug('set', key, async (): Promise<R> => {
            this._cache.set<V, R>(key, value)

            if (this.isJSON()) {
                const data = await this.jsonParser.set<V, R>(key, value)
                return data
            }

            if (this.isMongoDB()) {
                const data = await this.db.set<V>(key, value as any)
                return data as any
            }

            if (this.isEnmap()) {
                this.db.set(key, value as any)

                const data = this.db.get(key)
                return data as any
            }

            return {} as R
        }, sendDebugLog)
    }


    /**
     * Clears the database.
     * @param {boolean} [sendDebugLog=true] Whether the debug log should be sent in the console if debug mode is enabled.
     * @returns {Promise<boolean>} `true` if cleared successfully, `false` otherwise.
     */
    public async clear(sendDebugLog: boolean = true): Promise<boolean> {
        this._cache.clear()

        if (this.giveaways.options.debug && sendDebugLog) {
            this._logger.debug('Performed "clear" operation on all database.')
        }

        if (this.isJSON()) {
            await this.jsonParser.clearDatabase()
            return true
        }

        if (this.isMongoDB()) {
            await this.db.clear()
            return true
        }

        if (this.isEnmap()) {
            this.db.deleteAll()
            return true
        }

        return false
    }

    /**
     * Clears the database.
     *
     * - This method is an alias to {@link DatabaseManager.clear()} method.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    public async deleteAll(): Promise<boolean> {
        if (this.giveaways.options.debug) {
            this._logger.debug('Performed "deleteAll" operation on all database.')
        }

        return this.clear(false)
    }

    /**
     * Adds a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToAdd Any number to add.
     * @returns {Promise<IDebugResult<boolean>>} `true` if added successfully, `false` otherwise.
     */
    public async add(key: TKey, numberToAdd: number): Promise<IDebugResult<boolean>> {
        return this._debug('add', key, async (): Promise<boolean> => {
            const targetNumber = this._cache.get<number>(key)

            if (!isNaN(targetNumber)) {
                this._cache.set<number>(key, targetNumber + numberToAdd)
            }

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
                const targetNumber = this.db.get(key) as any as number

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
        })
    }

    /**
     * Subtracts a number to the data in database.
     * @param {TKey} key The key in database.
     * @param {number} numberToSubtract Any number to subtract.
     * @returns {Promise<IDebugResult<boolean>>} `true` if subtracted successfully, `false` otherwise.
     */
    public async subtract(key: TKey, numberToSubtract: number): Promise<IDebugResult<boolean>> {
        return this._debug('subtract', key, async (): Promise<boolean> => {
            const targetNumber = this._cache.get<number>(key)

            if (!isNaN(targetNumber)) {
                this._cache.set<number>(key, targetNumber + numberToSubtract)
            }

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
                const targetNumber = this.db.get(key) as any as number

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
        })
    }

    /**
     * Deletes the data from database.
     * @param {TKey} key The key in database.
     * @returns {Promise<IDebugResult<boolean>>} `true` if deleted successfully, `false` otherwise.
     */
    public async delete(key: TKey): Promise<IDebugResult<boolean>> {
        return this._debug('delete', key, async (): Promise<boolean> => {
            this._cache.delete(key)

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
        })
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
    public async push<V = TValue>(key: TKey, value: V): Promise<IDebugResult<boolean>> {
        return this._debug('push', key, async (): Promise<boolean> => {
            const targetArray = this._cache.get<V[]>(key) || []

            if (Array.isArray(targetArray)) {
                targetArray.push(value)
                this._cache.set<V[]>(key, targetArray)
            }

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
                const targetArray = (await this.db.get<V[]>(key)) || []

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
        })
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
    public async pull<V = TValue>(key: TKey, index: number, newValue: V): Promise<IDebugResult<boolean>> {
        return this._debug('pull', key, async (): Promise<boolean> => {

            const targetArray = this._cache.get<V[]>(key) || []

            if (Array.isArray(targetArray)) {
                targetArray.splice(index, 1, newValue)
                this._cache.set<V[]>(key, targetArray as any)
            }

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
                const targetArray = (await this.db.get<V[]>(key)) || []

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
        })
    }


    /**
     * Removes an element from a specified array in the database.
     * @param {TKey} key The key in database.
     * @param {number} index The index in the target array.
     * @returns {Promise<IDebugResult<boolean>>} `true` if popped successfully, `false` otherwise.
     */
    public async pop(key: TKey, index: number): Promise<IDebugResult<boolean>> {
        return this._debug('pop', key, async (): Promise<boolean> => {
            const targetArray = this._cache.get<any[]>(key) || []

            if (Array.isArray(targetArray)) {
                targetArray.splice(index, 1)
                this._cache.set<any[]>(key, targetArray)
            }

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
                const targetArray = (await this.db.get<any[]>(key)) || []

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
        })
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
    public all<V = TValue>(): V {
        const data = this._cache.getCacheObject<V>()
        return data
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
    private async _allFromDatabase<V = TValue>(): Promise<V> {
        if (this.isJSON()) {
            const data = await this.jsonParser.fetchDatabaseFile<V>()
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
        const database = await this._allFromDatabase<Record<TKey, IDatabaseGuild>>()

        for (const guildID in database) {
            const guildDatabase = database[guildID]
            this._cache.set(guildID as any, guildDatabase)
        }
    }
}
