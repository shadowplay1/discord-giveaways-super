import { defaultConfig } from '../../../structures/defaultConfig'
import { IGiveawaysConfiguration, IGiveawaysConfigCheckerConfiguration } from '../../../types/configurations'
import { DatabaseType } from '../../../types/databaseType.enum'

export const checkConfiguration = <TDatabaseType extends DatabaseType>(
    configurationToCheck: { [key: string]: any },
    checkerConfiguration: Partial<IGiveawaysConfigCheckerConfiguration> = {}
): Required<IGiveawaysConfiguration<TDatabaseType>> => {
    const problems: string[] = []

    const output: { [key: string]: any } = {
        ...configurationToCheck,
        ...defaultConfig
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
        const defaultValue = (defaultConfig as any)[key]
        const value = configurationToCheck[key]

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

    const checkNestedOptionsObjects = (
        config: { [key: string]: any },
        defaultConfig: { [key: string]: any },
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
        const problemCount = problems.length

        if (checkerConfiguration.showProblems || checkerConfiguration.sendSuccessLog) {
            console.log(`Checked the configuration: ${problemCount} ${problemCount == 1 ? 'problem' : 'problems'} found.`)
        }

        if (checkerConfiguration.showProblems && problemCount) {
            console.log(problems.join('\n'))
        }
    }

    output.database = configurationToCheck.database
    output.connection = configurationToCheck.connection

    return output as Required<IGiveawaysConfiguration<TDatabaseType>>
}
