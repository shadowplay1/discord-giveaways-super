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
export type OptionalProps<T extends object, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

/**
 * Makes the specified properties in `K` from the object in `T` required.
 *
 * Type parameters:
 *
 * - `T` (@see object) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make required.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make required.
 *
 * @typedef {object} RequiredProps
 */
export type RequiredProps<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>


/**
 * A callback function that calls when finding an element in array.
 *
 * Type parameters:
 *
 * - `T` (@see any) - The type of item to be passed to the callback function.
 *
 * @template T The type of item to be passed to the callback function.
 *
 * @callback FindCallback<T>
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
 * @callback MapCallback<T, TReturnType>
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */
export type MapCallback<T, TReturnType> = (item: T) => TReturnType

/**
 * A type that represents any value with "null" possible to be returned.
 *
 * Type parameters:
 *
 * - `T` (@see any) - The type to attach.
 *
 * @template T The type to attach.
 * @typedef {any} Maybe<T>
 */
export type Maybe<T> = T | null

/**
 * Adds a prefix at the beginning of a string literal type.
 *
 * Type parameters:
 *
 * - TWord (@see string) The string literal type or union type of them to add the prefix to.
 * - TPrefix (@see string) The string literal type of the prefix to use.
 *
 * @template TWord The string literal type or union type of them to add the prefix to.
 * @template TPrefix The string literal type of the prefix to use.
 *
 * @typedef {string} AddPrefix<TWord, TPrefix>
 */
export type AddPrefix<TWord extends string, TPrefix extends string> = `${TPrefix}${Capitalize<TWord>}`

/**
 * Constructs an object type with prefixed properties and specified value for each of them.
 *
 * Type parameters:
 *
 * - TWords (@see string) The union type of string literals to add the prefix to.
 * - TPrefix (@see string) The string literal type of the prefix to use.
 * - Value (@see any) Any value to assign as value of each property of the constructed object.
 *
 * @template TWords The union type of string literals to add the prefix to.
 * @template TPrefix The string literal type of the prefix to use.
 * @template Value Any value to assign as value of each property of the constructed object.
 *
 * @typedef {string} PrefixedObject<TWords, TPrefix, Value>
 */
export type PrefixedObject<TWords extends string, TPrefix extends string, Value = unknown> = {
    [Word in AddPrefix<TWords, TPrefix>]: Value
}
