import { Giveaways } from '../Giveaways'

import { Giveaway } from '../lib/Giveaway'
import { DatabaseType } from './databaseType.enum'

/**
 * A type containing all the @see Giveaways events and their return types..
 * @typedef {object} IGiveawaysEvents
 * @prop {Giveaways<DatabaseType>} ready Emits when the @see Giveaways is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * @prop {Giveaway<DatabaseType>} giveawayStart Emits when a giveaway is started.
 * @prop {Giveaway<DatabaseType>} giveawayRestart Emits when a giveaway is rerolled.
 * @prop {Giveaway<DatabaseType>} giveawayEnd Emits when a giveaway is rerolled.
 * @prop {IGiveawayRerollEvent} giveawayReroll Emits when a giveaway is rerolled.
 *
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */
export type IGiveawaysEvents<TDatabaseType extends DatabaseType> = {
    ready: Giveaways<TDatabaseType>
    databaseConnect: void
    giveawayReroll: IGiveawayRerollEvent<TDatabaseType>
} & Record<'giveawayStart' | 'giveawayRestart' | 'giveawayEnd', Giveaway<TDatabaseType>>

/**
 * Giveaway reroll event object.
 * @typedef {object} IGiveawayRerollEvent
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 * @prop {string} newWinners Array of the new picked winners after reroll.
 *
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */
export interface IGiveawayRerollEvent<TDatabaseType extends DatabaseType> {
    giveaway: Giveaway<TDatabaseType>
    newWinners: string[]
}
