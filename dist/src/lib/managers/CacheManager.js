"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const typeOf_function_1 = require("../util/functions/typeOf.function");
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
class CacheManager {
    /**
     * Database cache.
     * @type {Map<K, V>}
     * @private
     */
    _cache;
    /**
     * Cache manager constructor.
     */
    constructor() {
        /**
         * Database cache.
         * @type {Map<K, V>}
         * @private
         */
        this._cache = new Map();
    }
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
    getCacheObject() {
        const mapData = {};
        for (const [key, value] of this._cache.entries()) {
            mapData[key] = value;
        }
        return mapData;
    }
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
    get(key) {
        let data = this.getCacheObject();
        let parsedData = data;
        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                data = parsedData?.[keys[i]] || null;
            }
            parsedData = parsedData?.[keys[i]];
        }
        return data;
    }
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
    set(key, value) {
        const data = this.getCacheObject();
        let updatedData = data;
        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                updatedData[keys[i]] = value;
            }
            else if (!(0, typeOf_function_1.isObject)(data[keys[i]])) {
                updatedData[keys[i]] = {};
            }
            updatedData = updatedData?.[keys[i]];
        }
        this._cache.set(keys[0], data[keys[0]]);
        return data;
    }
    /**
     * Parses the key and deletes it from cache map.
     * @param {K} key The key in cache map.
     * @returns {boolean} `true` if deleted successfully.
     */
    delete(key) {
        const data = this.getCacheObject();
        let updatedData = data;
        const keys = key.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (keys.length - 1 == i) {
                delete updatedData[keys[i]];
            }
            else if (!(0, typeOf_function_1.isObject)(data[keys[i]])) {
                updatedData[keys[i]] = {};
            }
            updatedData = updatedData?.[keys[i]];
        }
        this._cache.set(keys[0], data[keys[0]]);
        return true;
    }
    /**
     * Clears the cache.
     * @returns {boolean} `true` if cleared successfully.
     */
    clear() {
        this._cache.clear();
        return true;
    }
}
exports.CacheManager = CacheManager;
