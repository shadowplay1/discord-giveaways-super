import { GiveawayWithoutInternalProps } from '../lib/giveaway.interface'

export const giveawayTemplate: IGiveawayTemplate = {
    id: '{id}',
    hostMemberID: '{hostMemberID}',
    guildID: '{guildID}',
    channelID: '{channelID}',
    messageID: '{messageID}',
    prize: '{prize}',
    startTimestamp: '{startTimestamp}',
    endTimestamp: '{endTimestamp}',
    endedTimestamp: '{endedTimestamp}',
    time: '{time}',
    winnersCount: '{winnersCount}',
    entriesCount: '{entriesCount}',
    messageURL: '{messageURL}',
    messageProps: '{messageProps}',
    numberOfWinners: '{numberOfWinners}',
    winnersString: '{winnersString}',
    isEnded: '{isEnded}',
    state: '{state}',
    entries: ''
}

export function replaceGiveawayKeys(
    input: string,
    giveawayObject: Record<string, any>,
    winners: string[] = []
): string {
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

export type IGiveawayTemplate = GiveawayWithoutInternalProps & Record<
    'numberOfWinners' | 'winnersString' | 'isEnded' | 'state', string
> & { entries: '' }
