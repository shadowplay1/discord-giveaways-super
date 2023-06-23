import { Giveaways } from '../Giveaways'
import { DatabaseType } from './databaseType.enum'

export interface IGiveawaysEvents<TDatabase extends DatabaseType> {
    ready: Giveaways<TDatabase>
    databaseConnected: void
}
