import fetch from 'node-fetch'

import { IUpdateState } from '../../types/misc/updateState.interface'
import { name as packageName, version as packageVersion } from '../../../package.json'

/**
 * Checks the latest available module version and compares it with installed one.
 * @returns {IUpdateState} Update checking results
 */
export async function checkUpdates(): Promise<IUpdateState> {
    const packageData = await fetch(`https://registry.npmjs.com/${packageName}`)
        .then(text => text.json())

    const latestVersion = packageData['dist-tags'].latest

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
