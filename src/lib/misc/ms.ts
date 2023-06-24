/**
 * Helpers.
 */
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

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

export const ms = <TInputValue extends string | number>(
    val: TInputValue,
    options: { long: boolean } = { long: true }
): StringOrNumber<TInputValue> => {
    options = options || {}
    const type = typeof val
    if (type === 'string' && (val as string).length > 0) {
        return parse(val as any)
    } else if (type === 'number' && isFinite(val as any)) {
        return (options.long ? fmtLong(val as any) : fmtShort(val as any)) as any
    }

    return null as any
}

export type StringOrNumber<TInputValue extends string | number> = TInputValue extends string ? number : string

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {string} str
 * @return {number}
 * @api private
 */

function parse(str: string): any {
    str = String(str)
    if (str.length > 100) {
        return
    }

    // eslint-disable-next-line
    const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i
        .exec(str)

    if (!match) {
        return
    }
    const n = parseFloat(match[1])
    const type = (match[2] || 'ms').toLowerCase()
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y
        case 'weeks':
        case 'week':
        case 'w':
            return n * w
        case 'days':
        case 'day':
        case 'd':
            return n * d
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n
        default:
            return undefined
    }
}

/**
 * Short format for `ms`.
 *
 * @param {number} ms
 * @return {string}
 * @api private
 */

function fmtShort(ms: number): string {
    const msAbs = Math.abs(ms)
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd'
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h'
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm'
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's'
    }
    return ms + 'ms'
}

/**
 * Long format for `ms`.
 *
 * @param {number} ms
 * @return {string}
 * @api private
 */

function fmtLong(ms: number): string {
    const msAbs = Math.abs(ms)
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day')
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour')
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute')
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second')
    }
    return ms + ' ms'
}

/**
 * Pluralization helper.
 */

function plural(ms: number, msAbs: number, n: number, name: string): string {
    const isPlural = msAbs >= n * 1.5
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '')
}
