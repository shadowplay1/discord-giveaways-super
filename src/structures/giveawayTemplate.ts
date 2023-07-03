import { GiveawayWithoutInternalProps } from '../lib/giveaway.interface'

export const giveawayTemplate: GiveawayWithoutInternalProps & Record<'numberOfWinners' | 'winnersString', string> = {
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
    messageProps: '{messageProps}',
    numberOfWinners: '{numberOfWinners}',
    winnersString: '{winnersString}',
}

export function replaceGiveawayKeys(input: string, giveawayObject: { [key: string]: any }, winners: string[] = []): string {
    for (const key in giveawayTemplate) {
        input = input?.replaceAll(
            `{${key}}`,
            key == 'numberOfWinners'
                ? winners?.length
                : key == 'winnersString' ? winners?.join(', ') : giveawayObject[key]
        )
    }

    return input
}
