"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedObject = void 0;
/**
 * Utility class for working with objects.
 *
 * Provides **static** methods for retrieving keys and values of an object.
 *
 * This class enhances type safety by providing better typings for object keys and values.
 */
class TypedObject {
    /**
     * Returns the names of the enumerable string properties and methods of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object keys types from.
     *
     * @param {any} obj Object that contains the properties and methods.
     *
     * @returns {Array<ExtractObjectKeys<TObject>>}
     * Array of names of the enumerable string properties and methods of the specified object.
     */
    static keys(obj) {
        return Object.keys(obj || {});
    }
    /**
     * Returns an array of values of the enumerable properties of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object values types from.
     *
     * @param {any} obj Object that contains the properties and methods.
     *
     * @returns {Array<ExtractObjectValues<TObject>>}
     * Array of values of the enumerable properties of the specified object.
     */
    static values(obj) {
        return Object.values(obj || {});
    }
    /**
     * Returns an array of key-value pairs of the enumerable properties of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object key-value pairs types from.
     *
     * @param {any} obj Object that contains the properties and methods.
     * @returns {Array<any>} Array of key-value pairs of the enumerable properties of the specified object.
     */
    static entries(obj) {
        return Object.entries(obj || {});
    }
}
exports.TypedObject = TypedObject;
