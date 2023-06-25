import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { ms } from './lib/misc/ms'

import QuickMongo from 'quick-mongo-super'
import Enmap from 'enmap'

import {
    Client, GatewayIntentBits,
    IntentsBitField, TextChannel, User
} from 'discord.js'

import {
    Database, DatabaseConnectionOptions,
    IEmbedStringsDefinitions, IGiveawayButtonOptions,
    IGiveawayStartOptions, IGiveawaysConfiguration
} from './types/configurations'

import { IGiveawaysEvents } from './types/giveawaysEvents.interface'

import { DatabaseType } from './types/databaseType.enum'
import { checkUpdates } from './lib/util/functions/checkUpdates.function'

import { version as packageVersion } from '../package.json'

import { GiveawaysError, GiveawaysErrorCodes, errorMessages } from './lib/util/classes/GiveawaysError'

import { Logger } from './lib/util/classes/Logger'
import { Emitter } from './lib/util/classes/Emitter'

import { DatabaseManager } from './lib/managers/DatabaseManager'

import { checkConfiguration } from './lib/util/functions/checkConfiguration.function'
import { FindCallback, Optional } from './types/misc/utils'

import { Giveaway } from './lib/Giveaway'
import { GiveawayState, IGiveaway } from './lib/giveaway.interface'

import { giveawayTemplate } from './structures/giveawayTemplate'
import { MessageUtils } from './lib/util/classes/MessageUtils'

/**
 * Main Giveaways class.
 */
export class Giveaways<TDatabase extends DatabaseType> extends Emitter<IGiveawaysEvents<TDatabase>> {

    /**
     * Discord Client.
     * @type {Client}
     */
    public readonly client: Client<boolean>

    /**
     * Giveaways ready state.
     * @type {boolean}
     */
    public ready: boolean

    /**
     * Giveaways version.
     * @type {string}
     */
    public readonly version: string

    /**
     * Giveaways options.
     * @type {IGiveawaysConfiguration<DatabaseType>}
     */
    public readonly options: IGiveawaysConfiguration<TDatabase>

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
    private readonly _logger: Logger

    private readonly _messageUtils: MessageUtils

    /**
     * Giveaways ending state checking interval.
     * @type {NodeJS.Timeout}
     */
    public giveawaysCheckingInterval: NodeJS.Timeout

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
        this.ready = false

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

        /**
         * Giveaways ending state checking interval.
         * @type {NodeJS.Timeout}
         */
        this.giveawaysCheckingInterval = null as any

        /**
         * Message utils.
         * @type {MessageUtils}
         * @private
         */
        this._messageUtils = new MessageUtils(client)

        this._init()
    }

    /**
     * Initialize the database connection and initialize the module.
     * @returns {Promise<void>}
     * @private
     */
    private async _init(): Promise<void> {
        this._logger.debug('Giveaways starting process launched.', 'lightgreen')

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

        const isDatabaseCorrect = Object.keys(DatabaseType)
            .map(databaseType => databaseType.toLowerCase())
            .includes(this.options.database.toLowerCase())

        if (!isDatabaseCorrect) {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE(
                    '"database"',
                    'value from "DatabaseType" enum: either "JSON", "MONGODB" or "Enmap"',
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

                const databaseOptions = this.options.connection as Required<DatabaseConnectionOptions<DatabaseType.JSON>>
                const isFileExists = existsSync(databaseOptions.path as string)

                if (!isFileExists) {
                    await writeFile(databaseOptions.path as string, '{}')
                }

                if (databaseOptions.checkDatabase) {
                    try {
                        setInterval(async () => {
                            const isFileExists = existsSync(databaseOptions.path as string)

                            if (!isFileExists) {
                                await writeFile(databaseOptions.path as string, '{}')
                            }

                            const databaseFile = await readFile(databaseOptions.path as string, 'utf-8')
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

                this.emit('databaseConnected')
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

                this.emit('databaseConnected')
                break
            }

            case DatabaseType.ENMAP: {
                this._logger.debug('Initializing Enmap...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.ENMAP>
                this.db = new Enmap(databaseOptions) as Database<TDatabase>

                this.emit('databaseConnected')
                break
            }

            default: {
                throw new GiveawaysError(GiveawaysErrorCodes.UNKNOWN_DATABASE)
            }
        }

        this.database = new DatabaseManager(this)
        await this._sendUpdateMessage()

        this._logger.debug('Waiting for client to be ready...')

        const clientReadyInterval = setInterval(() => {
            if (this.client.isReady()) {
                clearInterval(clientReadyInterval)

                const giveawatCheckingInterval = setInterval(() => {
                    this._checkGiveaways()
                }, this.options.giveawaysCheckingInterval)

                this.giveawaysCheckingInterval = giveawatCheckingInterval

                this.ready = true
                this.emit('ready', this)

                this._logger.debug('Giveaways module is ready!', 'lightgreen')
            }
        }, 100)

        this.client.on('interactionCreate', async interaction => {
            if (interaction.isButton()) {
                if (interaction.customId == 'joinGiveawayButton') {
                    const interactionMessage = interaction.message

                    const guildGiveaways = await this.getGuildGiveaways(interactionMessage.guild?.id as string)
                    const giveaway = guildGiveaways.find(giveaway => giveaway.messageID == interactionMessage.id)

                    console.log({ giveaway: giveaway?.messageProps })


                    if (giveaway) {
                        const userEntry = giveaway.raw.entriesArray.find(entryUser => entryUser == interaction.user.id)

                        if (!userEntry) {
                            const newGiveaway = await giveaway.addEntry(
                                interaction.guild?.id as string,
                                interaction.user.id
                            )

                            interaction.reply({
                                content: ':white_check_mark: | You have entered the giveaway!',
                                ephemeral: true
                            })

                            this._messageUtils.editEntryGiveawayMessage(newGiveaway)
                        } else {
                            const newGiveaway = await giveaway.removeEntry(
                                interaction.guild?.id as string,
                                interaction.user.id
                            )

                            interaction.reply({
                                content: ':x: | You have left the giveaway!',
                                ephemeral: true
                            })

                            this._messageUtils.editEntryGiveawayMessage(newGiveaway)
                        }
                    }
                }
            }
        })
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


    /**
     * Starts the giveaway.
     * @param giveawayOptions Giveaway options.
     * @returns {Promise<Giveaway<DatabaseType>>} Created giveaway instance.
     */
    public async start(
        giveawayOptions: Optional<
            Omit<
                IGiveaway,
                'id' | 'startTimestamp' | 'endTimestamp' |
                'messageID' | 'messageURL' | 'entries' |
                'entriesArray' | 'state' | 'messageProps' |
                'isEnded'
            >,
            'time' | 'winnersCount'
        > &
            Partial<IGiveawayStartOptions>
    ): Promise<Giveaway<TDatabase>> {
        const {
            channelID, guildID, hostMemberID,
            prize, time, winnersCount,
            defineEmbedStrings, buttons
        } = giveawayOptions

        const joinGiveawayButton = buttons?.joinGiveawayButton as IGiveawayButtonOptions
        const rerollButton = buttons?.rerollButton as IGiveawayButtonOptions
        const goToMessageButton = buttons?.goToMessageButton as IGiveawayButtonOptions

        const guildGiveaways = await this.getGuildGiveaways(guildID)

        const newGiveaway: IGiveaway = {
            id: ((guildGiveaways.at(-1)?.id || 0) as number) + 1,
            hostMemberID,
            guildID,
            channelID,
            messageID: '',
            prize,
            startTimestamp: Math.floor(Date.now() / 1000),
            endTimestamp: Math.floor((Date.now() + ms(time as string)) / 1000),
            time: time || '1d',
            state: GiveawayState.STARTED,
            winnersCount: winnersCount || 1,
            entries: 0,
            entriesArray: [],
            isEnded: false
        }

        const {
            started: startedEmbedStrings,
            finished,
            rerolled,
            finishedWithoutWinners: finishedWithoutWinnersEmbedStrings
        } = defineEmbedStrings ? defineEmbedStrings(
            giveawayTemplate as any,
            this.client.users.cache.get(hostMemberID) as User
        ) as Required<IEmbedStringsDefinitions> : {} as Required<IEmbedStringsDefinitions>

        const channel = this.client.channels.cache.get(channelID) as TextChannel

        const embed = this._messageUtils.buildGiveawayEmbed(newGiveaway, startedEmbedStrings)
        const buttonsRow = this._messageUtils.buildButtonsRow(joinGiveawayButton)

        const [finishedEmbedStrings, rerolledEmbedStrings] = [
            finished('{winnersString}', '{numberOfWinners}' as any),
            rerolled('{winnersString}', '{numberOfWinners}' as any)
        ]

        const message = await channel.send({
            content: startedEmbedStrings?.messageContent,
            embeds: [embed],
            components: [buttonsRow]
        })

        newGiveaway.messageID = message.id
        newGiveaway.messageURL = message.url

        newGiveaway.endTimestamp = Math.floor((Date.now() + ms(newGiveaway.time)) / 1000)

        newGiveaway.messageProps = {
            embeds: {
                started: startedEmbedStrings,
                finished: finishedEmbedStrings,
                rerolled: rerolledEmbedStrings,
                finishedWithoutWinners: finishedWithoutWinnersEmbedStrings
            } as any,
            buttons: {
                joinGiveawayButton,
                rerollButton,
                goToMessageButton
            } as any
        }

        this.database.push(`${guildID}.giveaways`, newGiveaway)

        const startedGiveaway = new Giveaway(this, newGiveaway)
        this.emit('giveawayStarted', startedGiveaway)

        return startedGiveaway
    }

    public async find(cb: FindCallback<Giveaway<TDatabase>>): Promise<Giveaway<TDatabase>> {
        const giveaways = await this.getAll()
        const giveaway = giveaways.find(cb)

        return giveaway as Giveaway<TDatabase>
    }

    public async getGuildGiveaways(guildID: string): Promise<Giveaway<TDatabase>[]> {
        const giveaways = await this.database.get<IGiveaway[]>(`${guildID}.giveaways`) || []
        return giveaways.map(giveaway => new Giveaway(this, giveaway))
    }

    public async getAll(): Promise<Giveaway<TDatabase>[]> {
        const giveaways: IGiveaway[] = []
        const guildIDs = await this.database.getKeys()

        for (const guildID of guildIDs.filter(guildID => !isNaN(parseInt(guildID)))) {
            const databaseGiveaways = await this.database.get<IGiveaway[]>(`${guildID}.giveaways`) || []

            for (const databaseGiveaway of databaseGiveaways) {
                giveaways.push(databaseGiveaway)
            }
        }

        return giveaways.map(giveaway => new Giveaway(this, giveaway))
    }

    private async _checkGiveaways(): Promise<void> {
        const giveaways = await this.getAll()

        for (const giveaway of giveaways) {
            if (giveaway.isFinished && !giveaway.isEnded) {
                await giveaway.end()
            }
        }
    }
}
