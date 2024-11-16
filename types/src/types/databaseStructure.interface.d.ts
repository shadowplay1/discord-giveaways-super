import { IGiveaway } from '../lib/giveaway.interface';
/**
 * An interface containing the structure of the database used in the IGiveaways class.
 * @typedef {object} IDatabaseStructure
 * @prop {DiscordID<string>} guildID Guild ID that stores the giveaways array
 * @prop {IGiveaway[]} giveaways Giveaways array property inside the [guildID] object in database.
 */
export interface IDatabaseStructure {
    [guildID: string]: IDatabaseGuild;
}
/**
 * An interface containing the structure of the guild object in database.
 * @typedef {object} IDatabaseGuild
 * @prop {IGiveaway[]} giveaways Giveaways array property inside the [guildID] object in database.
 */
export interface IDatabaseGuild {
    giveaways: IGiveaway[];
}
/**
 * The giveaway data that stored in database,
 * @typedef {object} IDatabaseArrayGiveaway
 * @prop {IGiveaway} giveaway Giveaway object.
 * @prop {number} giveawayIndex Giveaway index in the guild giveaways array.
 */
export interface IDatabaseArrayGiveaway {
    giveaway: IGiveaway;
    giveawayIndex: number;
}
