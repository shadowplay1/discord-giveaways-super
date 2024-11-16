import { MaybeUndefined } from '../../../types/misc/utils';
/**
 * Utility class for working with objects.
 *
 * Provides **static** methods for retrieving keys and values of an object.
 *
 * This class enhances type safety by providing better typings for object keys and values.
 */
export declare class TypedObject {
    /**
     * Returns the names of the enumerable string properties and methods of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object keys types from.
     *
     * @param {TObject} obj Object that contains the properties and methods.
     *
     * @returns {Array<ExtractObjectKeys<TObject>>}
     * Array of names of the enumerable string properties and methods of the specified object.
     */
    static keys<TObject extends Record<string, any>>(obj: MaybeUndefined<TObject>): ExtractObjectKeys<TObject>[];
    /**
     * Returns an array of values of the enumerable properties of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object values types from.
     *
     * @param {TObject} obj Object that contains the properties and methods.
     *
     * @returns {Array<ExtractObjectValues<TObject>>}
     * Array of values of the enumerable properties of the specified object.
     */
    static values<TObject extends Record<string, any>>(obj: TObject): ExtractObjectValues<TObject>[];
    /**
     * Returns an array of key-value pairs of the enumerable properties of an object.
     *
     * Type parameters:
     *
     * - `TObject` (`Record<string, any>`) - The object to get the object key-value pairs types from.
     *
     * @param {TObject} obj Object that contains the properties and methods.
     * @returns {Array<any>} Array of key-value pairs of the enumerable properties of the specified object.
     */
    static entries<TObject extends Record<string, any>>(obj: TObject): [ExtractObjectKeys<TObject>, ExtractObjectValues<TObject>][];
}
/**
 * Extracts the object keys from the specified object and returns them in a union.
 *
 * Type parameters:
 *
 * - `T` (`Record<string, any>`) - The object to get the object keys types from.
 *
 * @template T - The object to get the object keys types from.
 * @typedef {string} ExtractObjectKeys<T>
 */
export type ExtractObjectKeys<T extends Record<string, any>> = keyof T;
/**
 * Extracts the object values from the specified object and returns them in a union.
 *
 * Type parameters:
 *
 * - `T` (`Record<string, any>`) - The object to get the object values types from.
 *
 * @template T - The object to get the object values types from.
 * @typedef {any} ExtractObjectValues<T>
 */
export type ExtractObjectValues<T extends Record<string, any>> = NonNullable<T[ExtractObjectKeys<T>]>;
