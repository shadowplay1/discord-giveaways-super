import { User, TextChannel, Guild } from 'discord.js'

import { Giveaways } from '../Giveaways'
import { GiveawayState, IGiveaway, IGiveawayMessageProps } from './giveaway.interface'
import { DatabaseType } from '../types/databaseType.enum'

import { MessageUtils } from './util/classes/MessageUtils'
import { ms } from './misc/ms'

import { IDatabaseGiveaway } from '../types/databaseStructure.interface'
import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from './util/classes/GiveawaysError'
import { replaceGiveawayKeys } from '../structures/giveawayTemplate'

/**
 * Class that represents the Giveaway object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @implements {IGiveaway<DatabaseType>}
 * @template TDatabaseType The database type that will be used in the module.
 */
export class Giveaway<
    TDatabaseType extends DatabaseType
> implements Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID'> {

    /**
     * Giveaways instance.
     * @type {Giveaways<DatabaseType>}
     * @private
     */
    private readonly _giveaways: Giveaways<TDatabaseType>

    /**
     * Message utils instance.
     * @type {MessageUtils}
     * @private
     */
    private readonly _messageUtils: MessageUtils


    /**
     * Raw giveaway object.
     * @type {IGiveaway}
     */
    public raw: IGiveaway

    /**
     * Giveaway ID.
     * @type {number}
     */
    public readonly id: number

    /**
     * Giveaway prize.
     * @type {string}
     */
    public prize: string

    /**
     * Giveaway time.
     * @type {string}
     */
    public time: string

    /**
     * Giveaway state.
     * @type {GiveawayState}
     */
    public state: GiveawayState

    /**
     * Number of possible winnerIDs in the giveaway.
     * @type {number}
     */
    public winnersCount: number

    /**
     * Giveaway start timestamp.
     * @type {number}
     */
    public startTimestamp: number

    /**
     * Giveaway end timestamp.
     * @type {number}
     */
    public endTimestamp: number

    /**
     * Giveaway message ID.
     * @type {string}
     */
    public messageID: string

    /**
     * Giveaway message URL.
     * @type {string}
     */
    public messageURL: string

    /**
     * Guild where the giveaway was created.
     * @type {Guild}
     */
    public guild: Guild

    /**
     * User who created the giveaway.
     * @type {User}
     */
    public host: User

    /**
     * Channel where the giveaway was created.
     * @type {TextChannel}
     */
    public channel: TextChannel

    /**
     * Number of giveaway entries.
     * @type {number}
     */
    public entries: number

    /**
     * Array of user IDs of users that have entered the giveaway.
     * @type {string[]}
     */
    public entriesArray: string[]

    /**
     * Determines if the giveaway was ended in database.
     * @type {boolean}
     */
    public isEnded: boolean

    /**
     * Message data properties for embeds and buttons.
     * @type {?IGiveawayMessageProps}
     */
    public messageProps?: IGiveawayMessageProps

    public constructor(giveaways: Giveaways<TDatabaseType>, giveaway: IGiveaway) {

        /**
         * Giveaways instance.
         * @type {Giveaways<DatabaseType>}
         * @private
         */
        this._giveaways = giveaways

        /**
         * Message utils instance.
         * @type {MessageUtils}
         * @private
         */
        this._messageUtils = new MessageUtils(giveaways)


        /**
         * Raw giveaway object.
         * @type {IGiveaway}
         */
        this.raw = giveaway

        /**
         * Giveaway ID.
         * @type {number}
         */
        this.id = giveaway.id

        /**
         * Giveaway prize.
         * @type {string}
         */
        this.prize = giveaway.prize

        /**
         * Giveaway time.
         * @type {string}
         */
        this.time = giveaway.time

        /**
         * Giveaway state.
         * @type {GiveawayState}
         */
        this.state = giveaway.state

        /**
         * Number of possible winners in the giveaway.
         * @type {number}
         */
        this.winnersCount = giveaway.winnersCount

        /**
         * Giveaway start timestamp.
         * @type {number}
         */
        this.startTimestamp = giveaway.startTimestamp

        /**
         * Giveaway end timestamp.
         * @type {number}
         */
        this.endTimestamp = giveaway.endTimestamp

        /**
         * Giveaway message ID.
         * @type {string}
         */
        this.messageID = giveaway.messageID

        /**
         * Guild where the giveaway was created.
         * @type {Guild}
         */
        this.guild = this._giveaways.client.guilds.cache.get(giveaway.guildID) as Guild

        /**
         * User who created the giveaway.
         * @type {User}
         */
        this.host = this._giveaways.client.users.cache.get(giveaway.hostMemberID) as User

        /**
         * Channel where the giveaway was created.
         * @type {TextChannel}
         */
        this.channel = this._giveaways.client.channels.cache.get(giveaway.channelID) as TextChannel

        /**
         * Giveaway message URL.
         * @type {string}
         */
        this.messageURL = giveaway.messageURL || ''

        /**
         * Determines if the giveaway was ended in database.
         * @type {boolean}
         */
        this.isEnded = giveaway.isEnded || false

        /**
         * Array of user IDs of users that have entered the giveaway.
         * @type {string[]}
         */
        this.entriesArray = []

        /**
         * Number of giveaway entries.
         * @type {number}
         */
        this.entries = 0

        /**
         * Message data properties for embeds and buttons.
         * @type {IGiveawayMessageProps}
         */
        this.messageProps = giveaway.messageProps || {
            embeds: {
                start: {},

                joinGiveawayMessage: {},
                leaveGiveawayMessage: {},

                finish: {
                    endMessage: {},
                    newGiveawayMessage: {},
                    noWinners: {},
                    noWinnersEndMessage: {}
                },

                reroll: {
                    newGiveawayMessage: {},
                    onlyHostCanReroll: {},
                    rerollMessage: {},
                    successMessage: {}
                }
            },

            buttons: {
                joinGiveawayButton: {},
                goToMessageButton: {},
                rerollButton: {}
            }
        }
    }

    /**
     * Determines if the giveaway's time is up or if the giveaway was ended forcefully.
     * @type {boolean}
     */
    public get isFinished(): boolean {
        return this.state !== GiveawayState.STARTED || Date.now() > this.endTimestamp * 1000
    }

    /**
     * Restarts the giveaway.
     * @returns {Promise<void>}
     */
    public async restart(): Promise<void> {
        const { giveawayIndex } = await this._getFromDatabase(this.guild.id)

        this.isEnded = false
        this.raw.isEnded = false

        this.endTimestamp = Math.floor((Date.now() + ms(this.time)) / 1000)
        this.raw.endTimestamp = Math.floor((Date.now() + ms(this.time)) / 1000)

        const strings = this.messageProps
        const startEmbedStrings = strings?.embeds.start

        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings)
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton as any)

        const message = await this.channel.messages.fetch(this.messageID)
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw)

        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: Object.keys(startEmbedStrings as any).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        })

        this._giveaways.emit('giveawayRestart', this)
    }

    /**
     * Extends the giveaway length.
     * @param {string} extensionTime The time to extend the giveaway length by.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     */
    public async extendLength(extensionTime: string): Promise<void> {
        const { giveaway, giveawayIndex } = await this._getFromDatabase(this.guild.id)

        if (!extensionTime) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('extensionTime', 'Giveaways.extendLength'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (typeof extensionTime !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('extensionTime', 'string', extensionTime),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (this.isEnded) {
            throw new GiveawaysError(
                'Cannot extend the giveaway\'s length: '
                + errorMessages.GIVEAWAY_ALREADY_ENDED(giveaway.prize, giveaway.id.toString()),
                GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED
            )
        }


        this.endTimestamp = this.endTimestamp + this._timeToSeconds(extensionTime)
        this.raw.endTimestamp = this.endTimestamp + this._timeToSeconds(extensionTime)

        const strings = this.messageProps
        const startEmbedStrings = strings?.embeds.start

        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings)
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton as any)

        const message = await this.channel.messages.fetch(this.messageID)
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw)

        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: Object.keys(startEmbedStrings as any).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        })

        this._giveaways.emit('giveawayRestart', this)
    }

    /**
     * Reduces the giveaway length.
     * @param {string} reductionTime The time to reduce the giveaway length by.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     */
    public async reduceLength(reductionTime: string): Promise<void> {
        const { giveaway, giveawayIndex } = await this._getFromDatabase(this.guild.id)

        if (!reductionTime) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('reductionTime', 'Giveaways.extendLength'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (typeof reductionTime !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('reductionTime', 'string', reductionTime),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (this.isEnded) {
            throw new GiveawaysError(
                'Cannot reduce the giveaway\'s length: '
                + errorMessages.GIVEAWAY_ALREADY_ENDED(giveaway.prize, giveaway.id.toString()),
                GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED
            )
        }

        this.endTimestamp = this.endTimestamp - this._timeToSeconds(reductionTime)
        this.raw.endTimestamp = this.endTimestamp - this._timeToSeconds(reductionTime)

        const strings = this.messageProps
        const startEmbedStrings = strings?.embeds.start

        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings)
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton as any)

        const message = await this.channel.messages.fetch(this.messageID)
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw)

        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: Object.keys(startEmbedStrings as any).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        })

        this._giveaways.emit('giveawayRestart', this)
    }


    /**
     * Ends the giveaway.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     */
    public async end(): Promise<void> {
        const { giveaway, giveawayIndex } = await this._getFromDatabase(this.guild.id)
        const winnerIDs = this._pickWinners(giveaway)

        if (this.isEnded) {
            throw new GiveawaysError(
                errorMessages.GIVEAWAY_ALREADY_ENDED(giveaway.prize, giveaway.id.toString()),
                GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED
            )
        }

        this.isEnded = true
        this.raw.isEnded = true

        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw)

        this._messageUtils.editFinishGiveawayMessage(
            this.raw,
            winnerIDs,
            this.messageProps?.embeds.finish?.newGiveawayMessage as any
        )

        this._giveaways.emit('giveawayEnd', this)
    }

    /**
     * Redraws the giveaway winners
     * @returns {Promise<string[]>} Rerolled winners users IDs.
     */
    public async reroll(): Promise<string[]> {
        const { giveaway } = await this._getFromDatabase(this.guild.id)
        const winnerIDs = this._pickWinners(giveaway)

        const rerollEmbedStrings = giveaway.messageProps?.embeds?.reroll
        const rerollMessage: { [key: string]: any } = rerollEmbedStrings?.rerollMessage || {}

        for (const key in rerollMessage) {
            rerollMessage[key] = replaceGiveawayKeys(rerollMessage[key], this, winnerIDs)
        }

        const rerolledEmbed = this._messageUtils.buildGiveawayEmbed(this.raw, rerollMessage, winnerIDs)
        const giveawayMessage = await this.channel.messages.fetch(this.messageID)

        giveawayMessage.reply({
            content: rerollMessage?.messageContent,
            embeds: Object.keys(rerollMessage as any).length && rerollMessage?.messageContent ? [] : [rerolledEmbed]
        })

        this._messageUtils.editFinishGiveawayMessage(
            this.raw,
            winnerIDs,
            rerollEmbedStrings?.newGiveawayMessage,
            false,
            rerollEmbedStrings?.successMessage,
        )

        this._giveaways.emit('giveawayReroll', {
            newWinners: winnerIDs,
            giveaway: this
        })

        return winnerIDs
    }

    /**
     * Adds the user ID into the giveaway entries.
     * @param {string} guildID The guild ID where the giveaway is hosted.
     * @param {string} userID The user ID to add.
     * @returns {IGiveaway} Updated giveaway object.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    public async addEntry(guildID: string, userID: string): Promise<IGiveaway> {
        if (!guildID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaway.addEntry'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (!userID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('userID', 'Giveaway.addEntry'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }


        if (typeof guildID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('guildID', 'string', guildID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof userID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('userID', 'string', userID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const { giveaway, giveawayIndex } = await this._getFromDatabase(guildID)

        giveaway.entriesArray.push(userID)
        giveaway.entries = giveaway.entries + 1

        this.sync(giveaway)
        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw)

        return giveaway
    }

    /**
     * Adds the user ID into the giveaway entries.
     * @param {string} guildID The guild ID where the giveaway is hosted.
     * @param {string} userID The user ID to add.
     * @returns {IGiveaway} Updated giveaway object.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    public async removeEntry(guildID: string, userID: string): Promise<IGiveaway> {
        if (!guildID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaway.removeEntry'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (!userID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('userID', 'Giveaway.removeEntry'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }


        if (typeof guildID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('guildID', 'string', guildID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof userID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('userID', 'string', userID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const { giveaway, giveawayIndex } = await this._getFromDatabase(guildID)
        const entryIndex = this.raw.entriesArray.indexOf(userID)

        giveaway.entriesArray.splice(entryIndex, 1)
        giveaway.entries = giveaway.entries - 1

        this.sync(giveaway)
        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw)

        return giveaway
    }

    /**
     * Syncs the constructor properties with specified raw giveaway object.
     * @param {IGiveaway} giveaway Giveaway object to sync the constructor properties with.
     * @returns {void}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    public sync(giveaway: IGiveaway): void {
        if (!giveaway) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('giveaway', 'Giveaway.sync'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (typeof giveaway !== 'object') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveaway', 'object', giveaway as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        for (const key in giveaway) {
            (this as any)[key] = (giveaway as any)[key]
        }

        for (const key in giveaway) {
            (this.raw as any)[key] = (giveaway as any)[key]
        }
    }

    /**
     * Shuffles all the giveaway entries, randomly picks the winner user IDs and converts them into mentions.
     * @param {IGiveaway} [giveawayTySync] The giveaway object to sync with.
     * @returns {string[]} Array of mentions of users that were picked as the winners.
     * @private
     */
    private _pickWinners(giveawayTySync?: IGiveaway): string[] {
        const winnerIDs: string[] = []

        if (giveawayTySync) {
            this.sync(giveawayTySync)
        }

        if (!this.entriesArray.length) {
            return []
        }

        const shuffledEntries = this._shuffleArray(this.entriesArray)

        for (let i = 0; i < this.winnersCount; i++) {
            const recursiveShuffle = (): void => {
                const randomEntryIndex = Math.floor(Math.random() * shuffledEntries.length)
                const winnerUserID = shuffledEntries[randomEntryIndex]

                if (winnerIDs.includes(winnerUserID)) {
                    if (winnerIDs.length !== this.entriesArray.length) {
                        recursiveShuffle()
                    }
                } else {
                    winnerIDs.push(winnerUserID)
                }
            }

            recursiveShuffle()
        }

        return winnerIDs.map(winnerID => `<@${winnerID}>`)
    }

    /**
     * Shuffles an array and returns it.
     * @param {any[]} arrayToShuffle Thr array to shuffle.
     * @returns {any[]} Shuffled array.
     * @private
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    private _shuffleArray<T>(arrayToShuffle: T[]): T[] {
        if (!arrayToShuffle) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('arrayToShuffle', 'Giveaway._shuffleArray'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (!Array.isArray(arrayToShuffle)) {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('arrayToShuffle', 'array', arrayToShuffle as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const shuffledArray = [...arrayToShuffle]

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)) as any

            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
        }

        return shuffledArray
    }

    /**
     * Gets the giveaway data and its index in guild giveaways array from database.
     * @param {string} guildID Guild ID to get the giveaways array from.
     * @returns {Promise<IDatabaseGiveaway>} Database giveaway object.
     * @private
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    private async _getFromDatabase(guildID: string): Promise<IDatabaseGiveaway> {
        if (!guildID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaway._getFromDatabase'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (typeof guildID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('guildID', 'string', guildID as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const giveaways = await this._giveaways.database.get<IGiveaway[]>(`${guildID}.giveaways`) || []

        const giveawayIndex = giveaways.findIndex(giveaway => giveaway.id == this.id)
        const giveaway = giveaways[giveawayIndex]

        this.sync(giveaway)

        return {
            giveaway,
            giveawayIndex
        }
    }

    /**
     * Converts the time string into seconds.
     * @param {string} time The time string to convert.
     * @returns {number} Converted time string into seconds.
     * @private
     *
     * @throws {GiveawaysError} `INVALID_TIME` - if invalid time string was specified.
     */
    private _timeToSeconds(time: string): number {
        try {
            const milliseconds = ms(time)
            return Math.floor(milliseconds / 1000 / 2)
        } catch {
            throw new GiveawaysError(GiveawaysErrorCodes.INVALID_TIME)
        }
    }

    /**
     * Converts the {@link Giveaway} instance to a plain object representation.
     * @returns {IGiveaway} Plain object representation of {@link Giveaway} instance.
     */
    public toJSON(): IGiveaway {
        return this.raw
    }
}
