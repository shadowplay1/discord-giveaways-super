import { User, TextChannel, Guild } from 'discord.js';
import { Giveaways } from '../Giveaways';
import { DatabaseType } from '../types/databaseType.enum';
import { GiveawayPropertyValue, EditableGiveawayProperties, GiveawayState, IGiveaway, IGiveawayMessageProps } from './giveaway.interface';
import { AddPrefix, DiscordID, OptionalProps, RequiredProps } from '../types/misc/utils';
import { IParticipantsFilter } from '../types/configurations';
/**
 * Class that represents the Giveaway object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * @implements {Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID' | 'entries'>}
 * @template TDatabaseType The database type that is used.
 */
export declare class Giveaway<TDatabaseType extends DatabaseType> implements Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID' | 'entries' | 'winners' | 'participantsFilter'> {
    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     * @private
     */
    private readonly _giveaways;
    /**
     * Message utils instance.
     * @type {MessageUtils}
     * @private
     */
    private readonly _messageUtils;
    /**
     * Input giveaway object.
     * @type {IGiveaway}
     * @private
     */
    private _inputGiveaway;
    /**
     * Giveaway ID.
     * @type {number}
     */
    readonly id: number;
    /**
     * Giveaway prize.
     * @type {string}
     */
    prize: string;
    /**
     * Giveaway time.
     * @type {string}
     */
    time: string;
    /**
     * Giveaway state.
     * @type {GiveawayState}
     */
    state: GiveawayState;
    /**
     * Number of possible winnersIDs in the giveaway.
     * @type {number}
     */
    winnersCount: number;
    /**
     * Giveaway start timestamp.
     * @type {number}
     */
    startTimestamp: number;
    /**
     * Giveaway end timestamp.
     * @type {number}
     */
    endTimestamp: number;
    /**
     * Timestamp when the giveaway was ended.
     * @type {number}
     */
    endedTimestamp: number;
    /**
     * Giveaway message ID.
     * @type {DiscordID<string>}
     */
    messageID: DiscordID<string>;
    /**
     * Giveaway message URL.
     * @type {string}
     */
    messageURL: string;
    /**
     * Guild where the giveaway was created.
     * @type {Guild}
     */
    guild: Guild;
    /**
     * User who created the giveaway.
     * @type {User}
     */
    host: User;
    /**
     * Channel where the giveaway was created.
     * @type {TextChannel}
     */
    channel: TextChannel;
    /**
     * Number of users who have joined the giveaway.
     * @type {number}
     */
    entriesCount: number;
    /**
     * Set of IDs of users who have joined the giveaway.
     * @type {Set<DiscordID<string>>}
     */
    entries: Set<DiscordID<string>>;
    /**
     * Array of used ID who have won in the giveaway.
     *
     * Don't confuse this property with `winnersCount`, the setting that dertermines how many users can win in the giveaway.
     * @type {Set<DiscordID<string>>}
     */
    winners: Set<DiscordID<string>>;
    /**
     * Determines if the giveaway was ended in database.
     * @type {boolean}
     */
    isEnded: boolean;
    /**
     * An object with conditions for members to join the giveaway.
     * @type {?IParticipantsFilter}
     */
    participantsFilter: Partial<IParticipantsFilter>;
    /**
     * Message data properties for embeds and buttons.
     * @type {?IGiveawayMessageProps}
     */
    messageProps?: IGiveawayMessageProps;
    /**
     * Giveaway constructor.
     * @param {Giveaways<TDatabaseType>} giveaways {@link Giveaways} instance.
     * @param {IGiveaway} giveaway Input {@link Giveaway} object.
     */
    constructor(giveaways: Giveaways<TDatabaseType, any, any>, giveaway: IGiveaway);
    /**
     * Determines if the giveaway's time is up or if the giveaway was ended forcefully.
     * @type {boolean}
     */
    get isFinished(): boolean;
    /**
     * Raw giveaway object.
     * @type {IGiveaway}
     */
    get raw(): IGiveaway;
    /**
     * [TYPE GUARD FUNCTION] - Determines if the giveaway is running
     * and allows to perform actions if it is.
     * @returns {boolean} Whether the giveaway is running.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `extend` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.extend('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.extend('10s') // we know that giveaway is running - the method is safe to run
     */
    isRunning(): this is SafeGiveaway<Giveaway<TDatabaseType>>;
    /**
     * Restarts the giveaway.
     * @returns {Promise<void>}
     */
    restart(): Promise<void>;
    /**
     * Extends the giveaway length.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} extensionTime The time to extend the giveaway length by.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `extend` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.extend('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.extend('10s') // we know that giveaway is running - the method is safe to run
     */
    extend(extensionTime: string): Promise<void>;
    /**
     * Reduces the giveaway length.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} reductionTime The time to reduce the giveaway length by.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `reduce` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.reduce('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.reduce('10s') // we know that giveaway is running - the method is safe to run
     */
    reduce(reductionTime: string): Promise<void>;
    /**
     * Ends the giveaway.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `end` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.end()
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.end() // we know that giveaway is running - the method is safe to run
     */
    end(): Promise<void>;
    /**
     * Redraws the giveaway winners
     * @returns {Promise<string[]>} Rerolled winners users IDs.
     */
    reroll(): Promise<string[]>;
    /**
     * Adds the user ID into the giveaway entries.
     * @param {DiscordID<string>} guildID The guild ID where the giveaway is hosted.
     * @param {DiscordID<string>} userID The user ID to add.
     * @returns {IGiveaway} Updated giveaway object.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    addEntry<GuildID extends string, UserID extends string>(guildID: DiscordID<GuildID>, userID: DiscordID<UserID>): IGiveaway;
    /**
     * Adds the user ID into the giveaway entries.
     * @param {DiscordID<string>} guildID The guild ID where the giveaway is hosted.
     * @param {DiscordID<string>} userID The user ID to add.
     * @returns {IGiveaway} Updated giveaway object.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    removeEntry<GuildID extends string, UserID extends string>(guildID: DiscordID<GuildID>, userID: DiscordID<UserID>): IGiveaway;
    /**
     * Changes the giveaway's prize and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} prize The new prize to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setPrize` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setPrize('My New Prize')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setPrize('My New Prize') // we know that giveaway is running - the method is safe to run
     */
    setPrize(prize: string): Promise<Giveaway<TDatabaseType>>;
    /**
     * Changes the giveaway's winners count and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} winnersCount The new winners count to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_INPUT` - when the input value is bad or invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setWinnersCount` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setWinnersCount(2)
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setWinnersCount(2) // we know that giveaway is running - the method is safe to run
     */
    setWinnersCount(winnersCount: number): Promise<Giveaway<TDatabaseType>>;
    /**
     * Changes the giveaway's host member ID and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {DiscordID<string>} hostMemberID The new host member ID to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setHostMemberID` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setHostMemberID('123456789012345678')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setHostMemberID('123456789012345678') // we know that giveaway is running - the method is safe to run
     */
    setHostMemberID<HostMemberID extends string>(hostMemberID: DiscordID<HostMemberID>): Promise<Giveaway<TDatabaseType>>;
    /**
     * Changes the giveaway's time and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} time The new time to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setTime` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setTime('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setTime('10s') // we know that giveaway is running - the method is safe to run
     */
    setTime(time: string): Promise<Giveaway<TDatabaseType>>;
    /**
     * Sets the specified value to the specified giveaway property and edits the giveaway message.
     *
     * Type parameters:
     *
     * - `TProperty` ({@link EditableGiveawayProperties}) - Giveaway property to pass in.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} key The key of the giveaway object to set.
     * @param {string} value The value to set.
     * @returns {Promise<Giveaway<DatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @template TProperty Giveaway property to pass in.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `edit` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.edit('prize', 'My New Prize')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.edit('prize', 'My New Prize') // we know that giveaway is running - the method is safe to run
     */
    edit<TProperty extends EditableGiveawayProperties>(key: TProperty, value: GiveawayPropertyValue<TProperty>): Promise<Giveaway<TDatabaseType>>;
    /**
     * Deletes the giveaway from database and deletes its message.
     * @returns {Promise<Giveaway<DatabaseType>>} Deleted {@link Giveaway} instance.
     */
    delete(): Promise<Giveaway<DatabaseType>>;
    /**
     * Syncs the constructor properties with specified raw giveaway object.
     * @param {IGiveaway} giveaway Giveaway object to sync the constructor properties with.
     * @returns {void}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    sync(giveaway: IGiveaway): void;
    /**
     * Shuffles all the giveaway entries, randomly picks the winner user IDs and converts them into mentions.
     * @param {IGiveaway} [giveawayToSyncWith] The giveaway object to sync the {@link Giveaway} instance with.
     * @returns {string[]} Array of mentions of users who were picked as the winners.
     * @private
     */
    private _pickWinners;
    /**
     * Shuffles an array and returns it.
     *
     * Type parameters:
     *
     * - `T` - The type of array to shuffle.
     *
     * @param {any[]} arrayToShuffle The array to shuffle.
     * @returns {any[]} Shuffled array.
     * @private
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     *
     * @template T The type of array to shuffle.
     */
    private _shuffleArray;
    /**
     * Gets the giveaway data and its index in guild giveaways array from database.
     * @param {DiscordID<string>} guildID Guild ID to get the giveaways array from.
     * @returns {IDatabaseArrayGiveaway} Database giveaway object.
     * @private
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    private _getFromCache;
    /**
     * Converts the time string into seconds.
     * @param {string} time The time string to convert.
     * @returns {number} Converted time string into seconds.
     * @private
     *
     * @throws {GiveawaysError} `INVALID_TIME` - if invalid time string was specified.
     */
    private _timeToSeconds;
    /**
     * Fetches the objects of guild, host user and giveaway channel
     * directly from Discord API if something is not present in the cache.
     * @returns {Promise<void>}
     * @private
     */
    private _fetchUncached;
    /**
     * Converts the {@link Giveaway} instance to a plain object representation.
     * @returns {IGiveaway} Plain object representation of {@link Giveaway} instance.
     */
    toJSON(): IGiveaway;
}
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
export type SafeGiveaway<TGiveaway extends Giveaway<any> | UnsafeGiveaway<Giveaway<any>>> = RequiredProps<TGiveaway, 'end' | 'edit' | 'extend' | 'reduce' | AddPrefix<EditableGiveawayProperties, 'set'>>;
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
export type UnsafeGiveaway<TGiveaway extends Giveaway<any> | SafeGiveaway<Giveaway<any>>> = OptionalProps<TGiveaway, 'end' | 'edit' | 'extend' | 'reduce' | AddPrefix<EditableGiveawayProperties, 'set'>>;
