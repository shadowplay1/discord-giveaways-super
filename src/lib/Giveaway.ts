import { User, TextChannel, Guild } from 'discord.js'

import { Giveaways } from '../Giveaways'
import { GiveawayState, IGiveaway, IGiveawayMessageProps } from './giveaway.interface'

export class Giveaway implements Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID'> {
    private _giveaways: Giveaways<any>
    public raw: IGiveaway

    public id: number
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
    public messageProps?: IGiveawayMessageProps

    public constructor(giveaways: Giveaways<any>, giveaway: IGiveaway) {
        this._giveaways = giveaways
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
        this.entriesArray = []
        this.entries = 0
        this.messageProps = giveaway.messageProps || {
            embed: {} as any,
            buttons: {} as any
        }
    }


    public async restart(): Promise<any> {
        //
    }

    public async end(): Promise<any> {
        //
    }

    public async forceEnd(): Promise<any> {
        //
    }

    public async reroll(): Promise<any> {
        //
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
     * @param giveaway Giveaway object to sync the constructor properties with.
     */
    public sync(giveaway: IGiveaway): void {
        for (const key in giveaway) {
            (this as any)[key] = (giveaway as any)[key]
        }

        for (const key in giveaway) {
            (this.raw as any)[key] = (giveaway as any)[key]
        }
    }

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

export interface IDatabaseGiveaway {
    giveaway: IGiveaway
    giveawayIndex: number
}
