import { Database } from '../../types/configurations'
import { DatabaseType } from '../../types/databaseType.enum'

export class DatabaseManager<TDatabase extends DatabaseType> {
    public db: Database<TDatabase>

    constructor(database: Database<TDatabase>) {
        this.db = database // TODO: database saving & database methods
    }
}
