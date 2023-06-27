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

/**
 * Replaces the giveaways keys with the corresponding values in the input string.
 * @callback replaceGiveawayKeys
 *
 * @param {string} input The input string to replace the keys in.
 * @param {IGiveaway} giveawayObject
 * @param {string[]} winners Winners array to replace the winners giveaway keys.
 * @returns {string} The string with all keys replaced.
 */
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
