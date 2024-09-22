"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTimeToMilliseconds = exports.isTimeStringValid = exports.timeRegex = void 0;
exports.timeRegex = /^(\d+d)?\s?(((\d+h)\s?(\d+m))?|\d+h|\d+m)\s?(\d+s)?$/;
/**
 * Checks if specified time string is valid.
 * @param {string} timeString The time string to check.
 * @returns {boolean} Whether the specified time string is valid.
 */
const isTimeStringValid = (timeString) => {
    return exports.timeRegex.test(timeString) && timeString !== '';
};
exports.isTimeStringValid = isTimeStringValid;
/**
 * Converts a time string to milliseconds.
 * @param {string} timeString The time string to convert.
 *
 * @returns {Maybe<number>}
 * The total number of milliseconds in the time string, or `null` if the time string is invalid or empty.
 */
const convertTimeToMilliseconds = (timeString) => {
    if (!(0, exports.isTimeStringValid)(timeString)) {
        return null;
    }
    const days = timeString.match(/\d+d/);
    const hours = timeString.match(/\d+h/);
    const minutes = timeString.match(/\d+m/);
    const seconds = timeString.match(/\d+s/);
    let totalMilliseconds = 0;
    if (days) {
        totalMilliseconds += parseInt(days[0].replace('d', '')) * 24 * 60 * 60 * 1000;
    }
    if (hours) {
        totalMilliseconds += parseInt(hours[0].replace('h', '')) * 60 * 60 * 1000;
    }
    if (minutes) {
        totalMilliseconds += parseInt(minutes[0].replace('m', '')) * 60 * 1000;
    }
    if (seconds) {
        totalMilliseconds += parseInt(seconds[0].replace('s', '')) * 1000;
    }
    return totalMilliseconds;
};
exports.convertTimeToMilliseconds = convertTimeToMilliseconds;
