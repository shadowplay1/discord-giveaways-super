import { ButtonStyle, ColorResolvable, User } from 'discord.js'

import { Mongo, IMongoConnectionOptions } from 'quick-mongo-super/MongoItems'
import Enmap, { EnmapOptions } from 'enmap'

import { DatabaseType } from './databaseType.enum'
import { IDatabaseStructure } from './databaseStructure.interface'

import { IGiveaway } from '../lib/giveaway.interface'

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
     * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
     * @type {number}
     */
    giveawaysCheckingInterval: number

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

/**
 * @typedef {object} IUpdateCheckerConfiguration
 * @prop {boolean} checkUpdates Sends the update state message in console on start. Default: true.
 * @prop {boolean} upToDateMessage Sends the message in console on start if module is up to date. Default: false.
 */
export type IUpdateCheckerConfiguration = Record<'checkUpdates' | 'upToDateMessage', boolean>

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
     * @type {string}
     */
    path: string

    /**
     * Checks the if there are errors in database file. Default: true.
     * @type {boolean}
     */
    checkDatabase: boolean

    /**
     * Determines how often the database file will be checked (in ms). Default: 1000.
     * @type {number}
     */
    checkCountdown: number
}

export type IGiveawayButtons = Partial<Record<'joinGiveawayButton' | 'rerollButton', Partial<IGiveawayButtonOptions>> & {
    goToMessageButton: ILinkButton
}>

export type ILinkButton = Omit<Partial<IGiveawayButtonOptions>, 'link' | 'style'>

export interface IGiveawayStartOptions {
    buttons: IGiveawayButtons

    defineEmbedStrings(
        giveaway: Omit<IGiveaway, 'entriesArray'>,
        giveawayHost: User
    ): Partial<IEmbedStringsDefinitions>
}

export type GiveawayFinishCallback = (winnersString: string, numberOfWinners: number) => Partial<
    Record<'newGiveawayMessage' | 'giveawayEndMessage' | 'noWinners', IGiveawayEmbedOptions>
>

export type GiveawayRerollCallback = (winnersString: string, numberOfWinners: number) => Partial<
    Record<'onlyHostCanReroll' | 'newGiveawayMessage' | 'successMessage', IGiveawayEmbedOptions>
>

export interface IEmbedStringsDefinitions {
    start: IGiveawayEmbedOptions
    finish: GiveawayFinishCallback
    reroll: GiveawayRerollCallback
}

export interface IGiveawayButtonOptions {
    text: string
    emoji: string
    style: ButtonStyle
}

export type IGiveawayEmbedOptions = Partial<
    Record<
        'messageContent' | 'title' | 'titleIcon' |
        'titleIconURL' | 'description' | 'footer' |
        'footerIcon' | 'thumbnailURL' | 'imageURL', string
    > & { color: ColorResolvable }
>

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
