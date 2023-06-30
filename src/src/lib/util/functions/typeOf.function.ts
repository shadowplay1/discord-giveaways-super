/**
 * Returns the exact type of the specified input. Utilility function.
 * @param {any} input The input to check.
 * @returns {string} Input exact type.
 */
export const typeOf = (input: any): string => {
    if ((typeof input == 'object' || typeof input == 'function') && input?.prototype) {
        return input.name
    }

    if (input == null || input == undefined || (typeof input == 'number' && isNaN(input))) {
        return `${input}`
    }

    return input.constructor.name
}

/**
 * Checks for is the item object and returns it.
 * @param {any} item The item to check.
 * @returns {boolean} Is the item object or not.
*/
export const isObject = (item: any): boolean => {
    return !Array.isArray(item)
        && typeof item == 'object'
        && item !== null
}
