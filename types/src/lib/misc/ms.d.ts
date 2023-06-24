/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {string | number} val
 * @param {object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {string | number}
 * @api public
 */
export declare const ms: <TInputValue extends string | number>(val: TInputValue, options?: {
    long: boolean;
}) => StringOrNumber<TInputValue>;
export declare type StringOrNumber<TInputValue extends string | number> = TInputValue extends string ? number : string;
