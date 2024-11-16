import fetch from 'node-fetch'

import {
    name as packageName,
    version as packageVersion
} from '../../../../package.json'

/**
 * Checks the latest available module version and compares it with installed one.
 * @returns {Promise<IUpdateState>} Update checking results
 */
export const checkUpdates = async (): Promise<IUpdateState> => {
    const packageData = await fetch(`https://registry.npmjs.com/${packageName}`)
        .then(text => text.json())

    const latestVersion = packageData['dist-tags']?.latest || '1.0.0'

    if (packageVersion == latestVersion) return {
        updated: true,
        installedVersion: packageVersion,
        availableVersion: latestVersion
    }

    return {
        updated: false,
        installedVersion: packageVersion,
        availableVersion: latestVersion
    }
}

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
    updated: boolean

    /**
     * The currently installed version.
     * @type {string}
     */
    installedVersion: string

    /**
     * The available version, if any.
     * @type {string}
     */
    availableVersion: string
}
