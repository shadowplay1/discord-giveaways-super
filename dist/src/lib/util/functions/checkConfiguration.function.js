"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConfiguration = void 0;
const TypedObject_1 = require("../classes/TypedObject");
const defaultConfig_1 = require("../../../structures/defaultConfig");
/**
 * Completes, fills and fixes the {@link Giveaways} configuration.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will
 * determine which connection configuration should be used.
 *
 * @callback checkConfiguration
 *
 * @param {IGiveawaysConfiguration} configurationToCheck The {@link Giveaways} configuration object to check.
 * @param {Partial<IGiveawaysConfigCheckerConfiguration>} [checkerConfiguration] Config checker configuration object.
 *
 * @returns {Required<IGiveawaysConfiguration<TDatabaseType>>} Completed, filled and fixed {@link Giveaways} configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
const checkConfiguration = (configurationToCheck, checkerConfiguration = {}) => {
    const problems = [];
    const defaultConfiguration = defaultConfig_1.defaultConfig;
    const output = {
        ...configurationToCheck,
        ...defaultConfiguration
    };
    if (!checkerConfiguration.ignoreUnspecifiedOptions) {
        checkerConfiguration.ignoreUnspecifiedOptions = true;
    }
    if (!checkerConfiguration.sendLog) {
        checkerConfiguration.sendLog = true;
    }
    if (!checkerConfiguration.showProblems) {
        checkerConfiguration.showProblems = true;
    }
    for (const key of TypedObject_1.TypedObject.keys(configurationToCheck)) {
        const config = configurationToCheck;
        const defaultValue = defaultConfiguration[key];
        const value = config[key];
        if (key !== 'database' && key !== 'connection') {
            if (value == undefined) {
                output[key] = defaultValue;
                if (!checkerConfiguration.ignoreUnspecifiedOptions) {
                    problems.push(`options.${key} is not specified.`);
                }
            }
            else if (typeof value !== typeof defaultValue) {
                if (!checkerConfiguration.ignoreInvalidTypes) {
                    problems.push(`options.${key} is not a ${typeof defaultValue}. Received type: ${typeof value}.`);
                    output[key] = defaultValue;
                }
            }
            else {
                output[key] = value;
            }
        }
    }
    const checkNestedOptionsObjects = (config, defaultConfig, prefix) => {
        for (const key in defaultConfig) {
            const defaultValue = defaultConfig[key];
            const value = config[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (value == undefined) {
                if (config[key] == undefined) {
                    config[key] = defaultValue;
                }
                if (!checkerConfiguration.ignoreUnspecifiedOptions) {
                    problems.push(`${fullKey} is not specified.`);
                }
            }
            else if (typeof value !== typeof defaultValue) {
                if (!checkerConfiguration.ignoreInvalidTypes && (key !== 'database' && key !== 'connection')) {
                    problems.push(`${fullKey} is not a ${typeof defaultValue}. Received type: ${typeof value}.`);
                    config[key] = defaultValue;
                }
            }
            else if (typeof value == 'object' && value !== null) {
                checkNestedOptionsObjects(value, defaultValue, fullKey);
            }
        }
    };
    checkNestedOptionsObjects(configurationToCheck, defaultConfig_1.defaultConfig, '');
    if (checkerConfiguration.sendLog) {
        const problemsCount = problems.length;
        if (checkerConfiguration.showProblems) {
            if (checkerConfiguration.sendSuccessLog || problemsCount) {
                console.log(`Checked the configuration: ${problemsCount} ${problemsCount == 1 ? 'problem' : 'problems'} found.`);
            }
            if (problemsCount) {
                console.log(problems.join('\n'));
            }
        }
    }
    output.database = configurationToCheck.database;
    output.connection = configurationToCheck.connection;
    return output;
};
exports.checkConfiguration = checkConfiguration;
