import { Giveaways } from '../../Giveaways'
import { Database } from '../../types/configurations'
import { DatabaseType } from '../../types/databaseType.enum'
import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from '../util/classes/GiveawaysError'
import { JSONParser } from '../util/classes/JSONParser'

/**
 * Database manager class.
 */
export class DatabaseManager<TDatabase extends DatabaseType> {

    /**
     * Giveaways instance.
     * @type {Giveaways<DatabaseType>}
     */
    public giveaways: Giveaways<TDatabase>

    /**
     * Database instance.
     * @type {Database<DatabaseType>}
     */
    public db: Database<TDatabase>

    /**
     * Database type.
     * @type {DatabaseType}
     */
    public databaseType: TDatabase

    /**
     * JSON parser instance.
     * @type {JSONParser}
     */
    public jsonParser?: JSONParser

    /**
     * Database manager constructor.
     * @param {Giveaways<DatabaseType>} giveaways Giveaways instance.
     */
    public constructor(giveaways: Giveaways<TDatabase>) {

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

        if (this.databaseType == DatabaseType.JSON) {

            /**
             * JSON parser instance.
             * @type {JSONParser}
             */
            this.jsonParser = new JSONParser(((giveaways.options.connection) as any).path)
        }
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
     * @returns {any} Value from database.
     */
    public async get<V = any>(key: string): Promise<V> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const data = this.jsonParser?.get(key)
                return data
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                const data = await database.get(key)

                return data
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                return database.get(key) as any
            }
        }

        return null as any
    }

    /**
     * Gets the value from database by specified key.
     *
     * - This method is an alias to {@link DatabaseManager.get()} method.
     * @param {string} key The key in database.
     * @returns {any} Value from database.
     */
    public async fetch<V = any>(key: string): Promise<V> {
        return this.get<V>(key)
    }

    /**
     * Determines if specified key exists in database.
     * @param {string} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public async has<V = any>(key: string): Promise<boolean> {
        const data = await this.get<V>(key)
        return !!data
    }

    /**
     * Determines if specified key exists in database.
     *
     * - This method is an alias to {@link DatabaseManager.has()} method.
     * @param {string} key The key in database.
     * @returns {boolean} Boolean value that determines if specified key exists in database.
     */
    public async includes<V = any>(key: string): Promise<boolean> {
        const data = await this.get<V>(key)
        return !!data
    }

    /**
     * Sets data in database.
     * @param {string} key The key in database.
     * @param {any} value Any data to set.
     * @returns {boolean} `true` if set successfully, `false` otherwise.
     */
    public async set<V = any>(key: string, value: V): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                await this.jsonParser?.set(key, value)
                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                await database.set(key, value)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                database.set(key, value as any)

                return true
            }
        }

        return null as any
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
                const database = this.db as Database<DatabaseType.MONGODB>
                await database.clear()
                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                database.deleteAll()

                return true
            }
        }

        return null as any
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
                const database = this.db as Database<DatabaseType.MONGODB>
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
                const database = this.db as Database<DatabaseType.ENMAP>
                const targetNumber = database.get(key) as any

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

        return null as any
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
                const database = this.db as Database<DatabaseType.MONGODB>
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
                const database = this.db as Database<DatabaseType.ENMAP>
                const targetNumber = database.get(key) as any

                if (isNaN(targetNumber)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('number', targetNumber),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                database.set(key, (targetNumber - numberToSubtract) as any)
                return true
            }
        }

        return null as any
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
                const database = this.db as Database<DatabaseType.MONGODB>
                await database.delete(key)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                database.delete(key)

                return true
            }
        }

        return null as any
    }

    /**
     * Pushes a value into specified array in database.
     * @param {string} key The key in database.
     * @param {any} value Any value to push into database array.
     * @returns {Promise<boolean>} `true` if pushed successfully, `false` otherwise.
     */
    public async push<V = any>(key: string, value: V): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetArray = await this.jsonParser?.get<any[]>(key) || []

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.push(value)
                await this.jsonParser?.set(key, targetArray)

                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                const targetArray = await database.get<any[]>(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.push(value)
                await database.set(key, targetArray)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                const targetArray = database.get(key) || [] as any[]

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.push(value)
                database.set(key, targetArray as any)

                return true
            }
        }

        return null as any
    }

    /**
     * Changes the specified element's value in a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the target array.
     * @param {any} newValue The new value to set.
     * @returns {Promise<boolean>} `true` if pulled successfully, `false` otherwise.
     */
    public async pull<V = any>(key: string, index: number, newValue: V): Promise<boolean> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const targetArray = await this.jsonParser?.get<any[]>(key) || []

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1, newValue)
                await this.jsonParser?.set(key, targetArray)

                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                const targetArray = await database.get<any[]>(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1, newValue)
                await database.set(key, targetArray)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                const targetArray = database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1, newValue)
                database.set(key, targetArray)

                return true
            }
        }

        return null as any
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
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1)
                await this.jsonParser?.set(key, targetArray)

                return true
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                const targetArray = await database.get<any[]>(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1)
                await database.set(key, targetArray)

                return true
            }

            case DatabaseType.ENMAP: {
                const database = this.db as Database<DatabaseType.ENMAP>
                const targetArray = database.get(key)

                if (!Array.isArray(targetArray)) {
                    throw new GiveawaysError(
                        errorMessages.INVALID_TARGET_TYPE('array', targetArray as any),
                        GiveawaysErrorCodes.INVALID_TARGET_TYPE
                    )
                }

                targetArray.splice(index, 1)
                database.set(key, targetArray)

                return true
            }
        }

        return null as any
    }

    /**
     * Gets the whole database object.
     * @returns {Promise<V>} Database object.
     */
    public async all<V = any>(): Promise<V> {
        switch (this.databaseType) {
            case DatabaseType.JSON: {
                const data = this.jsonParser?.fetchDatabaseFile()
                return data
            }

            case DatabaseType.MONGODB: {
                const database = this.db as Database<DatabaseType.MONGODB>
                const data = await database.all()

                return data as any
            }

            case DatabaseType.ENMAP: {
                const allData: { [key: string]: any } = {}
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

                return allData as any
            }
        }

        return null as any
    }
}
