import { User, TextChannel, Guild } from 'discord.js'

import { Giveaways } from '../Giveaways'
import { GiveawayState, IGiveaway, IGiveawayMessageProps } from './giveaway.interface'
import { DatabaseType } from '../types/databaseType.enum'

import { MessageUtils } from './util/classes/MessageUtils'
import { ms } from './misc/ms'

import { IDatabaseGiveaway } from '../types/databaseStructure.interface'

/**
 * Class that represents the Giveaway object.
 *
 * @implements {IGiveaway}
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
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
     * Number of possible winners in the giveaway.
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

                finish: {
                    endMessage: {},
                    newGiveawayMessage: {},
                    noWinners: {},
                    noWinnersEndMessage: {}
                },

                reroll: {
                    newGiveawayMessage: {},
                    onlyHostCanReroll: {},
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

    public async restart(): Promise<void> {
        const { giveaway } = await this._getFromDatabase(this.guild.id)
        this.sync(giveaway)

        this.isEnded = false
        this.raw.isEnded = false
        this.endTimestamp = Math.floor((Date.now() + ms(this.time)) / 1000)

        const strings = this.messageProps

        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, strings?.embeds.start)
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton as any)

        const message = await this.channel.messages.fetch(this.messageID)

        await message.edit({
            content: strings?.embeds.start?.messageContent,
            embeds: [embed],
            components: [buttonsRow]
        })

        this._giveaways.emit('giveawayRestart', this)
    }

    public async end(): Promise<void> {
        const { giveaway, giveawayIndex } = await this._getFromDatabase(this.guild.id)
        this.sync(giveaway)

        const winners = this._pickWinners()

        this.isEnded = true
        this.raw.isEnded = true

        await this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw)
        await this._messageUtils.editFinishGiveawayMessage(this.raw, winners)

        this._giveaways.emit('giveawayEnd', this)
    }

    public async reroll(): Promise<string[]> {
        const { giveaway } = await this._getFromDatabase(this.guild.id)
        this.sync(giveaway)

        const winners = this._pickWinners()

        await this._messageUtils.editFinishGiveawayMessage(
            this.raw,
            winners,
            giveaway.messageProps?.embeds.reroll.successMessage
        )

        this._giveaways.emit('giveawayReroll', {
            newWinners: winners,
            giveaway: this
        })

        return winners
    }

    public async addEntry(guildID: string, userID: string): Promise<IGiveaway> {
        const { giveaway, giveawayIndex } = await this._getFromDatabase(guildID)

        giveaway.entriesArray.push(userID)
        giveaway.entries = giveaway.entries + 1

        this.sync(giveaway)
        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw)

        return giveaway
    }

    public async removeEntry(guildID: string, userID: string): Promise<IGiveaway> {
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
     */
    public sync(giveaway: IGiveaway): void {
        for (const key in giveaway) {
            (this as any)[key] = (giveaway as any)[key]
        }

        for (const key in giveaway) {
            (this.raw as any)[key] = (giveaway as any)[key]
        }
    }

    /**
     * Shuffles all the giveaway entries and randomly picks the winners.
     * @returns {string[]} Array of users that were picked as the winners.
     */
    public _pickWinners(): string[] {
        const winners: string[] = []
        const shuffledEntries = this._shuffleArray(this.entriesArray)

        if (!shuffledEntries.length) {
            return []
        }

        for (let i = 0; i < this.winnersCount; i++) {
            const randomEntryIndex = Math.floor(Math.random() * shuffledEntries.length)

            const winnerUserID = shuffledEntries[randomEntryIndex]
            winners.push(winnerUserID)
        }

        return winners
    }

    /**
     * Shuffles an array and returns it.
     * @param {any[]} arrayToShuffle Thr array to shuffle.
     * @returns {any[]} Shuffled array
     */
    private _shuffleArray<T>(arrayToShuffle: T[]): T[] {
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
     */
    private async _getFromDatabase(guildID: string): Promise<IDatabaseGiveaway> {
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
     * Converts the Giveaway instance to a plain object representation.
     * @returns {IGiveaway} Plain object representation of Giveaway instance.
     */
    public toJSON(): IGiveaway {
        return this.raw
    }
}