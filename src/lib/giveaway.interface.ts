import { IGiveawayEmbedOptions, IGiveawayJoinButtonOptions } from '../types/configurations'

export interface IGiveaway {

    /**
     * Giveaway ID.
     * @type {number}
     */
    id: number

    /**
     * Giveaway prize.
     * @type {string}
     */
    prize: string

    /**
     * Giveaway time.
     * @type {string}
     */
    time: string

    /**
     * Giveaway state
     * @type {GiveawayState}
     */
    state: GiveawayState

    /**
     * Giveaway winners count.
     * @type {number}
     */
    winnersCount: number

    /**
     * Giveaway end timestamp.
     * @type {number}
     */
    startTimestamp: number

    /**
     * Giveaway end timestamp.
     * @type {number}
     */
    endTimestamp: number

    /**
     * Giveaway host member ID.
     * @type {string}
     */
    hostMemberID: string

    /**
     * Giveaway channel ID.
     * @type {string}
     */
    channelID: string

    /**
     * Giveaway message ID.
     * @type {string}
     */
    messageID: string

    /**
     * Giveaway message URL.
     * @type {string}
     */
    messageURL?: string

    /**
     * Giveaway guild ID.
     * @type {string}
     */
    guildID: string

    /**
     * Number of giveaway entries.
     * @type {number}
     */
    entries: number

    /**
     * Array of user IDs of users that entered the giveaway.
     * @type {string[]}
     */
    entriesArray: string[]

    /**
     * Message data properties for embeds and buttons.
     * @type {IGiveawayMessageProps}
     */
    messageProps?: IGiveawayMessageProps
}

export interface IGiveawayMessageProps {
    embed: IGiveawayEmbedOptions
    buttons: Record<'joinGiveawayButton' | 'rerollButton' | 'goToMessageButton', Partial<IGiveawayJoinButtonOptions>>
}

export type GiveawayWithoutInternalData = Omit<Record<keyof IGiveaway, string>, 'entriesArray' | 'state'>

export enum GiveawayState {
    STARTED = 1,
    ENDED = 2,
    FORCE_ENDED = 3
}
