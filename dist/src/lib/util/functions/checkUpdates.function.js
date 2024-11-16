"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdates = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const package_json_1 = require("../../../../package.json");
/**
 * Checks the latest available module version and compares it with installed one.
 * @returns {Promise<IUpdateState>} Update checking results
 */
const checkUpdates = async () => {
    const packageData = await (0, node_fetch_1.default)(`https://registry.npmjs.com/${package_json_1.name}`)
        .then(text => text.json());
    const latestVersion = packageData['dist-tags']?.latest || '1.0.0';
    if (package_json_1.version == latestVersion)
        return {
            updated: true,
            installedVersion: package_json_1.version,
            availableVersion: latestVersion
        };
    return {
        updated: false,
        installedVersion: package_json_1.version,
        availableVersion: latestVersion
    };
};
exports.checkUpdates = checkUpdates;
