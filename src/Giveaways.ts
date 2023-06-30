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
    IGiveawayStartConfig,
    IGiveawaysConfiguration
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
import { FindCallback } from './types/misc/utils'

import { Giveaway } from './lib/Giveaway'
import { GiveawayState, IGiveaway } from './lib/giveaway.interface'

import { giveawayTemplate } from './structures/giveawayTemplate'
import { MessageUtils } from './lib/util/classes/MessageUtils'

/**
 * Main Giveaways class.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @extends {Emitter<IGiveawaysEvents<TDatabaseType>>}
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */
export class Giveaways<TDatabaseType extends DatabaseType> extends Emitter<IGiveawaysEvents<TDatabaseType>> {

    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    public readonly client: Client<boolean>

    /**
     * {@link Giveaways} ready state.
     * @type {boolean}
     */
    public ready: boolean

    /**
     * {@link Giveaways} version.
     * @type {string}
     */
    public readonly version: string

    /**
     * Completed, filled and fixed {@link Giveaways} configuration.
     * @type {Required<IGiveawaysConfiguration<DatabaseType>>}
     */
    public readonly options: Required<IGiveawaysConfiguration<TDatabaseType>>

    /**
     * External database instanca (such as Enmap or MongoDB) if used.
     * @type {?Database<DatabaseType>}
     */
    public db: Database<TDatabaseType>

    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    public database: DatabaseManager<TDatabaseType>

    /**
     * Giveaways logger.
     * @type {Logger}
     * @private
     */
    private readonly _logger: Logger

    /**
     * Message generation utility methods.
     * @type {MessageUtils}
     * @private
     */
    private readonly _messageUtils: MessageUtils

    /**
     * Giveaways ending state checking interval.
     * @type {NodeJS.Timeout}
     */
    public giveawaysCheckingInterval: NodeJS.Timeout

    /**
     * Main {@link Giveaways} constructor.
     * @param {Client} client Discord Client.
     * @param {IGiveawaysConfiguration<TDatabaseType>} options {@link Giveaways} configuration.
     */
    public constructor(client: Client<boolean>, options: IGiveawaysConfiguration<TDatabaseType> = {} as any) {
        super()

        /**
         * Discord Client.
         * @type {Client}
         */
        this.client = client

        /**
         * {@link Giveaways} ready state.
         * @type {boolean}
         */
        this.ready = false

        /**
         * {@link Giveaways} version.
         * @type {string}
         */
        this.version = packageVersion

        /**
         * {@link Giveaways} logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options.debug as boolean)

        this._logger.debug('Giveaways version: ' + this.version, 'lightcyan')
        this._logger.debug('Database type is JSON.', 'lightcyan')
        this._logger.debug('Debug mode is enabled.', 'lightcyan')

        this._logger.debug('Checking the configuration...')

        /**
         * Completed, filled and fixed {@link Giveaways} configuration.
         * @type {Required<IGiveawaysConfiguration<DatabaseType>>}
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
         * {@link Giveaways} ending state checking interval.
         * @type {NodeJS.Timeout}
         */
        this.giveawaysCheckingInterval = null as any

        /**
         * Message utils instance.
         * @type {MessageUtils}
         * @private
         */
        this._messageUtils = new MessageUtils(this)

        this._init()
    }

    /**
     * Initialize the database connection and initialize the {@link Giveaways} module.
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
                        }, databaseOptions.checkingCountdown)
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

                this.emit('databaseConnect')
                break
            }

            case DatabaseType.MONGODB: {
                this._logger.debug('Connecting to MongoDB...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.MONGODB>

                const mongo = new QuickMongo(databaseOptions)
                const connectionStartDate = Date.now()

                await mongo.connect()

                this.db = mongo as Database<TDatabaseType>
                this._logger.debug(`MongoDB connection established in ${Date.now() - connectionStartDate}`, 'lightgreen')

                this.emit('databaseConnect')
                break
            }

            case DatabaseType.ENMAP: {
                this._logger.debug('Initializing Enmap...')

                const databaseOptions = this.options.connection as DatabaseConnectionOptions<DatabaseType.ENMAP>
                this.db = new Enmap(databaseOptions) as Database<TDatabaseType>

                this.emit('databaseConnect')
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
                const interactionMessage = interaction.message

                if (interaction.customId == 'joinGiveawayButton') {
                    const guildGiveaways = await this.getGuildGiveaways(interactionMessage.guild?.id as string)
                    const giveaway = guildGiveaways.find(giveaway => giveaway.messageID == interactionMessage.id)

                    if (giveaway) {
                        const userEntry = giveaway.raw.entriesArray.find(entryUser => entryUser == interaction.user.id)

                        if (!userEntry) {
                            const giveawayJoinMessage = giveaway.messageProps?.embeds?.joinGiveawayMessage || {}

                            const giveawayLeaveEmbed =
                                this._messageUtils.buildGiveawayEmbed(giveaway.raw, giveawayJoinMessage)

                            const newGiveaway = await giveaway.addEntry(
                                interaction.guild?.id as string,
                                interaction.user.id
                            )

                            if (!Object.keys(giveawayJoinMessage).length) {
                                giveawayJoinMessage.messageContent = 'You have joined the giveaway!'
                            }

                            interaction.reply({
                                content: giveawayJoinMessage?.messageContent,
                                embeds: Object.keys(giveawayJoinMessage as any).length == 1 &&
                                    giveawayJoinMessage?.messageContent
                                    ? [] : [giveawayLeaveEmbed],
                                ephemeral: true
                            }).catch((err: Error) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow

                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError(
                                        'Cannot join the giveaway: ' + err,
                                        GiveawaysErrorCodes.UNKNOWN_ERROR
                                    )
                                }
                            })

                            this._messageUtils.editEntryGiveawayMessage(newGiveaway)
                        } else {
                            const giveawayLeaveMessage = giveaway.messageProps?.embeds?.leaveGiveawayMessage || {}

                            const giveawayLeaveEmbed =
                                this._messageUtils.buildGiveawayEmbed(giveaway.raw, giveawayLeaveMessage)

                            const newGiveaway = await giveaway.removeEntry(
                                interaction.guild?.id as string,
                                interaction.user.id
                            )

                            if (!Object.keys(giveawayLeaveMessage).length) {
                                giveawayLeaveMessage.messageContent = 'You have left the giveaway!'
                            }

                            interaction.reply({
                                content: giveawayLeaveMessage?.messageContent,
                                embeds: Object.keys(giveawayLeaveMessage as any).length == 1 &&
                                    giveawayLeaveMessage?.messageContent
                                    ? [] : [giveawayLeaveEmbed],
                                ephemeral: true
                            }).catch((err: Error) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow

                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError(
                                        'Cannot leave the giveaway: ' + err,
                                        GiveawaysErrorCodes.UNKNOWN_ERROR
                                    )
                                }
                            })

                            this._messageUtils.editEntryGiveawayMessage(newGiveaway)
                        }
                    } else {
                        throw new GiveawaysError(
                            'Cannot join the giveaway: ' + errorMessages.UNKNOWN_GIVEAWAY(interactionMessage.id),
                            GiveawaysErrorCodes.UNKNOWN_GIVEAWAY
                        )
                    }
                }

                if (interaction.customId == 'rerollButton') {
                    const guildGiveaways = await this.getGuildGiveaways(interactionMessage.guild?.id as string)
                    const giveaway = guildGiveaways.find(giveaway => giveaway.messageID == interactionMessage.id)

                    const rerollEmbedStrings = giveaway?.messageProps?.embeds?.reroll

                    if (giveaway) {
                        if (interaction.user.id !== giveaway?.host.id) {
                            const onlyHostCanReroll = rerollEmbedStrings?.onlyHostCanReroll
                            const rerollErroredMessageContent = onlyHostCanReroll?.messageContent as any

                            const errorEmbed = this._messageUtils.buildGiveawayEmbed(
                                giveaway.raw,
                                rerollErroredMessageContent
                            )

                            interaction.reply({
                                content: rerollErroredMessageContent,
                                embeds: Object.keys(
                                    onlyHostCanReroll as any
                                ).length == 1 && rerollErroredMessageContent ? [] : [errorEmbed],
                                ephemeral: true
                            }).catch((err: Error) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow

                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError(
                                        'Cannot reply to the button: ' + err,
                                        GiveawaysErrorCodes.UNKNOWN_ERROR
                                    )
                                }
                            })
                        } else {
                            const rerollSuccess = rerollEmbedStrings?.successMessage
                            const rerollSuccessfulMessageCreate = rerollSuccess?.messageContent

                            await giveaway?.reroll()

                            const successEmbed = this._messageUtils.buildGiveawayEmbed(
                                giveaway.raw,
                                rerollSuccess as any
                            )

                            interaction.reply({
                                content: rerollSuccessfulMessageCreate,
                                embeds: Object.keys(
                                    rerollSuccess as any
                                ).length == 1 && rerollSuccessfulMessageCreate ? [] : [successEmbed],
                                ephemeral: true
                            }).catch((err: Error) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow

                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError(
                                        'Cannot reroll the winners: ' + err,
                                        GiveawaysErrorCodes.UNKNOWN_ERROR
                                    )
                                }
                            })
                        }
                    } else {
                        throw new GiveawaysError(
                            'Cannot reroll the winners: ' + errorMessages.UNKNOWN_GIVEAWAY(interactionMessage.id),
                            GiveawaysErrorCodes.UNKNOWN_GIVEAWAY
                        )
                    }
                }
            }
        })
    }

    /**
     * Sends the {@link Giveaways} module update state in the console.
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
     * @param {IGiveawayStartConfig} giveawayOptions {@link Giveaway} options.
     * @returns {Promise<Giveaway<DatabaseType>>} Created {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified.
     */
    public async start(
        giveawayOptions: IGiveawayStartConfig
    ): Promise<Giveaway<TDatabaseType>> {
        const {
            channelID, guildID, hostMemberID,
            prize, time, winnersCount,
            defineEmbedStrings, buttons
        } = giveawayOptions

        if (!channelID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('channelID', 'Giveaways.start'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (!guildID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaways.start'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (!hostMemberID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('hostMemberID', 'Giveaways.start'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (!prize) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('prize', 'Giveaways.start'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }


        if (typeof channelID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.channelID', 'string', channelID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof guildID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.guildID', 'string', guildID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof hostMemberID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.hostMemberID', 'string', hostMemberID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof prize !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.prize', 'string', prize),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof time !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.time', 'string', time as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (isNaN(winnersCount as number)) {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.winnersCount', 'number', winnersCount as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (buttons && typeof buttons !== 'object') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.buttons', 'object', buttons as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        if (typeof defineEmbedStrings !== 'function') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('giveawayOptions.defineEmbedStrings', 'function', defineEmbedStrings as any),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        try {
            ms(time)
        } catch {
            throw new GiveawaysError(GiveawaysErrorCodes.INVALID_TIME)
        }

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

        const definedEmbedStrings = defineEmbedStrings ? defineEmbedStrings(
            giveawayTemplate as any,
            this.client.users.cache.get(hostMemberID) as User
        ) as Required<IEmbedStringsDefinitions> : {} as Required<IEmbedStringsDefinitions>

        const startEmbedStrings = definedEmbedStrings?.start

        const finish = definedEmbedStrings?.finish
        const reroll = definedEmbedStrings?.reroll

        const finishWithoutWinnersEmbedStrings = definedEmbedStrings?.start

        const channel = this.client.channels.cache.get(channelID) as TextChannel

        const giveawayEmbed = this._messageUtils.buildGiveawayEmbed(newGiveaway, startEmbedStrings)
        const buttonsRow = this._messageUtils.buildButtonsRow(joinGiveawayButton)

        const [finishEmbedStrings, rerollEmbedStrings] = [
            finish('{winnersString}', '{numberOfWinners}' as any),
            reroll('{winnersString}', '{numberOfWinners}' as any)
        ]

        const message = await channel.send({
            content: startEmbedStrings?.messageContent,
            embeds: Object.keys(startEmbedStrings).length == 1 && startEmbedStrings?.messageContent ? [] : [giveawayEmbed],
            components: [buttonsRow]
        })

        newGiveaway.messageID = message.id
        newGiveaway.messageURL = message.url

        newGiveaway.endTimestamp = Math.floor((Date.now() + ms(newGiveaway.time)) / 1000)

        newGiveaway.messageProps = {
            embeds: {
                start: startEmbedStrings,
                joinGiveawayMessage: definedEmbedStrings?.joinGiveawayMessage,
                leaveGiveawayMessage: definedEmbedStrings?.leaveGiveawayMessage,
                finish: finishEmbedStrings,
                reroll: rerollEmbedStrings,
                finishWithoutWinners: finishWithoutWinnersEmbedStrings
            } as any,
            buttons: {
                joinGiveawayButton,
                rerollButton,
                goToMessageButton
            } as any
        }

        this.database.push(`${guildID}.giveaways`, newGiveaway)

        const startedGiveaway = new Giveaway(this, newGiveaway)
        this.emit('giveawayStart', startedGiveaway)

        return startedGiveaway
    }

    /**
     * Finds the giveaway in all giveaways database by the specified callback function.
     *
     * @param {FindCallback<Giveaway<TDatabaseType>>} cb
     * The callback function to find the giveaway in the giveaways database.
     *
     * @returns {Promise<Giveaway<TDatabaseType>>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    public async find(cb: FindCallback<Giveaway<TDatabaseType>>): Promise<Giveaway<TDatabaseType>> {
        if (!cb) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('cb', 'Giveaways.find'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (typeof cb !== 'function') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('cb', 'function', cb),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const giveaways = await this.getAll()
        const giveaway = giveaways.find(cb)

        return giveaway as Giveaway<TDatabaseType>
    }

    /**
     * Gets all the giveaways from the specified guild in database.
     * @param {string} guildID Guild ID to get the giveaways from.
     * @returns {Promise<Array<Giveaway<TDatabaseType>>>} Giveaways array from the specified guild in database.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    public async getGuildGiveaways(guildID: string): Promise<Array<Giveaway<TDatabaseType>>> {
        if (!guildID) {
            throw new GiveawaysError(
                errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaways.getGuildGiveaways'),
                GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING
            )
        }

        if (typeof guildID !== 'string') {
            throw new GiveawaysError(
                errorMessages.INVALID_TYPE('guildID', 'string', guildID),
                GiveawaysErrorCodes.INVALID_TYPE
            )
        }

        const giveaways = await this.database.get<IGiveaway[]>(`${guildID}.giveaways`) || []
        return giveaways.map(giveaway => new Giveaway(this, giveaway))
    }

    /**
     * Gets all the giveaways from all the guilds in database.
     * @returns {Promise<Array<Giveaway<TDatabaseType>>>} Giveaways array from all the guilds in database.
     */
    public async getAll(): Promise<Array<Giveaway<TDatabaseType>>> {
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

    /**
     * Checks for all giveaways to be finished and end them if they are.
     * @returns {Promise<void>}
     * @private
     */
    private async _checkGiveaways(): Promise<void> {
        const giveaways = await this.getAll()

        for (const giveaway of giveaways) {
            if (giveaway.isFinished && !giveaway.isEnded) {
                await giveaway.end()
            }
        }
    }
}



// For documentation purposes

/**
 * An object that contains an information about a giveaway.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveaway<TDatabaseType>
 * @prop {number} id The ID of the giveaway.
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {GiveawayState} state The state of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {number} startTimestamp The timestamp when the giveaway started.
 * @prop {boolean} isEnded Determines if the giveaway was ended in the database.
 * @prop {number} endTimestamp The timestamp when the giveaway ended.
 * @prop {string} hostMemberID The ID of the host member.
 * @prop {string} channelID The ID of the channel where the giveaway is held.
 * @prop {string} messageID The ID of the giveaway message.
 * @prop {string} messageURL The URL of the giveaway message.
 * @prop {string} guildID The ID of the guild where the giveaway is held.
 * @prop {number} entries The number of giveaway entries.
 * @prop {string[]} entriesArray The array of user IDs of users that have entered the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 *
 * @template TDatabaseType The database type that will be used in the module.
 */

/**
 * An interface containing embed objects for various giveaway reroll cases.
 * @typedef {object} IGiveawayRerollEmbeds
 * @prop {IGiveawayEmbedOptions} onlyHostCanReroll The options for the embed when only the host can reroll.
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage The options for the embed when sending a new giveaway message.
 * @prop {IGiveawayEmbedOptions} successMessage The options for the embed when the giveaway is successful.
 */

/**
 * An interface containing embed objects for various giveaway finish cases.
 * @typedef {object} IGiveawayFinishEmbeds
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage The options for the embed when sending a new giveaway message.
 * @prop {IGiveawayEmbedOptions} endMessage The options for the embed when the giveaway has ended.
 * @prop {IGiveawayEmbedOptions} noWinners The options for the embed when there are no winners for the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} noWinnersEndMessage
 * The options for the embed when there are no winners for the giveaway and it has ended.
 */

/**
 * An interface that contains the data properties for embeds and buttons.
 * @typedef {object} IGiveawayMessageProps
 * @prop {IGiveawayEmbeds} embeds The embed objects for the giveaway message.
 * @prop {IGiveawayButtons} buttons The button objects for the giveaway message.
 */

/**
 * An interface containing different types of giveaway embeds in the IGiveaways class.
 * @typedef {object} IGiveawayEmbeds
 * @prop {IGiveawayEmbedOptions} start Message embed data for cases when the giveaway has started.
 * @prop {IGiveawayRerollEmbeds} reroll Message embed data for cases when rerolling the giveaway.
 * @prop {IGiveawayFinishEmbeds} finish Message embed data for cases when the giveaway has finished.
 */

/**
 * An object that contains messages that are sent in various giveaway cases, such as end with winners or without winners.
 * @typedef {object} IGiveawayFinishMessages
 *
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage
 * The separated message to be sent in the giveaway channel when giveaway ends.
 *
 * @prop {IGiveawayEmbedOptions} endMessage
 * The separated message to be sent in the giveaway channel when a giveaway ends with winners.
 * @prop {IGiveawayEmbedOptions} noWinners
 * The message that will be set to the original giveaway message if there are no winners in the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} noWinnersEndMessage
 * The separated message to be sent in the giveaway channel if there are no winners in the giveaway.
 */

/**
 * A function that is called when giveaway is finished.
 * @callback GiveawayFinishCallback
 * @param {string} winnersString A string that contains the users that won the giveaway separated with comma.
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayFinishMessages} Giveaway message objects.
 */

/**
 * An object that contains messages that are sent in various giveaway cases, such as end with winners or without winners.
 * @typedef {object} IGiveawayRerollMessages
 *
 * @prop {IGiveawayEmbedOptions} onlyHostCanReroll
 * The message to reply to user with when not a giveaway host tries to do a reroll.
 *
 * @prop {IGiveawayEmbedOptions} newGiveawayMessage
 * The message that will be set to the original giveaway message after the reroll.
 *
 * @prop {IGiveawayEmbedOptions} successMessage
 * The separated message to be sent in the giveaway channel when the reroll is successful.
 */

/**
 * A function that is called when giveaway winners are rerolled.
 * @callback GiveawayRerollCallback
 *
 * @param {string} winnersMentionsString
 * A string that contains the mentions of users that won the giveaway, separated with comma.
 *
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayRerollMessages} Giveaway message objects.
 */

/**
 * An object that contains the giveaway buttons that may be set up.
 * @typedef {object} IGiveawayMessageButtons
 * @prop {IGiveawayButtonOptions} joinGiveawayButton The options for the join giveaway button.
 * @prop {IGiveawayButtonOptions} rerollButton The options for the reroll button.
 * @prop {IGiveawayButtonOptions} goToMessageButton The options for the go to message button.
 */

/**
 * An object that contains an information about a giveaway without internal props.
 * @typedef {object} GiveawayWithoutInternalProps
 * @prop {number} id The ID of the giveaway.
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {number} startTimestamp The timestamp when the giveaway started.
 * @prop {number} endTimestamp The timestamp when the giveaway ended.
 * @prop {string} hostMemberID The ID of the host member.
 * @prop {string} channelID The ID of the channel where the giveaway is held.
 * @prop {string} messageID The ID of the giveaway message.
 * @prop {string} messageURL The URL of the giveaway message.
 * @prop {string} guildID The ID of the guild where the giveaway is held.
 * @prop {string[]} entriesArray The array of user IDs of users that have entered the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 */

/**
 * An enum that determines the state of a giveaway.
 * @typedef {number} GiveawayState
 * @prop {number} STARTED The giveaway has started.
 * @prop {number} ENDED The giveaway has ended.
 */



/**
 * Full {@link Giveaways} class configuration object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will determine which connection configuration should be used.
 *
 * @typedef {object} IGiveawaysConfiguration<TDatabaseType>
 * @prop {DatabaseType} database Database type to use.
 * @prop {DatabaseConnectionOptions} connection Database type to use.
 *
 * @prop {?number} [giveawaysCheckingInterval=1000]
 * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {?number} [minGiveawayEntries=1] Determines the minimum required giveaway entries to draw the winner. Default: 1
 * @prop {Partial} [updatesChecker] Updates checker configuration.
 * @prop {Partial} [configurationChecker] Giveaways config checker configuration.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */

/**
 * Optional configuration for the {@link Giveaways} class.
 * @typedef {object} IGiveawaysOptionalConfiguration
 *
 * @prop {?number} [giveawaysCheckingInterval=1000]
 * Determines how often the giveaways ending state will be checked (in ms). Default: 1000.
 *
 * @prop {?boolean} [debug=false] Determines if debug mode is enabled. Default: false.
 * @prop {?number} [minGiveawayEntries=1] Determines the minimum required giveaway entries to draw the winner. Default: 1
 * @prop {Partial} [updatesChecker] Updates checker configuration.
 * @prop {Partial} [configurationChecker] Giveaways config checker configuration.
 */

/**
 * Configuration for the updates checker.
 * @typedef {object} IUpdateCheckerConfiguration
 * @prop {?boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @prop {?boolean} [upToDateMessage=false] Sends the message in console on start if module is up to date. Default: false.
 */

/**
 * Configuration for the configuration checker.
 * @typedef {object} IGiveawaysConfigCheckerConfiguration
 * @prop {?boolean} ignoreInvalidTypes Allows the method to ignore the options with invalid types. Default: false.
 * @prop {?boolean} ignoreUnspecifiedOptions Allows the method to ignore the unspecified options. Default: true.
 * @prop {?boolean} ignoreInvalidOptions Allows the method to ignore the unexisting options. Default: false.
 * @prop {?boolean} showProblems Allows the method to show all the problems in the console. Default: true.
 * @prop {?boolean} sendLog Allows the method to send the result in the console.
 * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
 * @prop {?boolean} sendSuccessLog Allows the method to send the result if no problems were found. Default: false.
 */

/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./giveaways.json'] Full path to a JSON storage file. Default: './giveaways.json'.
 * @prop {?boolean} [checkDatabase=true] Checks the if there are errors in database file. Default: true.
 * @prop {?number} [checkingCountdown=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */

/**
 * An object that contains an information about a giveaway that is required fo starting..
 * @typedef {object} IGiveawayData
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {string} hostMemberID The ID of the host member.
 * @prop {string} channelID The ID of the channel where the giveaway is held.
 * @prop {string} guildID The ID of the guild where the giveaway is held.
 */

/**
 * Giveaway start config.
 * @typedef {object} IGiveawayStartConfig
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {string} hostMemberID The ID of the host member.
 * @prop {string} channelID The ID of the channel where the giveaway is held.
 * @prop {string} guildID The ID of the guild where the giveaway is held.
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {IGiveawayButtons} [defineEmbedStrings] Giveaway buttons object.
 */

/**
 * Giveaway buttons that may be specified.
 * @typedef {object} IGiveawayButtons
 * @prop {?IGiveawayButtonOptions} [joinGiveawayButton] Button object for the "join giveaway" button.
 * @prop {?IGiveawayButtonOptions} [rerollButton] Button object for the "reroll" button.
 * @prop {?ILinkButton} [goToMessageButton] Link button object for the "go to message" button.
 */

/**
 * Link button object.
 *
 * Please note that URL is not required as it's being applied after starting the giveaway.
 * @typedef {object} ILinkButton
 * @prop {string} [text] Button text string.
 * @prop {string} [emoji] Emoji string.
 * @prop {ButtonStyle} url URL that the button will take to.
 */

/**
 * A function that defines the embed strings used in the giveaway.
 * @callback DefineEmbedStringsCallback
 * @param {Omit} giveaway - An object containing information about the giveaway.
 * @param {User} giveawayHost - The host of the giveaway.
 * @returns {Partial} - An object containing the defined embed strings.
 */

/**
 * Giveaway start options.
 * @typedef {object} IGiveawayStartOptions
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {IGiveawayButtons} [defineEmbedStrings] Giveaway buttons object.
 */

/**
 * Object containing embed string definitions used in the IGiveaways class.
 * @typedef {object} IEmbedStringsDefinitions
 *
 * @prop {IGiveawayEmbedOptions} start
 * This object is used in the original giveaway message that people will use to join the giveaway.
 *
 * @prop {GiveawayFinishCallback} finish
 * This function is called and all returned message objects are extracted and used when the giveaway is finished.
 *
 * @prop {GiveawayRerollCallback} reroll
 * This function is called and all returned message objects are extracted and used when the giveaway winners are rerolled.
 */

/**
 * Button object.
 * @typedef {object} IGiveawayButtonOptions
 * @prop {?string} [text] Button text string.
 * @prop {?string} [emoji] Emoji string.
 * @prop {?ButtonStyle} [style] Button style.
 */

/**
 * Message embed options.
 * @typedef {object} IGiveawayEmbedOptions
 *
 * @prop {?string} [messageContent]
 * Message content to specify in the message.
 * If only message content is specified, it will be sent without the embed.
 *
 * @prop {?string} [title] The title of the embed.
 * @prop {?string} [titleIcon] The icon of the title in the embed.
 * @prop {?string} [titleURL] The url of the icon of the title in the embed.
 * @prop {?string} [description] The description of the embed.
 * @prop {?string} [footer] The footer of the embed.
 * @prop {?string} [footerIcon] The icon of the footer in the embed.
 * @prop {?string} [thumbnailURL] Embed thumbnail.
 * @prop {?string} [imageURL] Embed Image URL.
 * @prop {?ColorResolvable} [color] The color of the embed.
 * @prop {?number} [timestamp] The embed timestamp to set.
 */

/**
 * JSON database configuration.
 * @typedef {object} IJSONDatabaseConfiguration
 * @prop {?string} [path='./giveaways.json'] Full path to a JSON storage file. Default: './giveaways.json'.
 * @prop {?boolean} [checkDatabase=true] Checks the if there are errors in database file. Default: true.
 * @prop {?number} [checkingCountdown=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */

/**
 * Database connection options based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
 * determine which connection configuration should be used.
 *
 * @typedef {(
 * Partial<IJSONDatabaseConfiguration> | EnmapOptions<any, any> | IMongoConnectionOptions
 * )} DatabaseConnectionOptions<TDatabaseType>
 *
 * @see {@link Partial<IJSONDatabaseConfiguration>} - JSON configuration.
 *
 * @see {@link EnmapOptions<any, any>} - Enmap configuration.
 *
 * @see {@link IMongoConnectionOptions} - MongoDB connection configuration.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */

/**
 * External database object based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will determine which connection configuration should be used.
 *
 * @typedef {(
 * null | Enmap<string, IDatabaseStructure> | Mongo<IDatabaseStructure>
 * )} Database<TDatabaseType>
 *
 * @see {@link null} - JSON database management object - `null`
 * is because it's not an external database - JSON is being parsed by the module itself.
 *
 * @see {@link Enmap<string, IDatabaseStructure>} - Enmap database.
 *
 * @see {@link Mongo<IDatabaseStructure>} - MongoDB database.
 *
 * @template {DatabaseType} TDatabaseType
 * The database type that will determine which external database management object should be used.
 */


/**
 * An interface containing the structure of the database used in the IGiveaways class.
 * @typedef {object} IDatabaseStructure
 * @prop {any} guildID Guild ID that stores the giveaways array
 * @prop {IGiveaway[]} giveaways Giveaways array property inside the [guildID] object in database.
 */

/**
 * The giveaway data that stored in database,
 * @typedef {object} IDatabaseGiveaway
 * @prop {IGiveaway} giveaway Giveaway object.
 * @prop {number} giveawayIndex Giveaway index in the guild giveaways array.
 */


/**
 * A type containing all the {@link Giveaways} events and their return types.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawaysEvents<TDatabaseType>
 * @prop {Giveaways<DatabaseType>} ready Emits when the {@link Giveaways} is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * @prop {Giveaway<DatabaseType>} giveawayStart Emits when a giveaway is started.
 * @prop {Giveaway<DatabaseType>} giveawayRestart Emits when a giveaway is rerolled.
 * @prop {Giveaway<DatabaseType>} giveawayEnd Emits when a giveaway is rerolled.
 * @prop {IGiveawayRerollEvent} giveawayReroll Emits when a giveaway is rerolled.
 *
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */

/**
 * Giveaway reroll event object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that will be used in the module.
 *
 * @typedef {object} IGiveawayRerollEvent<TDatabaseType>
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 * @prop {string} newWinners Array of the new picked winners after reroll.
 *
 * @template {DatabaseType} TDatabaseType The database type that will be used in the module.
 */

/**
 * An interface containing different colors that may be used in a logger.
 * @typedef {object} ILoggerColors
 * @prop {string} red The color red.
 * @prop {string} green The color green.
 * @prop {string} yellow The color yellow.
 * @prop {string} blue The color blue.
 * @prop {string} magenta The color magenta.
 * @prop {string} cyan The color cyan.
 * @prop {string} white The color white.
 * @prop {string} reset The reset color.
 * @prop {string} black The color black.
 * @prop {string} lightgray The color light gray.
 * @prop {string} default The default color.
 * @prop {string} darkgray The color dark gray.
 * @prop {string} lightred The color light red.
 * @prop {string} lightgreen The color light green.
 * @prop {string} lightyellow The color light yellow.
 * @prop {string} lightblue The color light blue.
 * @prop {string} lightmagenta The color light magenta.
 * @prop {string} lightcyan The color light cyan.
 */

/**
 * An object containing the data about available module updates.
 * @typedef {object} IUpdateState
 * @prop {boolean} updated Whether an update is available or not.
 * @prop {string} installedVersion The currently installed version.
 * @prop {string} availableVersion The available version, if any.
 */



// Utility types

/**
 * Represents the `if` statement on a type level.
 *
 * Type parameters:
 *
 * - `T` ({@link boolean}) - The boolean type to compare with.
 * - `IfTrue` ({@link any}) - The type that will be returned if `T` is `true`.
 * - `IfFalse` ({@link any}) - The type that will be returned if `T` is `false`.
 *
 * @typedef {IfTrue | IfFalse} If<T, IfTrue, IfFalse>
 *
 *
 * @template {boolean} T The boolean type to compare with.
 * @template IfTrue The type that will be returned if `T` is `true`.
 * @template IfFalse The type that will be returned if `T` is `false`.
 */

/**
 * Makes the specified properties in `K` from the object in `T` optional.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make optional.
 *
 * @typedef {object} Optional<T, K>
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make optional.
 */

/**
 * A callback function that calls when finding an element in array.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 *
 * @callback FindCallback<T>
 * @template T The type of item to be passed to the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {boolean} The boolean value returned by the callback function.
 */

/**
 * A callback function that calls when mapping the array using the {@link Array.prototype.map} method.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type of item to be passed to the callback function.
 * - `TReturnType` - ({@link any}) The type of value returned by the callback function.
 *
 * @callback MapCallback<T, TReturnType>
 *
 *
 * @template T The type of item to be passed to the callback function.
 * @template TReturnType The type of value returned by the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */



// Events, for documentation purposes

/**
 * Emits when the {@link Giveaways} module is ready.
 * @event Giveaways#ready
 * @param {Giveaways<DatabaseType>} giveaways Initialized {@link Giveaways} instance.
 */

/**
 * Emits when the {@link Giveaways} module establishes the database connection.
 * @event Giveaways#databaseConnect
 * @param {void} databaseConnect Initialized {@link Giveaways} instance.
 */

/**
 * Emits when a giveaway is started.
 * @event Giveaways#giveawayStart
 * @param {Giveaway<DatabaseType>} giveaway {@link Giveaway} that started.
 */

/**
 * Emits when a giveaway is restarted.
 * @event Giveaways#giveawayRestart
 * @param {Giveaway<DatabaseType>} giveaway {@link Giveaway} that restarted.
 */

/**
 * Emits when a giveaway is ended.
 * @event Giveaways#giveawayEnd
 * @param {Giveaway<DatabaseType>} giveaway {@link Giveaway} that ended.
 */

/**
 * Emits when a giveaway is rerolled.
 * @event Giveaways#giveawayReroll
 * @param {IGiveawayRerollEvent} giveaway {@link Giveaway} that was rerolled.
 */
