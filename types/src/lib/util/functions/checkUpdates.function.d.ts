/**
 * Checks the latest available module version and compares it with installed one.
 * @returns {Promise<IUpdateState>} Update checking results
 */
export declare const checkUpdates: () => Promise<IUpdateState>;
/**
 * An object containing the data about available module updates.
 * @typedef {object} IUpdateState
 * @prop {boolean} updated Whether an update is available or not.
 * @prop {string} installedVersion The currently installed version.
 * @prop {string} availableVersion The available version, if any.
 */
export interface IUpdateState {
    /**
     * Whether an update is available or not.
     * @type {boolean}
     */
    updated: boolean;
    /**
     * The currently installed version.
     * @type {string}
     */
    installedVersion: string;
    /**
     * The available version, if any.
     * @type {string}
     */
    availableVersion: string;
}
