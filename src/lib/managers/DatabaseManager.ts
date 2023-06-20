import { Giveaways } from '../../Giveaways'
import { Database } from '../../types/configurations'
import { DatabaseType } from '../../types/databaseType.enum'
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
    public jsonParser?: JSONParser

    /**
     * Database manager constructor.
     * @param {Giveaways<DatabaseType>} giveaways Giveaways instance.
     */
    public constructor(giveaways: Giveaways<TDatabase>) {
        this.giveaways = giveaways
        this.db = giveaways.db
        this.databaseType = giveaways.options.database

        if (this.databaseType == DatabaseType.JSON) {
            this.jsonParser = new JSONParser(((giveaways.options.connection) as any).path)
        }
    }

    /**
     * Gets the value from database by specified key.
     * @param key The key in database.
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
                return database.get(key)
            }
        }

        return null as any
    }

    /**
     * Sets data in database.
     * @param key The key in database.
     * @param value Any data to set in property.
     * @returns {boolean} `true` if set successfully, otherwise - `false`.
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
                database.set(key, value)

                return true
            }
        }

        return null as any
    }

    /**
     * Deletes the data from database.
     * @param key The key in database.
     * @returns {boolean} `true` if deleted successfully, otherwise - `false`.
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

                return data as V
            }

            case DatabaseType.ENMAP: {
                const allData: { [key: string]: any } = {}
                const database = this.db as Database<DatabaseType.ENMAP>

                for (const [key, value] of database.entries()) {
                    allData[key] = value
                }

                return allData as any
            }
        }

        return null as any
    }
}
