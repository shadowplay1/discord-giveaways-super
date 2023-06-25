import { User } from 'discord.js'

import { Giveaways } from '../Giveaways'
import { Giveaway } from '../lib/Giveaway'
import { DatabaseType } from './databaseType.enum'

export type IGiveawaysEvents<TDatabase extends DatabaseType> = {
    ready: Giveaways<TDatabase>
    databaseConnect: void
    giveawayReroll: IGiveawayRerollEvent<TDatabase>
} & Record<'giveawayStart' | 'giveawayRestart' | 'giveawayEnd', Giveaway<TDatabase>>

export interface IGiveawayRerollEvent<TDatabase extends DatabaseType> {
    giveaway: Giveaway<TDatabase>
    newWinner: User
}
