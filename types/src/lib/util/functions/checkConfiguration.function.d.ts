import { IGiveawaysConfiguration, IGiveawaysConfigCheckerConfiguration } from '../../../types/configurations';
import { DatabaseType } from '../../../types/databaseType.enum';
/**
 * Completes, fills and fixes the {@link Giveaways} configuration.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will
 * determine which connection configuration should be used.
 *
 * @callback checkConfiguration
 *
 * @param {IGiveawaysConfiguration} configurationToCheck The {@link Giveaways} configuration object to check.
 * @param {Partial<IGiveawaysConfigCheckerConfiguration>} [checkerConfiguration] Config checker configuration object.
 *
 * @returns {Required<IGiveawaysConfiguration<TDatabaseType>>} Completed, filled and fixed {@link Giveaways} configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
export declare const checkConfiguration: <TDatabaseType extends DatabaseType>(configurationToCheck: IGiveawaysConfiguration<TDatabaseType>, checkerConfiguration?: Partial<IGiveawaysConfigCheckerConfiguration>) => Required<IGiveawaysConfiguration<TDatabaseType>>;
