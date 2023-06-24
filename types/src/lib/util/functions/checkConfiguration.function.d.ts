import { IGiveawaysConfiguration, IGiveawaysConfigCheckerConfiguration } from '../../../types/configurations';
import { DatabaseType } from '../../../types/databaseType.enum';
export declare const checkConfiguration: <TDatabaseType extends DatabaseType>(configurationToCheck: {
    [key: string]: any;
}, checkerConfiguration?: Partial<IGiveawaysConfigCheckerConfiguration>) => IGiveawaysConfiguration<TDatabaseType>;
