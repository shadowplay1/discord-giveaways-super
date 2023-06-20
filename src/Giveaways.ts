import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { Client } from 'discord.js'

import { DatabaseConnectionOptions, IGiveawaysConfiguration } from './types/configurations'
import { DatabaseType } from './types/databaseType.enum'
import { Logger } from './lib/util/Logger'
import { checkUpdates } from './lib/util/checkUpdates.function'

import { version as packageVersion } from '../package.json'
import Emitter from 'discord-economy-super/typings/classes/util/Emitter'
import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from './lib/util/GiveawaysError'


/**
 * Main Giveaways class.
 *
 */
export class Giveaways extends Emitter {
    public client: Client<true>
    public options: IGiveawaysConfiguration
    public ready: boolean
    public version: string

    public _logger: Logger

    /**
     * Main Giveaways constructor.
     * @param {Client} client Discord client.
     * @param {IGiveawaysConfiguration} options Module configuration.
     */
    public constructor(client: Client, options: IGiveawaysConfiguration) {
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
         * Module options.
         * @type {IGiveawaysConfiguration}
         */
        this.options = options

        /**
         * Module logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options.debug)

        this._logger.debug('Giveaways version: ' + this.version, 'lightcyan')
        this._logger.debug('Database type is JSON.', 'lightcyan')
        this._logger.debug('Debug mode is enabled.', 'lightcyan')

        this.ready = false
        this._init()
    }

    /**
     * Initialize the database connection and initialize the module.
     * @returns {Promise<void>}
     * @private
     */
    private async _init(): Promise<void> {
        this._logger.debug('Economy starting process launched.')
        this._logger.debug('Checking the configuration...') // TODO


        switch (this.options.database) {
            case DatabaseType.JSON: {
                this._logger.debug('Checking the database...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.JSON>
                const isFileExists = existsSync(databaseOptions.path)

                if (!isFileExists) {
                    await writeFile(databaseOptions.path, '{}')
                }

                if (databaseOptions.checkDatabase) {
                    try {
                        setInterval(async () => {
                            const isFileExists = existsSync(databaseOptions.path)

                            if (!isFileExists) {
                                await writeFile(databaseOptions.path, '{}')
                            }

                            const databaseFile = await readFile(databaseOptions.path, 'utf-8')

                            JSON.parse(databaseFile)
                        }, databaseOptions.checkCountdown)
                    } catch (err: any) {
                        if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) {
                            throw new GiveawaysError(errorMessages.DATABASE_ERROR(DatabaseType.JSON, 'malformed'))
                        }

                        if (err.message.includes('no such file')) {
                            throw new GiveawaysError(errorMessages.DATABASE_ERROR(DatabaseType.JSON, 'notFound'))
                        }

                        throw new GiveawaysError(errorMessages.DATABASE_ERROR(DatabaseType.JSON))
                    }
                }

                break
            }

            default: {
                throw new GiveawaysError(GiveawaysErrorCodes.UNKNOWN_DATABASE)
            }
        }

        await this._sendUpdateMessage()

        this.emit('ready')
        this.ready = true
    }

    private async _sendUpdateMessage(): Promise<void> {

        /* eslint-disable max-len */
        if (this.options.updatesChecker?.checkUpdates) {
            const result = await checkUpdates()

            if (!result.updated) {
                console.log('\n\n')
                console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════╗')
                console.log(this._logger.colors.green + '║ @ discord-economy-super                                  - [] X ║')
                console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════║')
                console.log(this._logger.colors.yellow + `║                     The module is ${this._logger.colors.red}out of date!${this._logger.colors.yellow}                  ║`)
                console.log(this._logger.colors.magenta + '║                      New version is available!                  ║')
                console.log(this._logger.colors.blue + `║                           ${result.installedVersion} --> ${result.availableVersion}                       ║`)
                console.log(this._logger.colors.cyan + '║              Run "npm i discord-economy-super@latest"           ║')
                console.log(this._logger.colors.cyan + '║                             to update!                          ║')
                console.log(this._logger.colors.white + '║                   View the full changelog here:                 ║')
                console.log(this._logger.colors.red + `║   https://des-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog   ║`)
                console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════╝\x1b[37m')
                console.log('\n\n')
            } else {
                if (this.options.updatesChecker?.upToDateMessage) {
                    console.log('\n\n')
                    console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════╗')
                    console.log(this._logger.colors.green + '║ @ discord-economy-super                                  - [] X ║')
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
}
