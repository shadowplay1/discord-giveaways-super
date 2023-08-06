import { defaultConfig } from '../../../structures/defaultConfig'
import { IGiveawaysConfiguration, IGiveawaysConfigCheckerConfiguration } from '../../../types/configurations'
import { DatabaseType } from '../../../types/databaseType.enum'

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
export const checkConfiguration = <TDatabaseType extends DatabaseType>(
    configurationToCheck: IGiveawaysConfiguration<TDatabaseType>,
    checkerConfiguration: Partial<IGiveawaysConfigCheckerConfiguration> = {}
): Required<IGiveawaysConfiguration<TDatabaseType>> => {
    const problems: string[] = []
    const defaultConfiguration: Record<string, any> = defaultConfig

    const output: Record<string, any> = {
        ...configurationToCheck,
        ...defaultConfiguration
    }

    if (!checkerConfiguration.ignoreUnspecifiedOptions) {
        checkerConfiguration.ignoreUnspecifiedOptions = true
    }

    if (!checkerConfiguration.sendLog) {
        checkerConfiguration.sendLog = true
    }

    if (!checkerConfiguration.showProblems) {
        checkerConfiguration.showProblems = true
    }

    for (const key of Object.keys(configurationToCheck)) {
        const config = configurationToCheck as Record<string, any>

        const defaultValue = defaultConfiguration[key]
        const value = config[key]

        if (key !== 'database' && key !== 'connection') {
            if (value == undefined) {
                output[key] = defaultValue

                if (!checkerConfiguration.ignoreUnspecifiedOptions) {
                    problems.push(`options.${key} is not specified.`)
                }
            } else if (typeof value !== typeof defaultValue) {
                if (!checkerConfiguration.ignoreInvalidTypes) {
                    problems.push(
                        `options.${key} is not a ${typeof defaultValue}. Received type: ${typeof value}.`
                    )

                    output[key] = defaultValue
                }
            } else {
                output[key] = value
            }
        }
    }

    const checkNestedOptionsObjects = (
        config: Record<string, any>,
        defaultConfig: Record<string, any>,
        prefix: string
    ): void => {
        for (const key in defaultConfig) {
            const defaultValue = defaultConfig[key]
            const value = config[key]
            const fullKey = prefix ? `${prefix}.${key}` : key

            if (value == undefined) {
                if (config[key] == undefined) {
                    config[key] = defaultValue
                }

                if (!checkerConfiguration.ignoreUnspecifiedOptions) {
                    problems.push(`${fullKey} is not specified.`)
                }
            } else if (typeof value !== typeof defaultValue) {
                if (!checkerConfiguration.ignoreInvalidTypes && (key !== 'database' && key !== 'connection')) {
                    problems.push(
                        `${fullKey} is not a ${typeof defaultValue}. Received type: ${typeof value}.`
                    )

                    config[key] = defaultValue
                }
            } else if (typeof value == 'object' && value !== null) {
                checkNestedOptionsObjects(value, defaultValue, fullKey)
            }

        }
    }

    checkNestedOptionsObjects(configurationToCheck, defaultConfig, '')

    if (checkerConfiguration.sendLog) {
        const problemsCount = problems.length

        if (checkerConfiguration.showProblems) {
            if (checkerConfiguration.sendSuccessLog || problemsCount) {
                console.log(
                    `Checked the configuration: ${problemsCount} ${problemsCount == 1 ? 'problem' : 'problems'} found.`
                )
            }

            if (problemsCount) {
                console.log(problems.join('\n'))
            }
        }
    }

    output.database = configurationToCheck.database
    output.connection = configurationToCheck.connection

    return output as Required<IGiveawaysConfiguration<TDatabaseType>>
}
