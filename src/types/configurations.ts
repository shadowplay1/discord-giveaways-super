import Enmap, { EnmapOptions } from 'enmap'

import { IMongoConnectionOptions } from 'quick-mongo-super/typings/src/interfaces/QuickMongo'
import QuickMongo from 'quick-mongo-super/typings/src/index'

import { DatabaseType } from './databaseType.enum'


export interface IGiveawaysConfiguration<TDatabaseType extends DatabaseType> {

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

    /**
     * Determines if debug mode is enabled.
     * @type {boolean}
     */
    debug?: boolean

    /**
     * Updates checker configuration.
     * @type {Partial<IUpdateCheckerConfiguration>}
     */
    updatesChecker?: Partial<IUpdateCheckerConfiguration>
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

export type DatabaseConnectionOptions<TDatabase extends DatabaseType> =
    TDatabase extends DatabaseType.JSON ? Partial<IJSONDatabseConfiguration> :
    TDatabase extends DatabaseType.ENMAP ? EnmapOptions<any, any> :
    TDatabase extends DatabaseType.MONGODB ? IMongoConnectionOptions : never

export type Database<TDatabase extends DatabaseType> =
    TDatabase extends DatabaseType.JSON ? null :
    TDatabase extends DatabaseType.ENMAP ? Enmap<string, any> :
    TDatabase extends DatabaseType.MONGODB ? QuickMongo : never

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
