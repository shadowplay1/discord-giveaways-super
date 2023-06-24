import { User } from 'discord.js';
import { Giveaways } from '../Giveaways';
import { Giveaway } from '../lib/Giveaway';
import { DatabaseType } from './databaseType.enum';
export declare type IGiveawaysEvents<TDatabase extends DatabaseType> = {
    ready: Giveaways<TDatabase>;
    databaseConnected: void;
    giveawayRerolled: IGiveawayRerollEvent<TDatabase>;
} & Record<'giveawayStarted' | 'giveawayEnded' | 'giveawayForceEnded', Giveaway<TDatabase>>;
export interface IGiveawayRerollEvent<TDatabase extends DatabaseType> {
    giveaway: Giveaway<TDatabase>;
    newWinner: User;
}
