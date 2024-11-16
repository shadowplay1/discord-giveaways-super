import { IGiveawayEmbedOptions, IGiveawayButtonOptions, IGiveawayStartMessages, IGiveawayRerollMessages, IParticipantsFilter, IGiveawayJoinRestrictionsMessages } from '../types/configurations';
import { DiscordID } from '../types/misc/utils';
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
 * @prop {Array<DiscordID<string>>} entries The array of user Set of IDs of users who have joined the giveaway.
 * @prop {Array<DiscordID<string>>} winners Array of used ID who have won in the giveaway.
 *
 * Don't confuse this property with `winnersCount`, the setting that dertermines how many users can win in the giveaway.
 * @prop {number} entriesCount The number of users who have joined the giveaway.
 * @prop {Partial<IParticipantsFilter>} participantsFilter An object with conditions for members to join the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 *
 * @template TDatabaseType The database type that is used.
 */
export interface IGiveaway<HostMemberID extends string = string, ChannelID extends string = string, GuildID extends string = string> {
    /**
     * Giveaway ID.
     * @type {number}
     */
    id: number;
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
     * Giveaway state
     * @type {GiveawayState}
     */
    state: GiveawayState;
    /**
     * Number of possible winners in the giveaway.
     * @type {number}
     */
    winnersCount: number;
    /**
     * Giveaway end timestamp.
     * @type {number}
     */
    startTimestamp: number;
    /**
     * Determines if the giveaway was ended in database.
     * @type {boolean}
     */
    isEnded: boolean;
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
     * Giveaway host member ID.
     * @type {DiscordID<HostMemberID>}
     */
    hostMemberID: DiscordID<HostMemberID>;
    /**
     * Giveaway channel ID.
     * @type {DiscordID<ChannelID>}
     */
    channelID: DiscordID<ChannelID>;
    /**
     * Giveaway message ID.
     * @type {DiscordID<string>}
     */
    messageID: DiscordID<string>;
    /**
     * Giveaway message URL.
     * @type {string}
     */
    messageURL?: string;
    /**
     * Giveaway guild ID.
     * @type {DiscordID<GuildID>}
     */
    guildID: DiscordID<GuildID>;
    /**
     * Number of users who have joined the giveaway.
     * @type {number}
     */
    entriesCount: number;
    /**
     * An object with conditions for members to join the giveaway.
     * @type {?IParticipantsFilter}
     */
    participantsFilter: Partial<IParticipantsFilter>;
    /**
     * Array of user Set of IDs of users who have joined the giveaway.
     * @type {Array<DiscordID<string>>}
     */
    entries: Array<DiscordID<string>>;
    /**
     * Array of used ID who have won in the giveaway.
     *
     * Don't confuse this property with `winnersCount`, the setting that dertermines how many users can win in the giveaway.
     * @type {Array<DiscordID<string>>}
     */
    winners: Array<DiscordID<string>>;
    /**
     * Message data properties for embeds and buttons.
     * @type {IGiveawayMessageProps}
     */
    messageProps?: IGiveawayMessageProps;
}
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
 *
 * @prop {IGiveawayEmbedOptions} noWinnersNewGiveawayMessage
 * The options for the embed when there are no winners for the giveaway.
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
export interface IGiveawayMessageProps {
    /**
     * The embed objects for the giveaway message.
     * @type {IGiveawayEmbeds}
     */
    embeds: Partial<IGiveawayEmbeds>;
    /**
     * The button objects for the giveaway message.
     * @type {IGiveawayMessageButtons}
     */
    buttons: IGiveawayMessageButtons;
}
/**
 * An interface containing different types of giveaway embeds in the IGiveaways class.
 * @typedef {object} IGiveawayEmbeds
 * @prop {IGiveawayEmbedOptions} start Message embed data for cases when the giveaway has started.
 * @prop {IGiveawayEmbedOptions} joinGiveawayMessage The message to reply to user with when they join the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} leaveGiveawayMejoinGiveawayMessage
 * The message to reply to user with when they leave the giveaway.
 *
 * @prop {IGiveawayRerollEmbeds} reroll Message embed data for cases when rerolling the giveaway.
 * @prop {IGiveawayFinishEmbeds} finish Message embed data for cases when the giveaway has finished.
 *
 * @prop {IGiveawayJoinRestrictionsMessages} restrictionsMessages
 * Message embed data for all the giveaway joining restrictions cases.
 */
export interface IGiveawayEmbeds {
    /**
     * Message embed data for cases when the giveaway has started.
     * @type {IGiveawayEmbedOptions}
     */
    start: IGiveawayEmbedOptions;
    /**
     * The message to reply to user with when they join the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    joinGiveawayMessage: IGiveawayEmbedOptions;
    /**
     * The message to reply to user with when they leave the giveaway.
     * @type {IGiveawayEmbedOptions}
     */
    leaveGiveawayMessage: IGiveawayEmbedOptions;
    /**
     * Message embed data for cases when rerolling the giveaway.
     * @type {IGiveawayRerollEmbeds}
     */
    reroll: IGiveawayRerollMessages;
    /**
     * Message embed data for cases when the giveaway has finished.
     * @type {IGiveawayFinishEmbeds}
     */
    finish: IGiveawayStartMessages;
    /**
     * Message embed data for all the giveaway joining restrictions cases.
     * @type {IGiveawayJoinRestrictionsMessages}
     */
    restrictionsMessages: IGiveawayJoinRestrictionsMessages;
}
/**
 * An object that contains the giveaway buttons that may be set up.
 * @typedef {object} IGiveawayMessageButtons
 * @prop {IGiveawayButtonOptions} joinGiveawayButton The options for the join giveaway button.
 * @prop {IGiveawayButtonOptions} rerollButton The options for the reroll button.
 * @prop {IGiveawayButtonOptions} goToMessageButton The options for the go to message button.
 */
export type IGiveawayMessageButtons = Record<'joinGiveawayButton' | 'rerollButton' | 'goToMessageButton', IGiveawayButtonOptions>;
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
 * @prop {Array<DiscordID<string>>} entries The array of user Set of IDs of users who have joined the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 */
export type GiveawayWithoutInternalProps = Omit<Record<keyof IGiveaway, string>, 'entries' | 'state' | 'isEnded' | 'participantsFilter' | 'winners'>;
/**
 * A type that contains all giveaway properties that may be safely edited.
 * @typedef {'prize' | 'winnersCount' | 'hostMemberID'} EditableGiveawayProperties
 */
export type EditableGiveawayProperties = 'prize' | 'winnersCount' | 'time' | 'hostMemberID';
/**
 * The type that returns the property's value type based on the specified {@link Giveaway} property in `TProperty`.
 *
 * Type parameters:
 *
 * - `TProperty` ({@link EditableGiveawayProperties}) - {@link Giveaway} property to get its value type.
 *
 * @template TProperty {@link Giveaway} property to get its value type.
 * @typedef {object} GiveawayPropertyValue<TProperty>
 */
export type GiveawayPropertyValue<TProperty extends EditableGiveawayProperties> = IGiveaway[TProperty];
/**
 * An enum that determines the state of a giveaway.
 * @typedef {number} GiveawayState
 * @prop {number} STARTED The giveaway has started.
 * @prop {number} ENDED The giveaway has ended.
 */
export declare enum GiveawayState {
    STARTED = 1,
    ENDED = 2
}
