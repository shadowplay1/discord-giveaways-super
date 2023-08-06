import { isObject } from '../util/functions/typeOf.function'

/**
 * Cache manager class.
 *
 * Type parameters:
 *
 * - `K` - The cache map key type.
 * - `V` - The cache map value type.
 *
 * @template K The cache map key type.
 * @template V The cache map value type.
 */
export class CacheManager<K extends string, V> {

    /**
     * Database cache.
     * @type {Map<K, V>}
     * @private
     */
    private _cache: Map<K, V>

    /**
     * Cache manager constructor.
     */
    public constructor() {

        /**
         * Database cache.
         * @type {Map<K, V>}
         * @private
         */
        this._cache = new Map<K, V>()
    }

    /**
     * Gets the cache map as an object.
     *
     * Type parameters:
     *
     * - `V` - The type of cache object to return.
     *
     * @returns {any} Object representation of the cache map.
     * @template V The type of cache object to return.
     */
    public getCacheObject<V = any>(): V {
        const mapData: Record<any, any> = {}

        for (const [key, value] of this._cache.entries()) {
            mapData[key] = value as any
        }

        return mapData
    }

    /**
     * Parses the key and fetches the value from cache map.
     *
     * Type parameters:
     *
     * - `V` - The type of data being returned.
     *
     * @param {K} key The key in cache map.
     * @returns {V} The data from cache map.
     *
     * @template V The type of data being returned.
     */
    public get<TValue = V>(key: K): TValue {
        let data = this.getCacheObject()

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
     * Parses the key and sets the value in cache map.
     *
     * Type parameters:
     *
     * - `TValue` - The type of data being set.
     * - `R` - The type of data being returned.
     *
     * @param {K} key The key in cache map.
     * @returns {R} The data from cache map.
     *
     * @template TValue The type of data being set.
     * @template R The type of data being returned.
     */
    public set<TValue = V, R = any>(key: K, value: TValue): R {
        const data = this.getCacheObject()

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

        this._cache.set(keys[0] as K, data[keys[0]])
        return data
    }

    /**
     * Parses the key and deletes it from cache map.
     * @param {K} key The key in cache map.
     * @returns {boolean} `true` if deleted successfully.
     */
    public delete(key: K): boolean {
        const data = this.getCacheObject()

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

        this._cache.set(keys[0] as K, data[keys[0]])
        return true
    }

    /**
     * Clears the cache.
     * @returns {boolean} `true` if cleared successfully.
     */
    public clear(): boolean {
        this._cache.clear()
        return true
    }
}
