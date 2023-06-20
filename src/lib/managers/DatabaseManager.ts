import { Giveaways } from '../../Giveaways'
import { DatabaseType } from '../../types/databaseType.enum'

export class DatabaseManager<TDatabase extends DatabaseType> {
    public giveaways: Giveaways<TDatabase>

    constructor(giveaways: Giveaways<TDatabase>) {
        this.giveaways = giveaways // TODO: database saving & database methods
    }
}
