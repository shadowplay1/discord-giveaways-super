import { IGiveaway } from '../lib/giveaway.interface';
export interface IDatabaseStructure {
    [guildID: string]: {
        giveaways: IGiveaway[];
    };
}
