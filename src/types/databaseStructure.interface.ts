import { IGiveaway } from '../lib/giveaway.interface'

/**
 * An interface containing the structure of the database used in the IGiveaways class.
 * @typedef {object} IDatabaseStructure
 * @prop {any} guildID Guild ID that stores the giveaways array
 * @prop {IGiveaway[]} giveaways Giveaways array property inside the [guildID] object in database.
 */
export interface IDatabaseStructure {
    [guildID: string]: {
        giveaways: IGiveaway[]
    }
}

/**
 * The giveaway data that stored in database,
 * @typedef {object} IDatabaseGiveaway
 * @prop {IGiveaway} giveaway Giveaway object.
 * @prop {number} giveawayIndex Giveaway index in the guild giveaways array.
 */
export interface IDatabaseGiveaway {
    giveaway: IGiveaway
    giveawayIndex: number
}
