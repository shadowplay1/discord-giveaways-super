import { Giveaways } from '../Giveaways';
import { Giveaway } from '../lib/Giveaway';
import { DatabaseType } from './databaseType.enum';
import { EditableGiveawayProperties, IGiveaway } from '../lib/giveaway.interface';
import { IDatabaseStructure } from './databaseStructure.interface';
/**
 * A type containing all the {@link Giveaways} events and their return types.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * - `TDatabaseKey` ({@link string}, optional: defaults to `${string}.giveaways`) -
 * The type of database key that will be used in database operations.
 *
 * - `TDatabaseValue` ({@link any}, optional: defaults to {@link IDatabaseStructure}) -
 * The type of database content that will be used in database operations.
 *
 * @typedef {object} IGiveawaysEvents
 * @prop {Giveaways<DatabaseType, TDatabaseKey, TDatabaseValue>} ready Emits when the {@link Giveaways} module is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * @prop {Giveaway<DatabaseType>} giveawayStart Emits when the giveaway is started.
 * @prop {Giveaway<DatabaseType>} giveawayRestart Emits when the giveaway is restarted.
 * @prop {Giveaway<DatabaseType>} giveawayEnd Emits when the giveaway is ended.
 * @prop {IGiveawayRerollEvent<DatabaseType>} giveawayReroll Emits when the giveaway winners are rerolled.
 * @prop {IGiveawayEditEvent<DatabaseType>} giveawayEdit Emits when the giveaway info was edited.
 *
 * @template TDatabaseType The database type that is used.
 * @template TDatabaseKey The type of database key that will be used in database operations.
 * @template TDatabaseValue The type of database content that will be used in database operations.
 */
export type IGiveawaysEvents<TDatabaseType extends DatabaseType, TDatabaseKey extends string = `${string}.giveaways`, TDatabaseValue = IDatabaseStructure> = {
    ready: Giveaways<TDatabaseType, TDatabaseKey, TDatabaseValue>;
    databaseConnect: void;
    giveawayReroll: IGiveawayRerollEvent<TDatabaseType>;
    giveawayEdit: IGiveawayEditEvent<TDatabaseType>;
} & Record<'giveawayStart' | 'giveawayRestart' | 'giveawayEnd', Giveaway<TDatabaseType>> & Record<'giveawayLengthExtend' | 'giveawayLengthReduce', IGiveawayTimeChangeEvent<TDatabaseType>>;
/**
 * Giveaway reroll event object.
 * @typedef {object} IGiveawayRerollEvent
 * @prop {Giveaway<DatabaseType>} giveaway {@link Giveaway} instance that was affected.
 * @prop {string} newWinners Array of the new picked winners after reroll.
 */
export interface IGiveawayRerollEvent<TDatabaseType extends DatabaseType> {
    giveaway: Giveaway<TDatabaseType>;
    newWinners: string[];
}
/**
 * Giveaway time change event object.
 *
 * @typedef {object} IGiveawayTimeChangeEvent
 * @prop {string} time The time that affected the giveaway's length.
 * @prop {Giveaway<DatabaseType>} giveaway {@link Giveaway} instance that was affected.
 */
export interface IGiveawayTimeChangeEvent<TDatabaseType extends DatabaseType> {
    time: string;
    giveaway: Giveaway<TDatabaseType>;
}
/**
 * Giveaway edit event object.
 *
 * @typedef {object} IGiveawayEditEvent
 * @prop {string} key The object key of a giveaway that was changed.
 * @prop {any} oldValue Old value of the changed {@link Giveaway} property.
 * @prop {any} newValue New value of the changed {@link Giveaway} property.
 * @returns {Giveaway<DatabaseType>} {@link Giveaway} instance that was affected.
 */
export interface IGiveawayEditEvent<TDatabaseType extends DatabaseType> {
    key: keyof IGiveaway;
    oldValue: IGiveaway[EditableGiveawayProperties];
    newValue: IGiveaway[EditableGiveawayProperties];
    giveaway: Giveaway<TDatabaseType>;
}
