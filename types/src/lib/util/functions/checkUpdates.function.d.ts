import { IUpdateState } from '../../../types/misc/utils';
/**
 * Checks the latest available module version and compares it with installed one.
 * @returns {IUpdateState} Update checking results
 */
export declare const checkUpdates: () => Promise<IUpdateState>;
