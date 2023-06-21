import { Mongo, IMongoConnectionOptions } from 'quick-mongo-super/MongoItems'
import Enmap, { EnmapOptions } from 'enmap'

import { DatabaseType } from './databaseType.enum'
import { IDatabaseStructure } from './databaseStructure.interface'

export type IGiveawaysConfiguration<TDatabaseType extends DatabaseType> = {

    /**
     * Database type to use.
     * @type {DatabaseType}
     */
    database: TDatabaseType

    /**
     * Database connection options based on the choosen database type.
     * @type {DatabaseConnectionOptions<DatabaseType>}
     */
    connection: DatabaseConnectionOptions<TDatabaseType>
} & Partial<IGiveawaysOptionalConfiguration>

export interface IGiveawaysOptionalConfiguration {

    /**
     * Determines if debug mode is enabled.
     * @type {boolean}
     */
    debug: boolean

    /**
     * Updates checker configuration.
     * @type {Partial<IUpdateCheckerConfiguration>}
     */
    updatesChecker: Partial<IUpdateCheckerConfiguration>

    /**
     * Giveaways config checker configuration.
     * @type {Partial<IUpdateCheckerConfiguration>}
     */
    configurationChecker: Partial<IGiveawaysConfigCheckerConfiguration>
}

export interface IUpdateCheckerConfiguration {

    /**
     * Sends the update state message in console on start. Default: true.
     */
    checkUpdates: boolean

    /**
     * Sends the message in console on start if module is up to date. Default: true.
     */
    upToDateMessage: boolean
}


export interface IGiveawaysConfigCheckerConfiguration {

    /**
     * Allows the method to ignore the options with invalid types. Default: false.
     */
    ignoreInvalidTypes: boolean

    /**
     * Allows the method to ignore the unspecified options. Default: true.
     */
    ignoreUnspecifiedOptions: boolean

    /**
     * Allows the method to ignore the unexisting options. Default: false.
     */
    ignoreInvalidOptions: boolean

    /**
     * Allows the method to show all the problems in the console. Default: true.
     */
    showProblems: boolean

    /**
     * Allows the method to send the result in the console.
     * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
     */
    sendLog: boolean

    /**
     * Allows the method to send the result if no problems were found. Default: false
     */
    sendSuccessLog: boolean
}

export interface IJSONDatabseConfiguration {

    /**
     * Full path to a JSON storage file. Default: './giveaways.json'.
     * @type {?string}
     */
    path: string

    /**
     * Checks the if there are errors in database file. Default: true.
     * @type {?boolean}
     */
    checkDatabase: boolean

    /**
     * Determines how often the database file will be checked (in ms). Default: 1000.
     * @type {?number}
     */
    checkCountdown: number
}

export type IGiveawaysConfigurationWithoutDatabase = Omit<
    Required<IGiveawaysConfiguration<DatabaseType.JSON>>,
    'database' | 'connection'
>

export type DatabaseConnectionOptions<TDatabase extends DatabaseType> =
    TDatabase extends DatabaseType.JSON ? Partial<IJSONDatabseConfiguration> :
    TDatabase extends DatabaseType.ENMAP ? EnmapOptions<any, any> :
    TDatabase extends DatabaseType.MONGODB ? IMongoConnectionOptions : never

export type Database<TDatabase extends DatabaseType> =
    TDatabase extends DatabaseType.JSON ? null :
    TDatabase extends DatabaseType.ENMAP ? Enmap<string, IDatabaseStructure> :
    TDatabase extends DatabaseType.MONGODB ? Mongo<IDatabaseStructure> : never
