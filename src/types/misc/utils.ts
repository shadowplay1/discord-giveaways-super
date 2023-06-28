/**
 * An object containing the data about available module updates.
 * @typedef {object} IUpdateState
 * @prop {boolean} updated Whether an update is available or not.
 * @prop {string} installedVersion The currently installed version.
 * @prop {string} availableVersion The available version, if any.
 */
export interface IUpdateState {

    /**
     * Whether an update is available or not.
     * @type {boolean}
     */
    updated: boolean

    /**
     * The currently installed version.
     * @type {string}
     */
    installedVersion: string

    /**
     * The available version, if any.
     * @type {string}
     */
    availableVersion: string
}

/**
 * Represents the `if` statement on a type level.
 *
 * Type parameters:
 *
 * - `T` (@see boolean) - The boolean type to compare with.
 * - `IfTrue` (@see any) - The type that will be returned if `T` is `true`.
 * - `IfFalse` (@see any) - The type that will be returned if `T` is `false`.
 *
 * @template {boolean} T The boolean type to compare with.
 * @template IfTrue The type that will be returned if `T` is `true`.
 * @template IfFalse The type that will be returned if `T` is `false`.
 *
 * @typedef {IfTrue | IfFalse} If
 */
export type If<T extends boolean,
    IfTrue,
    IfFalse = null
> = T extends true ? IfTrue : IfFalse

/**
 * Makes the specified properties in `K` from the object in `T` optional.
 *
 * Type parameters:
 *
 * - `T` (@see object) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make optional.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make optional.
 *
 * @typedef {object} Optional
 */
export type Optional<T extends object, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>


/**
 * A callback function that calls when finding an element in array.
 *
 * Type parameters:
 *
 * - `T` (@see any) - The type of item to be passed to the callback function.
 *
 * @template T The type of item to be passed to the callback function.
 *
 * @callback FindCallback
 * @param {T} item The item to be passed to the callback function.
 * @returns {boolean} The boolean value returned by the callback function.
 */
export type FindCallback<T> = (item: T) => boolean

/**
 * A callback function that calls when mapping the array using the @see Array.prototype.map method.
 *
 * Type parameters:
 *
 * - `T` (@see any) - The type of item to be passed to the callback function.
 * - `TReturnType` - (@see any) The type of value returned by the callback function.
 *
 * @template T The type of item to be passed to the callback function.
 * @template TReturnType The type of value returned by the callback function.
 *
 * @callback MapCallback
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */
export type MapCallback<T, TReturnType> = (item: T) => TReturnType
