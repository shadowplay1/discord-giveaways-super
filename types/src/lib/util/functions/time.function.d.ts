import { Maybe } from '../../../types/misc/utils';
export declare const timeRegex: RegExp;
/**
 * Checks if specified time string is valid.
 * @param {string} timeString The time string to check.
 * @returns {boolean} Whether the specified time string is valid.
 */
export declare const isTimeStringValid: (timeString: string) => boolean;
/**
 * Converts a time string to milliseconds.
 * @param {string} timeString The time string to convert.
 *
 * @returns {Maybe<number>}
 * The total number of milliseconds in the time string, or `null` if the time string is invalid or empty.
 */
export declare const convertTimeToMilliseconds: (timeString: string) => Maybe<number>;
