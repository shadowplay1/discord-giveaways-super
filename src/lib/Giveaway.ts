import { User, TextChannel, Guild } from 'discord.js'

import { Giveaways } from '../Giveaways'
import { IGiveaway, IGiveawayMessageProps } from './giveaway.interface'

export class Giveaway implements Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID'> {
    private _giveaways: Giveaways<any>
    public raw: IGiveaway

    public id: number
    public prize: string
    public time: string
    public winnersCount: number
    public endTimestamp: number
    public messageID: string
    public messageURL: string
    public guild: Guild
    public host: User
    public channel: TextChannel
    public entries: string[]
    public messageProps?: IGiveawayMessageProps

    public constructor(giveaways: Giveaways<any>, giveaway: IGiveaway) {
        this._giveaways = giveaways
        this.raw = giveaway

        this.id = giveaway.id
        this.prize = giveaway.prize
        this.time = giveaway.time
        this.winnersCount = giveaway.winnersCount
        this.endTimestamp = giveaway.endTimestamp
        this.messageID = giveaway.messageID
        this.guild = this._giveaways.client.guilds.cache.get(giveaway.guildID) as Guild
        this.host = this._giveaways.client.users.cache.get(giveaway.hostMemberID) as User
        this.channel = this._giveaways.client.channels.cache.get(giveaway.channelID) as TextChannel
        this.messageURL = giveaway.messageURL || ''
        this.entries = []
        this.messageProps = { embed: {} as any, buttons: {} as any }
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

    public async addEntry(guildID: string, userID: string): Promise<any> {
        const giveaways = await this._giveaways.database.get<IGiveaway[]>(`${guildID}.giveaways`) || []
        const giveawayIndex = giveaways.findIndex(giveaway => giveaway.id == this.id)

        this.entries.push(userID)
        this.raw.entries.push(userID)

        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw)
    }

    public async removeEntry(guildID: string, userID: string): Promise<any> {
        const giveaways = await this._giveaways.database.get<IGiveaway[]>(`${guildID}.giveaways`) || []
        const giveawayIndex = giveaways.findIndex(giveaway => giveaway.id == this.id)

        const entryIndex = this.raw.entries.indexOf(userID)

        this.entries.splice(entryIndex, 1)
        this.raw.entries.splice(entryIndex, 1)

        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw)
    }
}
