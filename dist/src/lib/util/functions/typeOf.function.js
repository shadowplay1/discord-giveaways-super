"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = exports.typeOf = void 0;
/**
 * Returns the exact type of the specified input. Utilility function.
 * @param {any} input The input to check.
 * @returns {string} Input exact type.
 */
const typeOf = (input) => {
    if ((typeof input == 'object' || typeof input == 'function') && input?.prototype) {
        return input.name;
    }
    if (input == null || input == undefined || (typeof input == 'number' && isNaN(input))) {
        return `${input}`;
    }
    return input.constructor.name;
};
exports.typeOf = typeOf;
/**
 * Checks for is the item object and returns it.
 * @param {any} item The item to check.
 * @returns {boolean} Is the item object or not.
*/
const isObject = (item) => {
    return !Array.isArray(item)
        && typeof item == 'object'
        && item !== null;
};
exports.isObject = isObject;
