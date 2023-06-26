import { User, TextChannel, Guild } from 'discord.js'

import { Giveaways } from '../Giveaways'
import { GiveawayState, IGiveaway, IGiveawayMessageProps } from './giveaway.interface'
import { DatabaseType } from '../types/databaseType.enum'

import { MessageUtils } from './util/classes/MessageUtils'
import { ms } from './misc/ms'

import { IDatabaseGiveaway } from '../types/databaseStructure.interface'

/**
 * Class that represents the Giveaway object.
 * @implements {Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID'>}
 */
export class Giveaway<TDatabase extends DatabaseType> implements Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID'> {
    private readonly _giveaways: Giveaways<TDatabase>
    private readonly _messageUtils: MessageUtils

    public raw: IGiveaway

    public readonly id: number
    public prize: string
    public time: string
    public state: GiveawayState
    public winnersCount: number
    public startTimestamp: number
    public endTimestamp: number
    public messageID: string
    public messageURL: string
    public guild: Guild
    public host: User
    public channel: TextChannel
    public entries: number
    public entriesArray: string[]
    public isEnded: boolean
    public messageProps?: IGiveawayMessageProps

    public constructor(giveaways: Giveaways<TDatabase>, giveaway: IGiveaway) {
        this._giveaways = giveaways
        this._messageUtils = new MessageUtils(giveaways, giveaways.client)

        this.raw = giveaway

        this.id = giveaway.id
        this.prize = giveaway.prize
        this.time = giveaway.time
        this.state = giveaway.state
        this.winnersCount = giveaway.winnersCount
        this.startTimestamp = giveaway.startTimestamp
        this.endTimestamp = giveaway.endTimestamp
        this.messageID = giveaway.messageID
        this.guild = this._giveaways.client.guilds.cache.get(giveaway.guildID) as Guild
        this.host = this._giveaways.client.users.cache.get(giveaway.hostMemberID) as User
        this.channel = this._giveaways.client.channels.cache.get(giveaway.channelID) as TextChannel
        this.messageURL = giveaway.messageURL || ''
        this.isEnded = giveaway.isEnded || false
        this.entriesArray = []
        this.entries = 0

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

    public async reroll(): Promise<User[]> {
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
     * @returns {User[]} Array of users that were picked as the winners.
     */
    public _pickWinners(): User[] {
        const winners: User[] = []
        const shuffledEntries = this._shuffleArray(this.entriesArray)

        if (!shuffledEntries.length) {
            return []
        }

        for (let i = 0; i < this.winnersCount; i++) {
            const randomEntryIndex = Math.floor(Math.random() * shuffledEntries.length)

            const winnerUserID = shuffledEntries[randomEntryIndex]
            const winnerUser = this._giveaways.client.users.cache.get(winnerUserID) as User

            winners.push(winnerUser)
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
