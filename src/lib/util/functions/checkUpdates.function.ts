import fetch from 'node-fetch'

import { IUpdateState } from '../../../types/misc/utils'
import { name as packageName, version as packageVersion } from '../../../../package.json'

/**
 * Checks the latest available module version and compares it with installed one.
 * @returns {IUpdateState} Update checking results
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
