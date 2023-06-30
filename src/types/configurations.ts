import { ButtonStyle, ColorResolvable, User } from 'discord.js'

import { Mongo, IMongoConnectionOptions } from 'quick-mongo-super/MongoItems'
import Enmap, { EnmapOptions } from 'enmap'

import { DatabaseType } from './databaseType.enum'
import { IDatabaseStructure } from './databaseStructure.interface'

import { IGiveaway } from '../lib/giveaway.interface'
import { Optional } from './misc/utils'

/**
 * Full {@link Giveaways} class configuration object.
 *
 * Type parameters:
 *
 * - TDatabaseType ({@link DatabaseType}) - The database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {object} IGiveawaysConfiguration<TDatabaseType>
 * @prop {DatabaseType} database Database type to use.
 * @prop {DatabaseConnectionOptions<TDatabaseType>} connection Database type to use.
 *
 * @prop {?number} [giveawaysCheckingInterval=1000]
 * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {?number} [minGiveawayEntries=1] Determines the minimum required giveaway entries to draw the winner. Default: 1
 * @prop {IUpdateCheckerConfiguration} [updatesChecker] Updates checker configuration.
 * @prop {IGiveawaysConfigCheckerConfiguration} [configurationChecker] Giveaways config checker configuration.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
export type IGiveawaysConfiguration<TDatabaseType extends DatabaseType> = {

    /**
     * Database type to use.
     * @type {DatabaseType}
     */
    database: TDatabaseType

    /**
     * Database connection options based on the choosen database type.
     * @type {DatabaseConnectionOptions<TDatabaseType>}
     */
    connection: DatabaseConnectionOptions<TDatabaseType>
} & Partial<IGiveawaysOptionalConfiguration>

/**
 * Optional configuration for the {@link Giveaways} class.
 * @typedef {object} IGiveawaysOptionalConfiguration
 *
 * @prop {?number} [giveawaysCheckingInterval=1000]
 * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {?number} [minGiveawayEntries=1] Determines the minimum required giveaway entries to draw the winner. Default: 1
 * @prop {Partial<IUpdateCheckerConfiguration>} [updatesChecker] Updates checker configuration.
 * @prop {Partial<IGiveawaysConfigCheckerConfiguration>} [configurationChecker] Giveaways config checker configuration.
 */
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
     * Determines the minimum required giveaway entries to draw the winner. Default: 1
     * @type {number}
     */
    minGiveawayEntries: number

    /**
     * Updates checker configuration.
     * @type {?IUpdateCheckerConfiguration}
     */
    updatesChecker: Partial<IUpdateCheckerConfiguration>

    /**
     * Giveaways config checker configuration.
     * @type {?IUpdateCheckerConfiguration}
     */
    configurationChecker: Partial<IGiveawaysConfigCheckerConfiguration>
}

/**
 * Configuration for the updates checker.
 * @typedef {object} IUpdateCheckerConfiguration
 * @prop {?boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @prop {?boolean} [upToDateMessage=false] Sends the message in console on start if module is up to date. Default: false.
 */
export type IUpdateCheckerConfiguration = Record<'checkUpdates' | 'upToDateMessage', boolean>

/**
 * Configuration for the configuration checker.
 * @typedef {object} IGiveawaysConfigCheckerConfiguration
 * @prop {?boolean} ignoreInvalidTypes Allows the method to ignore the options with invalid types. Default: false.
 * @prop {?boolean} ignoreUnspecifiedOptions Allows the method to ignore the unspecified options. Default: true.
 * @prop {?boolean} ignoreInvalidOptions Allows the method to ignore the unexisting options. Default: false.
 * @prop {?boolean} showProblems Allows the method to show all the problems in the console. Default: true.
 * @prop {?boolean} sendLog Allows the method to send the result in the console.
 * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
 * @prop {?boolean} sendSuccessLog Allows the method to send the result if no problems were found. Default: false.
 */
export type IGiveawaysConfigCheckerConfiguration = Record<
    'ignoreInvalidTypes' | 'ignoreUnspecifiedOptions' | 'ignoreInvalidOptions' |
    'showProblems' | 'sendLog' | 'sendSuccessLog',
    boolean
>

/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./giveaways.json'] Full path to a JSON storage file. Default: './giveaways.json'.
 * @prop {?boolean} [checkDatabase=true] Checks the if there are errors in database file. Default: true.
 * @prop {?number} [checkingCountdown=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */
export interface IJSONDatabaseConfiguration {

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
    checkingCountdown: number
}


// IGiveawayData: omitting all the internal giveaway properties and
// data properties that are generating on giveaway start

/**
 * An object that contains an information about a giveaway that is required fo starting..
 * @typedef {object} IGiveawayData
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {string} hostMemberID The ID of the host member.
 * @prop {string} channelID The ID of the channel where the giveaway is held.
 * @prop {string} guildID The ID of the guild where the giveaway is held.
 */
export type IGiveawayData = Omit<
    IGiveaway,
    'id' | 'startTimestamp' | 'endTimestamp' |
    'messageID' | 'messageURL' | 'entries' |
    'entriesArray' | 'state' | 'messageProps' |
    'isEnded'
>

/**
 * Giveaway start config.
 * @typedef {object} IGiveawayStartConfig
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {string} hostMemberID The ID of the host member.
 * @prop {string} channelID The ID of the channel where the giveaway is held.
 * @prop {string} guildID The ID of the guild where the giveaway is held.
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {IGiveawayButtons} [defineEmbedStrings] Giveaway buttons object.
 */
export type IGiveawayStartConfig = Optional<
    IGiveawayData,
    'time' | 'winnersCount'
> & Partial<IGiveawayStartOptions>

/**
 * Giveaway buttons that may be specified.
 * @typedef {object} IGiveawayButtons
 * @prop {?IGiveawayButtonOptions} [joinGiveawayButton] Button object for the "join giveaway" button.
 * @prop {?IGiveawayButtonOptions} [rerollButton] Button object for the "reroll" button.
 * @prop {?ILinkButton} [goToMessageButton] Link button object for the "go to message" button.
 */
export type IGiveawayButtons = Partial<Record<'joinGiveawayButton' | 'rerollButton', IGiveawayButtonOptions> & {
    goToMessageButton: ILinkButton
}>

/**
 * Link button object.
 *
 * Please note that URL is not required as it's being applied after starting the giveaway.
 * @typedef {object} ILinkButton
 * @prop {string} [text] Button text string.
 * @prop {string} [emoji] Emoji string.
 * @prop {ButtonStyle} url URL that the button will take to.
 */
export type ILinkButton = Partial<Omit<IGiveawayButtonOptions, 'link' | 'style'>>

/**
 * A function that defines the embed strings used in the giveaway.
 * @callback DefineEmbedStringsCallback
 * @param {Omit} giveaway An object containing information about the giveaway.
 * @param {User} giveawayHost The host of the giveaway.
 * @returns {Partial<IEmbedStringsDefinitions>} An object containing the defined embed strings.
 */

/**
 * Giveaway start options.
 * @typedef {object} IGiveawayStartOptions
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {IGiveawayButtons} [defineEmbedStrings] Giveaway buttons object.
 */
export interface IGiveawayStartOptions {
    buttons: IGiveawayButtons

    /**
     * A function that defines the embed strings used in the giveaway.
     * @param {IGiveaway} giveaway An object containing information about the giveaway.
     * @param {User} giveawayHost The host of the giveaway.
     * @returns {Partial<IEmbedStringsDefinitions>}
     */
    defineEmbedStrings(
        giveaway: IGiveaway,
        giveawayHost: User
    ): Partial<IEmbedStringsDefinitions>
}

/**
 * An object that contains messages that are sent in various giveaway cases, such as end with winners or without winners.
 * @typedef {object} IGiveawayStartMessages
 *
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage
 * The separated message to be sent in the giveaway channel when giveaway ends.
 *
 * @prop {IGiveawayEmbedOptions} endMessage
 * The separated message to be sent in the giveaway channel when a giveaway ends with winners.
 * @prop {IGiveawayEmbedOptions} noWinners
 * The message that will be set to the original giveaway message if there are no winners in the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} noWinnersEndMessage
 * The separated message to be sent in the giveaway channel if there are no winners in the giveaway.
 */

/**
 * An object that contains messages that are sent in various giveaway cases, such as end with winners or without winners.
 */
export interface IGiveawayStartMessages {

    /**
     * The separated message to be sent in the giveaway channel when giveaway ends.
     * @type {IGiveawayEmbedOptions}
     */
    newGiveawayMessage: IGiveawayEmbedOptions

    /**
     * The separated message to be sent in the giveaway channel when a giveaway ends with winners.
     * @type {IGiveawayEmbedOptions}
     */
    endMessage: IGiveawayEmbedOptions

    /**
     * The message that will be set to the original giveaway message if there are no winners in the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    noWinners: IGiveawayEmbedOptions

    /**
     * The separated message to be sent in the giveaway channel if there are no winners in the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    noWinnersEndMessage: IGiveawayEmbedOptions
}

/**
 * A function that is called when giveaway is finished.
 * @callback GiveawayFinishCallback
 * @param {string} winnersMentionsString A string that contains the users that won the giveaway separated with comma.
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayStartMessages} Giveaway message objects.
 */
export type GiveawayFinishCallback = (
    winnersMentionsString: string,
    winnersCount: number
) => Partial<IGiveawayStartMessages>

/**
 * An object that contains messages that are sent in various giveaway cases, such as end with winners or without winners.
 * @typedef {object} IGiveawayRerollMessages
 *
 * @prop {IGiveawayEmbedOptions} onlyHostCanReroll
 * The message to reply to user with when not a giveaway host tries to do a reroll.
 *
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage
 * The message that will be set to the original giveaway message after the reroll.
 *
 * @prop {IGiveawayEmbedOptions} successMessage
 * The separated message to be sent in the giveaway channel when the reroll is successful.
 */

export interface IGiveawayRerollMessages {

    /**
     * The message to reply to user with when not a giveaway host tries to do a reroll.
     * @type {IGiveawayEmbedOptions}
     */
    onlyHostCanReroll: IGiveawayEmbedOptions

    /**
     * The message that will be set to the original giveaway message after the reroll.
     * @type {IGiveawayEmbedOptions}
     */
    newGiveawayMessage: IGiveawayEmbedOptions

    /**
     * The separated message to reply to user with when the reroll is successful.
     * @type {IGiveawayEmbedOptions}
     */
    successMessage: IGiveawayEmbedOptions

    /**
     * The separated message to be sent in the giveaway channel when the new winners are picked.
     * @type {IGiveawayEmbedOptions}
     */
    rerollMessage: IGiveawayEmbedOptions
}

/**
 * A function that is called when giveaway winners are rerolled.
 * @callback GiveawayRerollCallback
 *
 * @param {string} winnersMentionsString
 * A string that contains the mentions of users that won the giveaway, separated with comma.
 *
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayMessages} Giveaway message objects.
 */
export type GiveawayRerollCallback = (
    winnersMentionsString: string,
    winnersCount: number
) => Partial<IGiveawayRerollMessages>

/**
 * Object containing embed string definitions used in the IGiveaways class.
 * @typedef {object} IEmbedStringsDefinitions
 *
 * @prop {IGiveawayEmbedOptions} start
 * This object is used in the original giveaway message that people will use to join the giveaway.
 *
 * @prop {GiveawayFinishCallback} finish
 * This function is called and all returned message objects are extracted and used when the giveaway is finished.
 *
 * @prop {GiveawayRerollCallback} reroll
 * This function is called and all returned message objects are extracted and used when the giveaway winners are rerolled.
 */
export interface IEmbedStringsDefinitions {

    /**
     * This object is used in the original giveaway
     * message that people will use to join the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    start: IGiveawayEmbedOptions

    /**
     * The message to reply to user with when they join the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    joinGiveawayMessage: IGiveawayEmbedOptions

    /**
     * The message to reply to user with when they leave the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    leaveGiveawayMessage: IGiveawayEmbedOptions

    /**
     * This function is called and all returned message objects are
     * extracted and used when the giveaway is finished.
     * @type {GiveawayFinishCallback}
     */
    finish: GiveawayFinishCallback

    /**
     * This function is called and all returned message objects
     * are extracted and used when the giveaway winners are rerolled.
     * @type {GiveawayRerollCallback}
     */
    reroll: GiveawayRerollCallback
}

/**
 * Button object.
 * @typedef {object} IGiveawayButtonOptions
 * @prop {?string} [text] Button text string.
 * @prop {?string} [emoji] Emoji string.
 * @prop {?ButtonStyle} [style] Button style.
 */
export type IGiveawayButtonOptions = Partial<Record<'text' | 'emoji', string> & {
    style: ButtonStyle
}>

/**
 * Message embed options.
 * @typedef {object} IGiveawayEmbedOptions
 *
 * @prop {?string} [messageContent]
 * Message content to specify in the message.
 * If only message content is specified, it will be sent without the embed.
 *
 * @prop {?string} [title] The title of the embed.
 * @prop {?string} [titleIcon] The icon of the title in the embed.
 * @prop {?string} [titleURL] The url of the icon of the title in the embed.
 * @prop {?string} [description] The description of the embed.
 * @prop {?string} [footer] The footer of the embed.
 * @prop {?string} [footerIcon] The icon of the footer in the embed.
 * @prop {?string} [thumbnailURL] Embed thumbnail.
 * @prop {?string} [imageURL] Embed Image URL.
 * @prop {?ColorResolvable} [color] The color of the embed.
 * @prop {?number} [timestamp] The embed timestamp to set.
 */
export type IGiveawayEmbedOptions = Partial<
    Record<
        'title' | 'titleIcon' |
        'titleURL' | 'description' | 'footer' |
        'footerIcon' | 'thumbnailURL' | 'imageURL', string
    > & {

        /**
         * Message content to specify in the message.
         * If only message content is specified, it will be sent without the embed.
         * @type {string}
         */
        messageContent: string

        /**
         * The color of the embed.
         * @type {ColorResolvable}
         */
        color: ColorResolvable

        /**
         * The embed timestamp to set.
         * @type {number}
         */
        timestamp: number
    }
>

/**
 * Database connection options based on the used database type.
 *
 * Type parameters:
 *
 * - TDatabaseType ({@link DatabaseType}) - The database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {(
 * Partial<IJSONDatabaseConfiguration> | EnmapOptions<any, any> | IMongoConnectionOptions
 * )} DatabaseConnectionOptions<TDatabaseType>
 *
 * @see {@link Partial<IJSONDatabaseConfiguration>} - JSON configuration.
 *
 * @see {@link EnmapOptions<any, any>} - Enmap configuration.
 *
 * @see {@link IMongoConnectionOptions} - MongoDB connection configuration.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
export type DatabaseConnectionOptions<TDatabaseType extends DatabaseType> =
    TDatabaseType extends DatabaseType.JSON ? Partial<IJSONDatabaseConfiguration> :
    TDatabaseType extends DatabaseType.ENMAP ? EnmapOptions<any, any> :
    TDatabaseType extends DatabaseType.MONGODB ? IMongoConnectionOptions : never

/**
 * External database object based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {(
 * null | Enmap<string, IDatabaseStructure> | Mongo<IDatabaseStructure>
 * )} Database<TDatabaseType>
 *
 * @see {@link null} - JSON database management object - `null`
 * is because it's not an external database - JSON is being parsed by the module itself.
 *
 * @see {@link Enmap<string, IDatabaseStructure>} - Enmap database.
 *
 * @see {@link Mongo<IDatabaseStructure>} - MongoDB database.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which external database management object should be used.
 */
export type Database<TDatabaseType extends DatabaseType> =
    TDatabaseType extends DatabaseType.JSON ? null :
    TDatabaseType extends DatabaseType.ENMAP ? Enmap<string, IDatabaseStructure> :
    TDatabaseType extends DatabaseType.MONGODB ? Mongo<IDatabaseStructure> : never
