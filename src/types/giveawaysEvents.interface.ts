import { Giveaways } from '../Giveaways'

import { Giveaway } from '../lib/Giveaway'
import { DatabaseType } from './databaseType.enum'

/**
 * A type containing all the {@link Giveaways} events and their return types.
 *
 * Type parameters:
 *
 * - TDatabaseType ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawaysEvents
 * @prop {Giveaways<DatabaseType>} ready Emits when the {@link Giveaways} module is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * @prop {Giveaway<DatabaseType>} giveawayStart Emits when a giveaway is started.
 * @prop {Giveaway<DatabaseType>} giveawayRestart Emits when a giveaway is restarted.
 * @prop {Giveaway<DatabaseType>} giveawayEnd Emits when a giveaway is ended.
 * @prop {IGiveawayRerollEvent} giveawayReroll Emits when a giveaway is rerolled.
 *
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */
export type IGiveawaysEvents<TDatabaseType extends DatabaseType> = {
    ready: Giveaways<TDatabaseType>
    databaseConnect: void
    giveawayReroll: IGiveawayRerollEvent<TDatabaseType>
} & Record<'giveawayStart' | 'giveawayRestart' | 'giveawayEnd', Giveaway<TDatabaseType>>
    & Record<'giveawayLengthExtended' | 'giveawayLengthReduced', IGiveawayTimeChangeEvent<TDatabaseType>>

/**
 * Giveaway reroll event object.
 *
 * Type parameters:
 *
 * - TDatabaseType ({@link DatabaseType}) - The database type that will be used in the module.
 *
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

/**
 * Giveaway time change event object.
 *
 * Type parameters:
 *
 * - TDatabaseType ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawayTimeChangeEvent
 * @prop {string} time The time that affected the giveaway's length.
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 *
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */
export interface IGiveawayTimeChangeEvent<TDatabaseType extends DatabaseType> {
    time: string
    giveaway: Giveaway<TDatabaseType>
}
