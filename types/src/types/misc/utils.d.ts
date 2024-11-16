/**
 * Represents the `if` statement on a type level.
 *
 * Type parameters:
 *
 * - `T` ({@link boolean}) - The boolean type to compare with.
 * - `IfTrue` ({@link any}) - The type that will be returned if `T` is `true`.
 * - `IfFalse` ({@link any}) - The type that will be returned if `T` is `false`.
 *
 * @template T - The boolean type to compare with.
 * @template IfTrue - The type that will be returned if `T` is `true`.
 * @template IfFalse - The type that will be returned if `T` is `false`.
 *
 * @typedef {any} If<T, IfTrue, IfFalse>
 */
export type If<T extends boolean, IfTrue, IfFalse = null> = T extends true ? IfTrue : IfFalse;
/**
 * Compares the values on type level and returns a boolean value.
 *
 * Type parameters:
 *
 * - `ToCompare` ({@link any}) - The type to compare.
 * - `CompareWith` ({@link any}) - The type to compare with.
 *
 * @template ToCompare - The type to compare.
 * @template CompareWith - The type to compare with.
 *
 * @typedef {boolean} Equals<ToCompare, CompareWith>
 */
export type Equals<ToCompare, CompareWith> = ToCompare extends CompareWith ? true : false;
/**
 * Makes the specified properties in `K` from the object in `T` optional.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make optional.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make optional.
 *
 * @typedef {object} OptionalProps<T, K>
 */
export type OptionalProps<T extends object, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
/**
 * Makes the specified properties in `K` from the object in `T` required.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make required.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make required.
 *
 * @typedef {object} RequiredProps<T, K>
 */
export type RequiredProps<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
/**
 * A callback function that calls when finding an element in array.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 *
 * @template T - The type of item to be passed to the callback function.
 *
 * @callback FindCallback<T>
 * @param {T} item The item to be passed to the callback function.
 * @returns {boolean} The boolean value returned by the callback function.
 */
export type FindCallback<T> = (item: T) => boolean;
/**
 * A callback function that calls when mapping the array using the {@link Array.prototype.map} method.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 * - `TReturnType` - ({@link any}) The type of value returned by the callback function.
 *
 * @template T - The type of item to be passed to the callback function.
 * @template TReturnType - The type of value returned by the callback function.
 *
 * @callback MapCallback<T, TReturnType>
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */
export type MapCallback<T, TReturnType> = (item: T) => TReturnType;
/**
 * A type that represents any value with "null" possible to be returned.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type to attach.
 *
 * @template T - The type to attach.
 * @typedef {any} Maybe<T>
 */
export type Maybe<T> = Exclude<T | null, undefined>;
/**
 * A type that represents any value with "undefined" possible to be returned.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type to attach.
 *
 * @template T - The type to attach.
 * @typedef {any} MaybeUndefined<T>
 */
export type MaybeUndefined<T> = Exclude<T | undefined, null>;
/**
 * Adds a prefix at the beginning of a string literal type.
 *
 * Type parameters:
 *
 * - TWord ({@link string}) The string literal type or union type of them to add the prefix to.
 * - TPrefix ({@link string}) The string literal type of the prefix to use.
 *
 * @template TWord - The string literal type or union type of them to add the prefix to.
 * @template TPrefix - The string literal type of the prefix to use.
 *
 * @typedef {string} AddPrefix<TWord, TPrefix>
 */
export type AddPrefix<TWord extends string, TPrefix extends string> = `${TPrefix}${Capitalize<TWord>}`;
/**
 * Constructs an object type with prefixed properties and specified value for each of them.
 *
 * Type parameters:
 *
 * - TWords ({@link string}) The union type of string literals to add the prefix to.
 * - TPrefix ({@link string}) The string literal type of the prefix to use.
 * - Value ({@link any}) Any value to assign as value of each property of the constructed object.
 *
 * @template TWords - The union type of string literals to add the prefix to.
 * @template TPrefix - The string literal type of the prefix to use.
 * @template Value - Any value to assign as value of each property of the constructed object.
 *
 * @typedef {string} PrefixedObject<TWords, TPrefix, Value>
 */
export type PrefixedObject<TWords extends string, TPrefix extends string, Value = unknown> = {
    [Word in AddPrefix<TWords, TPrefix>]: Value;
};
/**
 * Returns a length of a string on type level.
 *
 * Type parameters:
 *
 * - `S` ({@link string}) - The string to check the length of.
 *
 * @template S - The string to check the length of.
 * @typedef {number} StringLength<S>
 */
export type StringLength<S extends string, LettersArray extends 0[] = []> = S extends `${string}${infer Rest}` ? StringLength<Rest, [...LettersArray, 0]> : LettersArray['length'];
/**
 * Conditional type that will return the specified string if it matches the specified length.
 *
 * Type parameters:
 *
 * - `N` ({@link number}) - The string length to match to.
 * - `S` ({@link string}) - The string to check the length of.
 *
 * @template N - The string length to match to.
 * @template S - The string to check the length of.
 * @typedef {number} ExactLengthString<N, S>
 */
export type ExactLengthString<N extends number, S extends string> = StringLength<S> extends 0 ? string : StringLength<S> extends N ? S : never;
/**
 * Conditional type that will return the specified string if it matches any of the possible Discord ID string lengths.
 *
 * Type parameters:
 *
 * - `S` ({@link string}) - The string to check the length of.
 *
 * @template S - The string to check the length of.
 * @typedef {number} DiscordID<ID>
 */
export type DiscordID<ID extends string> = ExactLengthString<17, ID> | ExactLengthString<18, ID> | ExactLengthString<19, ID> | ExactLengthString<20, ID>;
/**
 * Extracts the type that was passed into `Promise<...>` type.
 *
 * Type parameters:
 *
 * - `P` ({@link Promise<any>}) - The Promise to extract the type from.
 *
 * @template P - The Promise to extract the type from.
 * @typedef {any} ExtractPromisedType<P>
 */
export type ExtractPromisedType<P> = P extends Promise<infer T> ? T : never;
