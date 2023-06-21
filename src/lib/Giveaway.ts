import { User, TextChannel } from 'discord.js'
import { Giveaways } from '../Giveaways'

export class Giveaway implements Omit<IGiveaway, 'hostMemberID' | 'channelID'> {
    private _giveaways: Giveaways<any>

    public prize: string
    public time: string
    public endTimestamp: number
    public messageID: string
    public host: User
    public channel: TextChannel

    constructor(giveaways: Giveaways<any>, giveaway: IGiveaway) {
        this._giveaways = giveaways

        this.prize = giveaway.prize
        this.time = giveaway.time
        this.endTimestamp = giveaway.endTimestamp
        this.messageID = giveaway.messageID
        this.host = this._giveaways.client.users.cache.get(giveaway.hostMemberID) as User
        this.channel = this._giveaways.client.channels.cache.get(giveaway.channelID) as TextChannel
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
}

export interface IGiveaway {
    prize: string
    time: string
    endTimestamp: number
    hostMemberID: string
    channelID: string
    messageID: string
}
