import { GiveawayWithoutInternalData } from '../lib/giveaway.interface'

export const giveawayTemplate: GiveawayWithoutInternalData = {
    id: '{id}',
    hostMemberID: '{hostMemberID}',
    guildID: '{guildID}',
    channelID: '{channelID}',
    messageID: '{messageID}',
    prize: '{prize}',
    startTimestamp: '{startTimestamp}',
    endTimestamp: '{endTimestamp}',
    time: '{time}',
    winnersCount: '{winnersCount}',
    entries: '{entries}',
    messageURL: '{messageURL}',
    messageProps: '{messageProps}'
}

export function replaceGiveawayKeys(input: string, giveawayObject: { [key: string]: any }): string {
    for (const key in giveawayTemplate) {
        input = input.replaceAll(`{${key}}`, giveawayObject[key])
    }

    return input
}
