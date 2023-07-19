import { Giveaways } from '../../Giveaways'
import { Database, IJSONDatabaseConfiguration } from '../../types/configurations'
import { DatabaseType } from '../../types/databaseType.enum'
import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from '../util/classes/GiveawaysError'
import { JSONParser } from '../util/classes/JSONParser'

/**
 * Database manager class.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
export class DatabaseManager<TDatabaseType extends DatabaseType> {

    /**
     * Giveaways instance.
     * @type {Giveaways<DatabaseType>}
     */
    public giveaways: Giveaways<TDatabaseType>

    /**
     * Database instance.
     * @type {Database<DatabaseType>}
     */
    public db: Database<TDatabaseType>

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
     * @param {Giveaways<DatabaseType>} giveaways Giveaways instance.
     */
    public constructor(giveaways: Giveaways<TDatabaseType>) {

        /**
         * Giveaways instance.
         * @type {Giveaways<DatabaseType>}
         */
        this.giveaways = giveaways

        /**
         * Database instance.
         * @type {Database<DatabaseType>}
         */
        this.db = giveaways.db

        /**
         * Database type.
         * @type {DatabaseType}
         */
        this.databaseType = giveaways.options.database

        /**
         * JSON parser instance.
         * @type {JSONParser}
         */
        this.jsonParser = new JSONParser((giveaways.options.connection as IJSONDatabaseConfiguration).path)
    }

    /**
     * Gets the object keys in database root or in object by specified key.
     * @param {string} key The key in database.
     * @returns {string[]} Database object keys array.
     */
    public async getKeys(key?: string): Promise<string[]> {
        const database = key == undefined ? await this.all() : await this.get(key)
        return Object.keys(database)
    }

    /**
     * Gets the value from database by specified key.
     * @param {string} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    public async get<V = any>(key: string): Promise<V> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const data = this.jsonParser?.get(key)
                return data
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                const data = await database.get(key)

                return data
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                return database.get(key)
            }
        }

        return {} as V
    }

    /**
     * Gets the value from database by specified key.
     *
     * - This method is an alias to {@link DatabaseManager.get()} method.
     * @param {string} key The key in database.
     * @returns {V} Value from database.
     * @template V The type that represents the returning value in the method.
     */
    public async fetch<V = any>(key: string): Promise<V> {
        return this.get<V>(key)
    }

    /**
     * Determines if specified key exists in database.
     * @param {string} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public async has(key: string): Promise<boolean> {
        const data = await this.get(key)
        return !!data
    }

    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     * @param {string} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public async includes(key: string): Promise<boolean> {
        return this.has(key)
    }

    /**
     * Sets data in database.
     * @param {string} key The key in database.
     * @param {V} value Any data to set.
     * @returns {boolean} `true` if set successfully, `false` otherwise.
     * @template V The type that represents the specified `value` in the method.
     */
    public async set<V = any>(key: string, value: V): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                await this.jsonParser?.set(key, value)
                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                await database.set(key, value)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                database.set(key, value)

                return true
            }
        }

        return false
    }

    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} `true` if set successfully, `false` otherwise.
     */
    public async clear(): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                await this.jsonParser?.clear()
                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                await database.clear()

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                database.deleteAll()

                return true
            }
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
     * @param {string} key The key in database.
     * @param {number} numberToAdd Any number to add.
     * @returns {boolean} `true` if added successfully, `false` otherwise.
     */
    public async add(key: string, numberToAdd: number): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetNumber = await this.jsonParser?.get(key)

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                await this.jsonParser?.set(key, targetNumber + numberToAdd)
                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                const targetNumber = await database.get(key)

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                await database.set(key, targetNumber + numberToAdd)
                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                const targetNumber = database.get(key)

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                database.set(key, targetNumber + numberToAdd)
                return true
            }
        }

        return false
    }

    /**
     * Subtracts a number to the data in database.
     * @param {string} key The key in database.
     * @param {number} numberToSubtract Any number to subtract.
     * @returns {boolean} `true` if subtracted successfully, `false` otherwise.
     */
    public async subtract(key: string, numberToSubtract: number): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetNumber = await this.jsonParser?.get(key)

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                await this.jsonParser?.set(key, targetNumber - numberToSubtract)
                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                const targetNumber = await database.get(key)

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                await database.set(key, targetNumber - numberToSubtract)
                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                const targetNumber = database.get(key)

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                database.set(key, targetNumber - numberToSubtract)
                return true
            }
        }

        return false
    }

    /**
     * Deletes the data from database.
     * @param {string} key The key in database.
     * @returns {boolean} `true` if deleted successfully, `false` otherwise.
     */
    public async delete(key: string): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                await this.jsonParser?.delete(key)
                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                await database.delete(key)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                database.delete(key)

                return true
            }
        }

        return false
    }

    /**
     * Pushes a value into specified array in database.
     * @param {string} key The key in database.
     * @param {V} value Any value to push into database array.
     * @returns {Promise<boolean>} `true` if pushed successfully, `false` otherwise.
     * @template V The type that represents the specified `value` in the method.
     */
    public async push<V = any>(key: string, value: V): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetArray = await this.jsonParser?.get<any[]>(key) || []

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.push(value)
                await this.jsonParser?.set(key, targetArray)

                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                const targetArray = await database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.push(value)
                await database.set(key, targetArray)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                const targetArray = database.get(key) || []

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.push(value)
                database.set(key, targetArray)

                return true
            }
        }

        return false
    }

    /**
     * Changes the specified element's value in a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the target array.
     * @param {V} newValue The new value to set.
     * @returns {Promise<boolean>} `true` if pulled successfully, `false` otherwise.
     * @template V The type that represents the specified `newValue` in the method.
     */
    public async pull<V = any>(key: string, index: number, newValue: V): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetArray = await this.jsonParser?.get(key) || []

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1, newValue)
                await this.jsonParser?.set(key, targetArray)

                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                const targetArray = await database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1, newValue)
                await database.set(key, targetArray)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                const targetArray = database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1, newValue)
                database.set(key, targetArray)

                return true
            }
        }

        return false
    }

    /**
     * Removes an element from a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the target array.
     * @returns {Promise<boolean>} `true` if popped successfully, `false` otherwise.
     */
    public async pop(key: string, index: number): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetArray = await this.jsonParser?.get<any[]>(key) || []

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1)
                await this.jsonParser?.set(key, targetArray)

                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB> as any
                const targetArray = await database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1)
                await database.set(key, targetArray)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP> as any
                const targetArray = database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1)
                database.set(key, targetArray)

                return true
            }
        }

        return false
    }

    /**
     * Gets the whole database object.
     * @returns {Promise<V>} Database object.
     * @template V The type that represents the returning value in the method.
     */
    public async all<V = any>(): Promise<V> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const data = this.jsonParser?.fetchDatabaseFile()
                return data
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                const data = await database.all<any>()

                return data
            }

            case DatabaseType.ENMAP: {
                const allData: any = {}
                const database = this.db as Database<DatabaseType.ENMAP>

                for (const databaseKey of database.keys()) {
                    const keys = databaseKey.split('.')
                    let currentObject = allData

                    for (let i = 0; i < keys.length; i++) {
                        const currentKey = keys[i]

                        if (keys.length - 1 === i) {
                            currentObject[currentKey] = database.get(databaseKey) || null
                        } else {
                            if (!currentObject[currentKey]) {
                                currentObject[currentKey] = {}
                            }
                            currentObject = currentObject[currentKey]
                        }
                    }
                }

                return allData
            }
        }

        return {} as V
    }
}
