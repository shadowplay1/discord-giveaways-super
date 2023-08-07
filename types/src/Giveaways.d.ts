/// <reference types="node" />
import { Client } from 'discord.js';
import { Database, IGiveawayStartConfig, IGiveawaysConfiguration } from './types/configurations';
import { IGiveawaysEvents } from './types/giveawaysEvents.interface';
import { DatabaseType } from './types/databaseType.enum';
import { Emitter } from './lib/util/classes/Emitter';
import { DatabaseManager } from './lib/managers/DatabaseManager';
import { DiscordID, FindCallback, MapCallback, Maybe } from './types/misc/utils';
import { Giveaway, SafeGiveaway, UnsafeGiveaway } from './lib/Giveaway';
import { IDatabaseStructure } from './types/databaseStructure.interface';
/**
 * Main Giveaways class.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @extends {Emitter<IGiveawaysEvents<TDatabaseType>>}
 * @template TDatabaseType The database type that will be used in the module.
 */
export declare class Giveaways<TDatabaseType extends DatabaseType, TDatabaseKey extends string = `${string}.giveaways`, TDatabaseValue = IDatabaseStructure> extends Emitter<IGiveawaysEvents<TDatabaseType>> {
    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    readonly client: Client<boolean>;
    /**
     * {@link Giveaways} ready state.
     * @type {boolean}
     */
    ready: boolean;
    /**
     * {@link Giveaways} version.
     * @type {string}
     */
    readonly version: string;
    /**
     * Completed, filled and fixed {@link Giveaways} configuration.
     * @type {Required<IGiveawaysConfiguration<DatabaseType>>}
     */
    readonly options: Required<IGiveawaysConfiguration<TDatabaseType>>;
    /**
     * External database instanca (such as Enmap or MongoDB) if used.
     * @type {?Database<DatabaseType>}
     */
    db: Database<TDatabaseType, TDatabaseKey, TDatabaseValue>;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    database: DatabaseManager<TDatabaseType, any, TDatabaseValue>;
    /**
     * Giveaways logger.
     * @type {Logger}
     * @private
     */
    private readonly _logger;
    /**
     * Message generation utility methods.
     * @type {MessageUtils}
     * @private
     */
    private readonly _messageUtils;
    /**
     * Giveaways ending state checking interval.
     * @type {NodeJS.Timeout}
     */
    giveawaysCheckingInterval: NodeJS.Timeout;
    /**
     * Main {@link Giveaways} constructor.
     * @param {Client} client Discord client.
     * @param {IGiveawaysConfiguration<TDatabaseType>} options {@link Giveaways} configuration.
     */
    constructor(client: Client<boolean>, options: IGiveawaysConfiguration<TDatabaseType>);
    /**
     * Initialize the database connection and initialize the {@link Giveaways} module.
     * @returns {Promise<void>}
     * @private
     */
    private _init;
    /**
     * Sends the {@link Giveaways} module update state in the console.
     * @returns {Promise<void>}
     * @private
     */
    private _sendUpdateMessage;
    /**
     * Starts the giveaway.
     * @param {IGiveawayStartConfig} giveawayOptions {@link Giveaway} options.
     * @returns {Promise<SafeGiveaway<Giveaway<DatabaseType>>>} Created {@link Giveaway} instance.
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified.
     */
    start(giveawayOptions: IGiveawayStartConfig): Promise<SafeGiveaway<Giveaway<TDatabaseType>>>;
    /**
     * Finds the giveaway in all giveaways database by its ID.
     * @param {number} giveawayID Giveaway ID to find the giveaway by.
     * @returns {Maybe<UnsafeGiveaway<Giveaway<TDatabaseType>>>} Giveaway instance.
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    get(giveawayID: number): Maybe<UnsafeGiveaway<Giveaway<TDatabaseType>>>;
    /**
     * Finds the giveaway in all giveaways database by the specified callback function.
     *
     * @param {FindCallback<Giveaway<TDatabaseType>>} cb
     * The callback function to find the giveaway in the giveaways database.
     *
     * @returns {Maybe<UnsafeGiveaway<Giveaway<TDatabaseType>>>} Giveaway instance.
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    find(cb: FindCallback<Giveaway<TDatabaseType>>): Maybe<UnsafeGiveaway<Giveaway<TDatabaseType>>>;
    /**
     * Returns the mapped giveaways array based on the specified callback function.
     *
     * Type parameters:
     *
     * - `TReturnType` - the type being returned in a callback function.
     *
     * @param {FindCallback<Giveaway<TDatabaseType>>} cb
     * The callback function to call on the giveaway.
     *
     * @returns {TReturnType[]} Mapped giveaways array.
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    map<TReturnType>(cb: MapCallback<Giveaway<TDatabaseType>, TReturnType>): TReturnType[];
    /**
     * Gets all the giveaways from the specified guild in database.
     * @param {DiscordID<string>} guildID Guild ID to get the giveaways from.
     * @returns {Array<UnsafeGiveaway<Giveaway<TDatabaseType>>>} Giveaways array from the specified guild in database.
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    getGuildGiveaways<GuildID extends string>(guildID: DiscordID<GuildID>): UnsafeGiveaway<Giveaway<TDatabaseType>>[];
    /**
     * Gets all the giveaways from all the guilds in database.
     * @returns {Array<Giveaway<TDatabaseType>>} Giveaways array from all the guilds in database.
     */
    getAll(): Giveaway<TDatabaseType>[];
    /**
     * Checks for all giveaways to be finished and end them if they are.
     * @returns {void}
     * @private
     */
    private _checkGiveaways;
}
/**
 * An object that contains an information about a giveaway.
 * @typedef {object} IGiveaway
 * @prop {number} id The ID of the giveaway.
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {GiveawayState} state The state of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {number} startTimestamp The timestamp when the giveaway started.
 * @prop {boolean} isEnded Determines if the giveaway was ended in the database.
 * @prop {number} endTimestamp The timestamp when the giveaway ended.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} messageID The ID of the giveaway message.
 * @prop {string} messageURL The URL of the giveaway message.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 * @prop {number} entries The number of giveaway entries.
 * @prop {string[]} entriesArray The array of user IDs of users that have entered the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 *
 * @template TDatabaseType The database type that will be used in the module.
 */
/**
 * An interface containing embed objects for various giveaway reroll cases.
 * @typedef {object} IGiveawayRerollEmbeds
 * @prop {IGiveawayEmbedOptions} onlyHostCanReroll The options for the embed when only the host can reroll.
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage The options for the embed when sending a new giveaway message.
 * @prop {IGiveawayEmbedOptions} successMessage The options for the embed when the giveaway is successful.
 */
/**
 * An interface containing embed objects for various giveaway finish cases.
 * @typedef {object} IGiveawayFinishEmbeds
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage The options for the embed when sending a new giveaway message.
 * @prop {IGiveawayEmbedOptions} endMessage The options for the embed when the giveaway has ended.
 * @prop {IGiveawayEmbedOptions} noWinnersNewGiveawayMessage The options for the embed when there are no winners for the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} noWinnersEndMessage
 * The options for the embed when there are no winners for the giveaway and it has ended.
 */
/**
 * An interface that contains the data properties for embeds and buttons.
 * @typedef {object} IGiveawayMessageProps
 * @prop {IGiveawayEmbeds} embeds The embed objects for the giveaway message.
 * @prop {IGiveawayButtons} buttons The button objects for the giveaway message.
 */
/**
 * An interface containing different types of giveaway embeds in the IGiveaways class.
 * @typedef {object} IGiveawayEmbeds
 * @prop {IGiveawayEmbedOptions} start Message embed data for cases when the giveaway has started.
 * @prop {IGiveawayRerollEmbeds} reroll Message embed data for cases when rerolling the giveaway.
 * @prop {IGiveawayFinishEmbeds} finish Message embed data for cases when the giveaway has finished.
 */
/**
 * An object that contains messages that are sent in various giveaway cases, such as end with winners or without winners.
 * @typedef {object} IGiveawayFinishMessages
 *
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage
 * The separated message to be sent in the giveaway channel when giveaway ends.
 *
 * @prop {IGiveawayEmbedOptions} endMessage
 * The separated message to be sent in the giveaway channel when a giveaway ends with winners.
 * @prop {IGiveawayEmbedOptions} noWinnersNewGiveawayMessage
 * The message that will be set to the original giveaway message if there are no winners in the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} noWinnersEndMessage
 * The separated message to be sent in the giveaway channel if there are no winners in the giveaway.
 */
/**
 * A function that is called when giveaway is finished.
 * @callback GiveawayFinishCallback
 * @param {string} winnersString A string that contains the users that won the giveaway separated with comma.
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayFinishMessages} Giveaway message objects.
 */
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
/**
 * A function that is called when giveaway winners are rerolled.
 * @callback GiveawayRerollCallback
 *
 * @param {string} winnersMentionsString
 * A string that contains the mentions of users that won the giveaway, separated with comma.
 *
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayRerollMessages} Giveaway message objects.
 */
/**
 * An object that contains the giveaway buttons that may be set up.
 * @typedef {object} IGiveawayMessageButtons
 * @prop {IGiveawayButtonOptions} joinGiveawayButton The options for the join giveaway button.
 * @prop {IGiveawayButtonOptions} rerollButton The options for the reroll button.
 * @prop {IGiveawayButtonOptions} goToMessageButton The options for the go to message button.
 */
/**
 * An object that contains an information about a giveaway without internal props.
 * @typedef {object} GiveawayWithoutInternalProps
 * @prop {number} id The ID of the giveaway.
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {number} startTimestamp The timestamp when the giveaway started.
 * @prop {number} endTimestamp The timestamp when the giveaway ended.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} messageID The ID of the giveaway message.
 * @prop {string} messageURL The URL of the giveaway message.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 * @prop {string[]} entriesArray The array of user IDs of users that have entered the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 */
/**
 * A type that contains all giveaway properties that may be safely edited.
 * @typedef {'prize' | 'winnersCount' | 'hostMemberID'} EditableGiveawayProperties
 */
/**
 * The type that returns the property's value type based on the specified {@link Giveaway} property in `TProperty`.
 *
 * Type parameters:
 *
 * - `TProperty` ({@link EditableGiveawayProperties}) - {@link Giveaway} property to get its value type.
 *
 * @typedef {object} GiveawayPropertyValue<TProperty>
 * @template TProperty {@link Giveaway} property to get its value type.
 */
/**
 * An enum that determines the state of a giveaway.
 * @typedef {number} GiveawayState
 * @prop {number} STARTED The giveaway has started.
 * @prop {number} ENDED The giveaway has ended.
 */
/**
 * Full {@link Giveaways} class configuration object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {object} IGiveawaysConfiguration<TDatabaseType>
 * @prop {DatabaseType} database Database type to use.
 * @prop {DatabaseConnectionOptions} connection Database type to use.
 *
 * @prop {?number} [giveawaysCheckingInterval=1000]
 * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {?number} [minGiveawayEntries=1] Determines the minimum required giveaway entries to draw the winner. Default: 1
 * @prop {Partial} [updatesChecker] Updates checker configuration.
 * @prop {Partial} [configurationChecker] Giveaways config checker configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
/**
 * Optional configuration for the {@link Giveaways} class.
 * @typedef {object} IGiveawaysOptionalConfiguration
 *
 * @prop {?number} [giveawaysCheckingInterval=1000]
 * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {?number} [minGiveawayEntries=1] Determines the minimum required giveaway entries to draw the winner. Default: 1
 * @prop {Partial} [updatesChecker] Updates checker configuration.
 * @prop {Partial} [configurationChecker] Giveaways config checker configuration.
 */
/**
 * Configuration for the updates checker.
 * @typedef {object} IUpdateCheckerConfiguration
 * @prop {?boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @prop {?boolean} [upToDateMessage=false] Sends the message in console on start if module is up to date. Default: false.
 */
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
/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./giveaways.json'] Full path to a JSON storage file. Default: './giveaways.json'.
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingInterval=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */
/**
 * An object that contains an information about a giveaway that is required fo starting..
 * @typedef {object} IGiveawayData
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 */
/**
 * Giveaway start config.
 * @typedef {object} IGiveawayStartConfig
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {IGiveawayButtons} [defineEmbedStrings] Giveaway buttons object.
 */
/**
 * Giveaway buttons that may be specified.
 * @typedef {object} IGiveawayButtons
 * @prop {?IGiveawayButtonOptions} [joinGiveawayButton] Button object for the "join giveaway" button.
 * @prop {?IGiveawayButtonOptions} [rerollButton] Button object for the "reroll" button.
 * @prop {?ILinkButton} [goToMessageButton] Link button object for the "go to message" button.
 */
/**
 * Link button object.
 *
 * Please note that URL is not required as it's being applied after starting the giveaway.
 * @typedef {object} ILinkButton
 * @prop {string} [text] Button text string.
 * @prop {string} [emoji] Emoji string.
 * @prop {ButtonStyle} url URL that the button will take to.
 */
/**
 * A function that defines the embed strings used in the giveaway.
 * @callback DefineEmbedStringsCallback
 * @param {Omit} giveaway - An object containing information about the giveaway.
 * @param {User} giveawayHost - The host of the giveaway.
 * @returns {Partial} - An object containing the defined embed strings.
 */
/**
 * Giveaway start options.
 * @typedef {object} IGiveawayStartOptions
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {IGiveawayButtons} [defineEmbedStrings] Giveaway buttons object.
 */
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
/**
 * Button object.
 * @typedef {object} IGiveawayButtonOptions
 * @prop {?string} [text] Button text string.
 * @prop {?string} [emoji] Emoji string.
 * @prop {?ButtonStyle} [style] Button style.
 */
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
/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./giveaways.json'] Full path to a JSON storage file. Default: './giveaways.json'.
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingInterval=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */
/**
 * Database connection options based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {(
 * Partial<IJSONDatabaseConfiguration> | EnmapOptions<any, any> | IMongoConnectionOptions
 * )} DatabaseConnectionOptions<TDatabaseType>
 *
 * @see Partial<IJSONDatabaseConfiguration> - JSON configuration.
 *
 * @see EnmapOptions<any, any> - Enmap configuration.
 *
 * @see IMongoConnectionOptions - MongoDB connection configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
/**
 * External database object based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will determine
 * which connection configuration should be used.
 *
 * - `TKey` ({@link string}) - The type of database key that will be used.
 * - `TValue` ({@link any}) - The type of database values that will be used.
 *
 * @typedef {(
 * null | Enmap<string, IDatabaseStructure> | Mongo<IDatabaseStructure>
 * )} Database<TDatabaseType>
 *
 * @see null - JSON database management object - `null`
 * is because it's not an external database - JSON is being parsed by the module itself.
 *
 * @see Enmap<string, IDatabaseStructure> - Enmap database.
 *
 * @see Mongo<IDatabaseStructure> - MongoDB database.
 *
 * @template TDatabaseType
 * The database type that will determine which external database management object should be used.
 * @template TKey The type of database key that will be used.
 * @template TValue The type of database values that will be used.
 */
/**
 * An interface containing the structure of the database used in the IGiveaways class.
 * @typedef {object} IDatabaseStructure
 * @prop {any} guildID Guild ID that stores the giveaways array
 * @prop {IGiveaway[]} giveaways Giveaways array property inside the [guildID] object in database.
 */
/**
 * The giveaway data that stored in database,
 * @typedef {object} IDatabaseArrayGiveaway
 * @prop {IGiveaway} giveaway Giveaway object.
 * @prop {number} giveawayIndex Giveaway index in the guild giveaways array.
 */
/**
 * A type containing all the {@link Giveaways} events and their return types.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawaysEvents<TDatabaseType>
 * @prop {Giveaways<DatabaseType>} ready Emits when the {@link Giveaways} is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * @prop {Giveaway<DatabaseType>} giveawayStart Emits when a giveaway is started.
 * @prop {Giveaway<DatabaseType>} giveawayRestart Emits when a giveaway is rerolled.
 * @prop {Giveaway<DatabaseType>} giveawayEnd Emits when a giveaway is rerolled.
 * @prop {IGiveawayRerollEvent} giveawayReroll Emits when a giveaway is rerolled.
 *
 * @template TDatabaseType The database type that will be used in the module.
 */
/**
 * Giveaway reroll event object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawayRerollEvent<TDatabaseType>
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 * @prop {string} newWinners Array of the new picked winners after reroll.
 *
 * @template TDatabaseType The database type that will be used in the module.
 */
/**
 * Giveaway time change event object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawayTimeChangeEvent
 * @prop {string} time The time that affected the giveaway's length.
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 *
 * @template TDatabaseType The database type that will be used in the module.
 */
/**
 * An interface containing different colors that may be used in a logger.
 * @typedef {object} ILoggerColors
 * @prop {string} red The color red.
 * @prop {string} green The color green.
 * @prop {string} yellow The color yellow.
 * @prop {string} blue The color blue.
 * @prop {string} magenta The color magenta.
 * @prop {string} cyan The color cyan.
 * @prop {string} white The color white.
 * @prop {string} reset The reset color.
 * @prop {string} black The color black.
 * @prop {string} lightgray The color light gray.
 * @prop {string} default The default color.
 * @prop {string} darkgray The color dark gray.
 * @prop {string} lightred The color light red.
 * @prop {string} lightgreen The color light green.
 * @prop {string} lightyellow The color light yellow.
 * @prop {string} lightblue The color light blue.
 * @prop {string} lightmagenta The color light magenta.
 * @prop {string} lightcyan The color light cyan.
 */
/**
 * An object containing the data about available module updates.
 * @typedef {object} IUpdateState
 * @prop {boolean} updated Whether an update is available or not.
 * @prop {string} installedVersion The currently installed version.
 * @prop {string} availableVersion The available version, if any.
 */
/**
 * Represents the `if` statement on a type level.
 *
 * Type parameters:
 *
 * - `T` ({@link boolean}) - The boolean type to compare with.
 * - `IfTrue` ({@link any}) - The type that will be returned if `T` is `true`.
 * - `IfFalse` ({@link any}) - The type that will be returned if `T` is `false`.
 *
 * @typedef {IfTrue | IfFalse} If<T, IfTrue, IfFalse>
 *
 * @template T The boolean type to compare with.
 * @template IfTrue The type that will be returned if `T` is `true`.
 * @template IfFalse The type that will be returned if `T` is `false`.
 */
/**
 * Makes the specified properties in `K` from the object in `T` optional.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make optional.
 *
 * @typedef {object} OptionalProps<T, K>
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make optional.
 */
/**
 * Makes the specified properties in `K` from the object in `T` required.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make required.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make required.
 *
 * @typedef {object} RequiredProps
 */
/**
 * A callback function that calls when finding an element in array.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 *
 * @callback FindCallback<T>
 * @template T The type of item to be passed to the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {boolean} The boolean value returned by the callback function.
 */
/**
 * A callback function that calls when mapping the array using the {@link Array.prototype.map} method.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 * - `TReturnType` - ({@link any}) The type of value returned by the callback function.
 *
 * @callback MapCallback<T, TReturnType>
 *
 * @template T The type of item to be passed to the callback function.
 * @template TReturnType The type of value returned by the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */
/**
 * A type that represents any value with "null" possible to be returned.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type to attach.
 *
 * @template T The type to attach.
 * @typedef {any} Maybe<T>
 */
/**
 * Adds a prefix at the beginning of a string literal type.
 *
 * Type parameters:
 *
 * - `TWord` ({@link string}) The string literal type or union type of them to add the prefix to.
 * - `TPrefix` ({@link string}) The string literal type of the prefix to use.
 *
 * @template TWord The string literal type or union type of them to add the prefix to.
 * @template TPrefix The string literal type of the prefix to use.
 *
 * @typedef {string} AddPrefix<TWord, TPrefix>
 */
/**
* Constructs an object type with prefixed properties and specified value for each of them.
*
* Type parameters:
*
* - `TWords` ({@link string}) The union type of string literals to add the prefix to.
* - `TPrefix` ({@link string}) The string literal type of the prefix to use.
* - `Value` ({@link any}) Any value to assign as value of each property of the constructed object.
*
* @template TWords The union type of string literals to add the prefix to.
* @template TPrefix The string literal type of the prefix to use.
* @template Value Any value to assign as value of each property of the constructed object.
*
* @typedef {string} PrefixedObject<TWords, TPrefix, Value>
*/
/**
 * Compares the values on type level and returns a boolean value.
 *
 * Type parameters:
 *
 * - `ToCompare` ({@link any}) - The type to compare.
 * - `CompareWith` ({@link any}) - The type to compare with.
 *
 * @template ToCompare The type to compare.
 * @template CompareWith The type to compare with.
 *
 * @typedef {boolean} Equals<ToCompare, CompareWith>
 */
/**
 * Considers the specified giveaway is running and that is safe to edit its data.
 *
 * Unlocks the following {@link Giveaway} methods - after performing the {@link Giveaway.isRunning()} type-guard check:
 *
 * - {@link Giveaway.end()}
 * - {@link Giveaway.edit()}
 * - {@link Giveaway.extend()}
 * - {@link Giveaway.reduce()}
 * - {@link Giveaway.setPrize()}
 * - {@link Giveaway.setWinnersCount()}
 * - {@link Giveaway.setTime()}
 * - {@link Giveaway.setHostMemberID()}
 *
 * Type parameters:
 *
 * - `TGiveaway` ({@link Giveaway<any>} | {@link UnsafeGiveaway<Giveaway<any>>}) - The giveaway to be considered as safe.
 *
 * @typedef {SafeGiveaway<TGiveaway>}
 * @template TGiveaway The giveaway to be considered as safe.
 */
/**
* Considers the specified giveaway 'that may be ended' and that is *not* safe to edit its data.
*
* Marks the following {@link Giveaway} methods as 'possibly undefined' to prevent them from running
* before performing the {@link Giveaway.isRunning()} type-guard check:
*
* - {@link Giveaway.end()}
* - {@link Giveaway.edit()}
* - {@link Giveaway.extend()}
* - {@link Giveaway.reduce()}
* - {@link Giveaway.setPrize()}
* - {@link Giveaway.setWinnersCount()}
* - {@link Giveaway.setTime()}
* - {@link Giveaway.setHostMemberID()}
*
* Type parameters:
*
* - `TGiveaway` ({@link Giveaway<any>} | {@link SafeGiveaway<Giveaway<any>>}) - The giveaway to be considered as unsafe.
*
* @typedef {UnsafeGiveaway<TGiveaway>}
* @template TGiveaway The giveaway to be considered as unsafe.
*/
/**
 * Returns a length of a string on type level.
 *
 * Type parameters:
 *
 * - `S` ({@link string}) - The string to check the length of.
 *
 * @template S The string to check the length of.
 * @typedef {number} StringLength<S>
 */
/**
* Conditional type that will return the specified string if it matches the specified length.
*
* Type parameters:
*
* - `N` ({@link number}) - The string length to match to.
* - `S` ({@link string}) - The string to check the length of.
*
* @template N The string length to match to.
* @template S The string to check the length of.
*
* @typedef {number} ExactLengthString<N, S>
*/
/**
* Conditional type that will return the specified string if it matches any of the possible Discord ID string lengths.
*
* Type parameters:
*
* - `S` ({@link string}) - The string to check the length of.
*
* @template S The string to check the length of.
* @typedef {number} DiscordID<ID>
*/
/**
 * Extracts the type that was passed into `Promise<...>` type.
 *
 * Type parameters:
 *
 * - `P` ({@link Promise<any>}) - The Promise to extract the type from.
 *
 * @template P The Promise to extract the type from.
 * @typedef {any} ExtractPromisedType<P>
 */
/**
 * Emits when the {@link Giveaways} module is ready.
 * @event Giveaways#ready
 * @param {Giveaways<DatabaseType>} giveaways Initialized {@link Giveaways} instance.
 */
/**
 * Emits when the {@link Giveaways} module establishes the database connection.
 * @event Giveaways#databaseConnect
 * @param {void} databaseConnect Initialized {@link Giveaways} instance.
 */
/**
 * Emits when a giveaway is started.
 * @event Giveaways#giveawayStart
 * @param {Giveaway<DatabaseType>} giveaway {@link Giveaway} that started.
 */
/**
 * Emits when a giveaway is restarted.
 * @event Giveaways#giveawayRestart
 * @param {Giveaway<DatabaseType>} giveaway {@link Giveaway} that restarted.
 */
/**
 * Emits when a giveaway is ended.
 * @event Giveaways#giveawayEnd
 * @param {Giveaway<DatabaseType>} giveaway {@link Giveaway} that ended.
 */
/**
 * Emits when a giveaway is rerolled.
 * @event Giveaways#giveawayReroll
 * @param {IGiveawayRerollEvent} giveaway {@link Giveaway} that was rerolled.
 */
