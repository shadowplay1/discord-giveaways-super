/**
 * Cache manager class.
 *
 * Type parameters:
 *
 * - `K` ({@link any}) - The cache map key type.
 * - `V` ({@link any}) - The cache map value type.
 *
 * @template K The cache map key type.
 * @template V The cache map value type.
 */
export declare class CacheManager<K extends string, V> {
    /**
     * Database cache.
     * @type {Map<K, V>}
     * @private
     */
    private _cache;
    /**
     * Cache manager constructor.
     */
    constructor();
    /**
     * Gets the cache map as an object.
     *
     * Type parameters:
     *
     * - `V` ({@link any}) - The type of cache object to return.
     *
     * @returns {any} Object representation of the cache map.
     * @template V The type of cache object to return.
     */
    getCacheObject<V = any>(): V;
    /**
     * Parses the key and fetches the value from cache map.
     *
     * Type parameters:
     *
     * - `V` ({@link any}) - The type of data being returned.
     *
     * @param {K} key The key in cache map.
     * @returns {V} The data from cache map.
     *
     * @template V The type of data being returned.
     */
    get<TValue = V>(key: K): TValue;
    /**
     * Parses the key and sets the value in cache map.
     *
     * Type parameters:
     *
     * - `TValue` ({@link any}) - The type of data being set.
     * - `R` ({@link any}) - The type of data being returned.
     *
     * @param {K} key The key in cache map.
     * @returns {R} The data from cache map.
     *
     * @template TValue The type of data being set.
     * @template R The type of data being returned.
     */
    set<TValue = V, R = any>(key: K, value: TValue): R;
    /**
     * Parses the key and deletes it from cache map.
     * @param {K} key The key in cache map.
     * @returns {boolean} `true` if deleted successfully.
     */
    delete(key: K): boolean;
    /**
     * Clears the cache.
     * @returns {boolean} `true` if cleared successfully.
     */
    clear(): boolean;
}
