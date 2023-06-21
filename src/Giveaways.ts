import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import QuickMongo from 'quick-mongo-super'
import Enmap from 'enmap'

import { Client, GatewayIntentBits, IntentsBitField } from 'discord.js'

import { Database, DatabaseConnectionOptions, IGiveawaysConfiguration } from './types/configurations'
import { IGiveawaysEvents } from './types/events.interface'

import { DatabaseType } from './types/databaseType.enum'
import { checkUpdates } from './lib/util/functions/checkUpdates.function'

import { version as packageVersion } from '../package.json'

import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from './lib/util/classes/GiveawaysError'
import { Logger } from './lib/util/classes/Logger'
import { Emitter } from './lib/util/classes/Emitter'
import { DatabaseManager } from './lib/managers/DatabaseManager'
import { checkConfiguration } from './lib/util/functions/checkConfiguration.util'


/**
 * Main Giveaways class.
 */
export class Giveaways<TDatabase extends DatabaseType> extends Emitter<IGiveawaysEvents<TDatabase>> {

    /**
     * Discord Client.
     * @type {Client}
     */
    public client: Client<boolean>

    /**
     * Module ready state.
     * @type {boolean}
     */
    public ready: boolean

    /**
     * Module version.
     * @type {string}
     */
    public version: string

    /**
     * Module options.
     * @type {IGiveawaysConfiguration<DatabaseType>}
     */
    public options: IGiveawaysConfiguration<TDatabase>

    /**
     * External database instanca (such as Enmap or MongoDB) if used.
     * @type {?Database<DatabaseType>}
     */
    public db: Database<TDatabase>

    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    public database: DatabaseManager<TDatabase>

    /**
     * Module logger.
     * @type {Logger}
     * @private
     */
    private _logger: Logger

    /**
     * Main Giveaways constructor.
     * @param {Client} client Discord client.
     * @param {IGiveawaysConfiguration} options Module configuration.
     */
    public constructor(client: Client<boolean>, options: IGiveawaysConfiguration<TDatabase> = {} as any) {
        super()

        /**
         * Discord Client.
         * @type {Client}
         */
        this.client = client

        /**
         * Module ready state.
         * @type {boolean}
         */
        this.ready = true

        /**
         * Module version.
         * @type {string}
         */
        this.version = packageVersion

        /**
         * Module logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options.debug as boolean)

        this._logger.debug('Giveaways version: ' + this.version, 'lightcyan')
        this._logger.debug('Database type is JSON.', 'lightcyan')
        this._logger.debug('Debug mode is enabled.', 'lightcyan')

        this._logger.debug('Checking the configuration...')

        /**
         * Module options.
         * @type {IGiveawaysConfiguration<DatabaseType>}
         */
        this.options = checkConfiguration(options, options.configurationChecker)

        /**
         * External database (such as Enmap or MongoDB) if used.
         * @type {?Database<DatabaseType>}
         */
        this.db = null as any

        /**
         * Database Manager.
         * @type {DatabaseManager}
         */
        this.database = null as any

        this.ready = false
        this._init()
    }

    /**
     * Initialize the database connection and initialize the module.
     * @returns {Promise<void>}
     * @private
     */
    private async _init(): Promise<void> {
        this._logger.debug('Economy starting process launched.', 'lightgreen')

        if (!this.client) {
            throw new GiveawaysError(GiveawaysErrorCodes.NO_DISCORD_CLIENT)
        }

        if (!this.options.database) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_CONFIG_OPTION_MISSING('database'),
                GiveawaysErrorCodes.REQUIRED_CONFIG_OPTION_MISSING
            )
        }

        if (!this.options.connection) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_CONFIG_OPTION_MISSING('connection'),
                GiveawaysErrorCodes.REQUIRED_CONFIG_OPTION_MISSING
            )
        }

        if (!Object.keys(DatabaseType).includes(this.options.database)) {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE(
                    'database',
                    'value from DatabaseType enum: either "JSON", "MONGODB" or "Enmap".',
                    typeof this.options.database
                ),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof this.options.connection !== 'object') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('connection', 'object', typeof this.options.connection),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const requiredIntents: GatewayIntentBits[] = [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions
        ]

        const clientIntents = new IntentsBitField(this.client.options.intents)

        for (const requiredIntent of requiredIntents) {
            if (!clientIntents.has(requiredIntent)) {
                throw new GiveawaysError(
                    errorMessages.INTENT_MISSING(GatewayIntentBits[requiredIntent]),
                    GiveawaysErrorCodes.INTENT_MISSING
                )
            }
        }

        switch (this.options.database) {
            case DatabaseType.JSON: {
                this._logger.debug('Checking the database file...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.JSON>
                const isFileExists = existsSync(databaseOptions?.path as string)

                if (!isFileExists) {
                    await writeFile(databaseOptions?.path as string, '{}')
                }

                if (databaseOptions.checkDatabase) {
                    try {
                        setInterval(async () => {
                            const isFileExists = existsSync(databaseOptions?.path as string)

                            if (!isFileExists) {
                                await writeFile(databaseOptions?.path as string, '{}')
                            }

                            const databaseFile = await readFile(databaseOptions?.path as string, 'utf-8')
                            JSON.parse(databaseFile)
                        }, databaseOptions.checkCountdown)
                    } catch (err: any) {
                        if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) {
                            throw new GiveawaysError(
                                errorMessages.DATABASE_ERROR(DatabaseType.JSON, 'malformed'),
                                GiveawaysErrorCodes.DATABASE_ERROR
                            )
                        }

                        if (err.message.includes('no such file')) {
                            throw new GiveawaysError(
                                errorMessages.DATABASE_ERROR(DatabaseType.JSON, 'notFound'),
                                GiveawaysErrorCodes.DATABASE_ERROR
                            )
                        }

                        throw new GiveawaysError(
                            errorMessages.DATABASE_ERROR(DatabaseType.JSON),
                            GiveawaysErrorCodes.DATABASE_ERROR
                        )
                    }
                }

                break
            }

            case DatabaseType.MONGODB: {
                this._logger.debug('Connecting to MongoDB...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.MONGODB>

                const mongo = new QuickMongo(databaseOptions)
                const connectionStartDate = Date.now()

                await mongo.connect()

                this.db = mongo as Database<TDatabase>
                this._logger.debug(`MongoDB connection established in ${Date.now() - connectionStartDate}`, 'lightgreen')

                break
            }

            case DatabaseType.ENMAP: {
                this._logger.debug('Initializing Enmap...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.ENMAP>
                this.db = new Enmap(databaseOptions) as Database<TDatabase>

                break
            }

            default: {
                throw new GiveawaysError(GiveawaysErrorCodes.UNKNOWN_DATABASE)
            }
        }

        this.database = new DatabaseManager(this)
        await this._sendUpdateMessage()

        this.emit('ready')
        this._logger.debug('Giveaways module is ready!', 'lightgreen')

        this.ready = true
    }

    /**
     * Sends the module update state in the console.
     * @returns {Promise<void>}
     * @private
     */
    private async _sendUpdateMessage(): Promise<void> {

        /* eslint-disable max-len */
        if (this.options.updatesChecker?.checkUpdates) {
            const result = await checkUpdates()

            if (!result.updated) {
                console.log('\n\n')
                console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════════╗')
                console.log(this._logger.colors.green + '║ @ discord-giveaways-super                                    - [] X ║')
                console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════════║')
                console.log(this._logger.colors.yellow + `║                       The module is ${this._logger.colors.red}out of date!${this._logger.colors.yellow}                    ║`)
                console.log(this._logger.colors.magenta + '║                       New version is available!                   ║')
                console.log(this._logger.colors.blue + `║                              ${result.installedVersion} --> ${result.availableVersion}                        ║`)
                console.log(this._logger.colors.cyan + '║             Run "npm i discord-giveaways-super@latest"          ║')
                console.log(this._logger.colors.cyan + '║                               to update!                            ║')
                console.log(this._logger.colors.white + '║                     View the full changelog here:                   ║')
                console.log(this._logger.colors.red + `║     https://des-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog     ║`)
                console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════════╝\x1b[37m')
                console.log('\n\n')
            } else {
                if (this.options.updatesChecker?.upToDateMessage) {
                    console.log('\n\n')
                    console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════╗')
                    console.log(this._logger.colors.green + '║ @ discord-giveaways-super                                - [] X ║')
                    console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════║')
                    console.log(this._logger.colors.yellow + `║                      The module is ${this._logger.colors.cyan}up to date!${this._logger.colors.yellow}                  ║`)
                    console.log(this._logger.colors.magenta + '║                      No updates are available.                  ║')
                    console.log(this._logger.colors.blue + `║                      Current version is ${result.availableVersion}.                  ║`)
                    console.log(this._logger.colors.cyan + '║                               Enjoy!                            ║')
                    console.log(this._logger.colors.white + '║                   View the full changelog here:                 ║')
                    console.log(this._logger.colors.red + `║   https://des-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog   ║`)
                    console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════╝\x1b[37m')
                    console.log('\n\n')
                }
            }
        }
    }


    public async start(): Promise<any> {
        //
    }

    public async restart(): Promise<any> {
        //
    }

    public async end(): Promise<any> {
        //
    }

    public async forceEnd(): Promise<any> {
        //
    }

    public async reroll(): Promise<any> {
        //
    }
}
