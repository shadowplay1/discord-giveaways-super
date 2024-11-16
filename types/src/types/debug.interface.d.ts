import { Maybe } from './misc/utils';
/**
 * Represents a debug result interface.
 *
 * Type parameters:
 * - `TResult` ({@link any}) - The return type of the debug function.
 *
 * @typedef {object} IDebugResult<TResult>
 * @prop {Maybe<TResult>} result The returned value of the debug function.
 * @prop {Maybe<Error>} error The error that possibly could be thrown during the debug function call.
 *
 * @template TResult The return type of the debug function.
 */
export interface IDebugResult<TResult = any> {
    result: Maybe<TResult>;
    error: Maybe<Error>;
}
