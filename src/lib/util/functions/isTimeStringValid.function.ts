import { ms } from '../../misc/ms'

/**
 * Checks if specified time string is valid.
 * @param {string} timeString The time string to check.
 * @returns {boolean} Whether the specified time string is valid.
 */
export const isTimeStringValid = (timeString: string): boolean => {
    try {
        ms(timeString)
        return true
    } catch {
        return false
    }
}
