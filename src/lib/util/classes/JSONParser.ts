import { readFile, writeFile } from 'fs/promises'
import { isObject } from '../functions/typeOf.function'

/**
 * JSON parser class.
 */
export class JSONParser {

    /**
     * JSON database file path.
     * @type {string}
     */
    public jsonFilePath: string

    /**
     * Minifies the JSON content in database file to save some space.
     * @type {boolean}
     */
    public minifyJSON: boolean

    /**
     * JSON parser constructor.
     * @param {string} jsonFilePath JSON database file path.
     * @param {boolean} minifyJSON Minifies the JSON content in database file to save some space.
     */
    public constructor(jsonFilePath: string, minifyJSON: boolean = false) {

        /**
         * JSON database file path.
         * @type {string}
         */
        this.jsonFilePath = jsonFilePath

        /**
         * Minifies the JSON content in database file to save some space.
         * @type {boolean}
         */
        this.minifyJSON = minifyJSON
    }

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
    public async fetchDatabaseFile<V = any>(): Promise<V> {
        const fileContent = await readFile(this.jsonFilePath, 'utf-8')
        return JSON.parse(fileContent)
    }

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
    public async get<V = any>(key: string): Promise<V> {
        let data = await this.fetchDatabaseFile()

        let parsedData = data
        const keys = key.split('.')

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                data = parsedData?.[keys[i]] || null
            }

            parsedData = parsedData?.[keys[i]]
        }

        return data
    }

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
    public async set<V = any, R = any>(key: string, value: V): Promise<R> {
        const data = await this.fetchDatabaseFile()

        let updatedData = data
        const keys = key.split('.')

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                updatedData[keys[i]] = value

            } else if (!isObject(data[keys[i]])) {
                updatedData[keys[i]] = {}
            }

            updatedData = updatedData?.[keys[i]]
        }

        await writeFile(this.jsonFilePath, JSON.stringify(data, null, this.minifyJSON ? undefined : '\t'))
        return data
    }

    /**
     * Parses the key and deletes it from JSON database.
     * @param {string} key The key in JSON database.
     * @returns {Promise<boolean>} `true` if deleted successfully.
     */
    public async delete(key: string): Promise<boolean> {
        const data = await this.fetchDatabaseFile()

        let updatedData = data
        const keys = key.split('.')

        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                delete updatedData[keys[i]]

            } else if (!isObject(data[keys[i]])) {
                updatedData[keys[i]] = {}
            }

            updatedData = updatedData?.[keys[i]]
        }

        await writeFile(this.jsonFilePath, JSON.stringify(data, null, this.minifyJSON ? undefined : '\t'))
        return true
    }

    /**
     * Clears the database.
     * @returns {Promise<boolean>} `true` if cleared successfully.
     */
    public async clearDatabase(): Promise<boolean> {
        await writeFile(this.jsonFilePath, '{}')
        return true
    }
}
