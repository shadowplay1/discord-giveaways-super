import { ILoggerColors } from '../../../types/misc/colors.interface';
/**
 * Logger class.
 */
export declare class Logger {
    /**
     * Logger colors.
     * @type {ILoggerColors}
     */
    colors: ILoggerColors;
    /**
     * Debug mode state.
     */
    debugMode: boolean;
    /**
     * Logger constructor.
     * @param {boolean} debug Determines if debug mode is enabled.
    */
    constructor(debug: boolean);
    /**
     * Sends an info message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     * @returns {void}
     */
    info(message?: string, color?: keyof ILoggerColors): void;
    /**
     * Sends an error message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     * @returns {void}
     */
    error(message?: string, color?: keyof ILoggerColors): void;
    /**
     * Sends a debug message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='yellow'] Message color to use.
     * @returns {void}
     */
    debug(message?: string, color?: keyof ILoggerColors): void;
    /**
     * Sends a warning message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='lightyellow'] Message color to use.
     * @returns {void}
     */
    warn(message?: string, color?: keyof ILoggerColors): void;
    /**
     * Sends a debug log for the optional parameter in method not specified.
     * @param {string} method The method (e.g. "ShopItem.use") to set.
     * @param {string} parameterName Parameter name to set.
     * @param {any} defaultValue Default value to set.
     * @returns {void}
     */
    optionalParamNotSpecified(method: string, parameterName: string, defaultValue: any): void;
    /**
     * Checks if the module version is development version and sends the corresponding warning in the console.
     * @returns {void}
     */
    sendDevVersionWarning(): void;
}
