"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceGiveawayKeys = exports.giveawayTemplate = void 0;
exports.giveawayTemplate = {
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
};
function replaceGiveawayKeys(input, giveawayObject, winners = []) {
    for (const key in exports.giveawayTemplate) {
        input = input?.replaceAll(`{${key}}`, key == 'numberOfWinners'
            ? winners?.length
            : key == 'winnersString' ? winners?.join(', ') : giveawayObject[key]);
    }
    return input;
}
exports.replaceGiveawayKeys = replaceGiveawayKeys;
