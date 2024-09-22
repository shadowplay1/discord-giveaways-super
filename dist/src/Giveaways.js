"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaways = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const quick_mongo_super_1 = __importDefault(require("quick-mongo-super"));
const enmap_1 = __importDefault(require("enmap"));
const discord_js_1 = require("discord.js");
const databaseType_enum_1 = require("./types/databaseType.enum");
const checkUpdates_function_1 = require("./lib/util/functions/checkUpdates.function");
const package_json_1 = require("../package.json");
const GiveawaysError_1 = require("./lib/util/classes/GiveawaysError");
const Logger_1 = require("./lib/util/classes/Logger");
const Emitter_1 = require("./lib/util/classes/Emitter");
const DatabaseManager_1 = require("./lib/managers/DatabaseManager");
const checkConfiguration_function_1 = require("./lib/util/functions/checkConfiguration.function");
const Giveaway_1 = require("./lib/Giveaway");
const giveaway_interface_1 = require("./lib/giveaway.interface");
const giveawayTemplate_1 = require("./structures/giveawayTemplate");
const MessageUtils_1 = require("./lib/util/classes/MessageUtils");
const time_function_1 = require("./lib/util/functions/time.function");
const TypedObject_1 = require("./lib/util/classes/TypedObject");
/**
 * Main Giveaways class.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * - `TDatabaseKey` ({@link string}, optional: defaults to `${string}.giveaways`) -
 * The type of database key that will be used in database operations.
 *
 * - `TDatabaseValue` ({@link any}, optional: defaults to {@link IDatabaseStructure}) -
 * The type of database content that will be used in database operations.
 *
 * @extends {Emitter<IGiveawaysEvents<TDatabaseType, TDatabaseKey, TDatabaseValue>>}
 *
 * @template TDatabaseType The database type that is used.
 * @template TDatabaseKey The type of database key that will be used in database operations.
 * @template TDatabaseValue The type of database content that will be used in database operations.
 */
class Giveaways extends Emitter_1.Emitter {
    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    client;
    /**
     * {@link Giveaways} ready state.
     * @type {boolean}
     */
    ready;
    /**
     * {@link Giveaways} version.
     * @type {string}
     */
    version;
    /**
     * Completed, filled and fixed {@link Giveaways} configuration.
     * @type {Required<IGiveawaysConfiguration<DatabaseType>>}
     */
    options;
    /**
     * External database instanca (such as Enmap or MongoDB) if used.
     * @type {?Database<DatabaseType>}
     */
    db;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    database;
    /**
     * Giveaways logger.
     * @type {Logger}
     * @private
     */
    _logger;
    /**
     * Message generation utility methods.
     * @type {MessageUtils}
     * @private
     */
    _messageUtils;
    /**
     * Giveaways ending state checking interval.
     * @type {NodeJS.Timeout}
     */
    giveawaysCheckingInterval;
    /**
     * Main {@link Giveaways} constructor.
     * @param {Client} client Discord client.
     * @param {IGiveawaysConfiguration<TDatabaseType>} options {@link Giveaways} configuration.
     */
    constructor(client, options) {
        super();
        /**
         * Discord Client.
         * @type {Client}
         */
        this.client = client;
        /**
         * {@link Giveaways} ready state.
         * @type {boolean}
         */
        this.ready = false;
        /**
         * {@link Giveaways} version.
         * @type {string}
         */
        this.version = package_json_1.version;
        /**
         * {@link Giveaways} logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger_1.Logger(options.debug || false);
        this._logger.debug('Giveaways version: ' + this.version, 'lightcyan');
        this._logger.debug(`Database type is ${options.database}.`, 'lightcyan');
        this._logger.debug('Debug mode is enabled.', 'lightcyan');
        this._logger.sendDevVersionWarning();
        this._logger.debug('Checking the configuration...');
        /**
         * Completed, filled and fixed {@link Giveaways} configuration.
         * @type {Required<IGiveawaysConfiguration<TDatabaseType>>}
         */
        this.options = (0, checkConfiguration_function_1.checkConfiguration)(options, options.configurationChecker);
        /**
         * External database instance (such as Enmap or MongoDB) if used.
         * @type {?Database<TDatabaseType>}
         */
        this.db = null; // specifying 'null' to just initialize the property; for docs purposes
        /**
         * Database Manager.
         * @type {DatabaseManager<TDatabaseType, TDatabaseKey, TDatabaseValue>}
         */
        this.database = null; // specifying 'null' to just initialize the property; for docs purposes
        /**
         * {@link Giveaways} ending state checking interval.
         * @type {NodeJS.Timeout}
         */
        this.giveawaysCheckingInterval = null; // specifying 'null' to just initialize the property; for docs purposes
        /**
         * Message utils instance.
         * @type {MessageUtils}
         * @private
         */
        this._messageUtils = new MessageUtils_1.MessageUtils(this);
        this._init();
    }
    /**
     * Initialize the database connection and initialize the {@link Giveaways} module.
     * @returns {Promise<void>}
     * @private
     */
    async _init() {
        this._logger.debug('Giveaways starting process launched.', 'lightgreen');
        if (!this.client) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.GiveawaysErrorCodes.NO_DISCORD_CLIENT);
        }
        if (!this.options.database) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_CONFIG_OPTION_MISSING('database'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_CONFIG_OPTION_MISSING);
        }
        if (!this.options.connection) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_CONFIG_OPTION_MISSING('connection'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_CONFIG_OPTION_MISSING);
        }
        const isDatabaseCorrect = Object.keys(databaseType_enum_1.DatabaseType)
            .map(databaseType => databaseType.toLowerCase())
            .includes(this.options.database.toLowerCase());
        if (!isDatabaseCorrect) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('"database"', 'value from "DatabaseType" enum: either "JSON", "MONGODB" or "Enmap"', typeof this.options.database), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof this.options.connection !== 'object') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('connection', 'object', typeof this.options.connection), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const requiredIntents = [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.GuildMessageReactions
        ];
        const clientIntents = new discord_js_1.IntentsBitField(this.client.options.intents);
        for (const requiredIntent of requiredIntents) {
            if (!clientIntents.has(requiredIntent)) {
                throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INTENT_MISSING(discord_js_1.GatewayIntentBits[requiredIntent]), GiveawaysError_1.GiveawaysErrorCodes.INTENT_MISSING);
            }
        }
        switch (this.options.database) {
            case databaseType_enum_1.DatabaseType.JSON: {
                this._logger.debug('Checking the database file...');
                const databaseOptions = this.options.connection;
                const isFileExists = (0, fs_1.existsSync)(databaseOptions.path);
                if (!isFileExists) {
                    await (0, promises_1.writeFile)(databaseOptions.path, '{}');
                }
                if (databaseOptions.checkDatabase) {
                    try {
                        setInterval(async () => {
                            const isFileExists = (0, fs_1.existsSync)(databaseOptions.path);
                            if (!isFileExists) {
                                await (0, promises_1.writeFile)(databaseOptions.path, '{}');
                            }
                            const databaseFile = await (0, promises_1.readFile)(databaseOptions.path, 'utf-8');
                            JSON.parse(databaseFile);
                        }, databaseOptions.checkingInterval);
                    }
                    catch (err) {
                        if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) {
                            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.DATABASE_ERROR(databaseType_enum_1.DatabaseType.JSON, 'malformed'), GiveawaysError_1.GiveawaysErrorCodes.DATABASE_ERROR);
                        }
                        if (err.message.includes('no such file')) {
                            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.DATABASE_ERROR(databaseType_enum_1.DatabaseType.JSON, 'notFound'), GiveawaysError_1.GiveawaysErrorCodes.DATABASE_ERROR);
                        }
                        throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.DATABASE_ERROR(databaseType_enum_1.DatabaseType.JSON), GiveawaysError_1.GiveawaysErrorCodes.DATABASE_ERROR);
                    }
                }
                this.emit('databaseConnect');
                break;
            }
            case databaseType_enum_1.DatabaseType.MONGODB: {
                this._logger.debug('Connecting to MongoDB...');
                const databaseOptions = this.options.connection;
                const mongo = new quick_mongo_super_1.default(databaseOptions);
                const connectionStartDate = Date.now();
                await mongo.connect();
                this.db = mongo;
                this._logger.debug(`MongoDB connection established in ${Date.now() - connectionStartDate}ms`, 'lightgreen');
                this.emit('databaseConnect');
                break;
            }
            case databaseType_enum_1.DatabaseType.ENMAP: {
                this._logger.debug('Initializing Enmap...');
                const databaseOptions = this.options.connection;
                this.db = new enmap_1.default(databaseOptions);
                this.emit('databaseConnect');
                break;
            }
            default: {
                throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_DATABASE);
            }
        }
        this.database = new DatabaseManager_1.DatabaseManager(this);
        await this._sendUpdateMessage();
        this._logger.debug('Waiting for client to be ready...');
        const clientReadyInterval = setInterval(() => {
            if (this.client.isReady()) {
                clearInterval(clientReadyInterval);
                const giveawayCheckingInterval = setInterval(() => {
                    this._checkGiveaways();
                }, this.options.giveawaysCheckingInterval);
                this.giveawaysCheckingInterval = giveawayCheckingInterval;
                this.ready = true;
                this.emit('ready', this);
                this._logger.debug('Giveaways module is ready!', 'lightgreen');
            }
        }, 100);
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isButton()) {
                const interactionMessage = interaction.message;
                if (interaction.customId == 'joinGiveawayButton') {
                    const guildGiveaways = this.getGuildGiveaways(interactionMessage.guild.id);
                    const giveaway = guildGiveaways.find(giveaway => giveaway.messageID == interactionMessage.id);
                    if (giveaway) {
                        const isUserJoined = giveaway.entries.has(interaction.user.id);
                        const restrictedMessages = giveaway.messageProps?.embeds.restrictionsMessages;
                        for (const messageObjectName of TypedObject_1.TypedObject.keys(restrictedMessages || {})) {
                            const messageObject = restrictedMessages[messageObjectName];
                            for (const [key, value] of TypedObject_1.TypedObject.entries(messageObject || {})) {
                                messageObject[key] = value
                                    ?.toString()
                                    ?.replaceAll('{memberMention}', interaction.user.toString());
                            }
                        }
                        const memberRestrictionMessage = restrictedMessages?.memberRestricted || {};
                        const hasNoRequiredRolesMessage = restrictedMessages?.hasNoRequiredRoles || {};
                        const hasRestrictedRolesMessage = restrictedMessages?.hasRestrictedRoles || {};
                        if (giveaway.participantsFilter?.restrictedMembers?.length) {
                            if (!(interaction.member instanceof discord_js_1.GuildMember))
                                return;
                            const restrictedMembers = giveaway.participantsFilter?.restrictedMembers
                                .map(role => role.replaceAll('<@', '').replaceAll('>', ''));
                            if (restrictedMembers.includes(interaction.user.id)) {
                                if (!Object.keys(memberRestrictionMessage).length) {
                                    memberRestrictionMessage.messageContent = 'You **cannot** participate in this giveaway.';
                                }
                                const memberRestrictedEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, memberRestrictionMessage);
                                interaction.reply({
                                    content: memberRestrictionMessage?.messageContent,
                                    embeds: Object.keys(memberRestrictionMessage).length == 1 &&
                                        memberRestrictionMessage?.messageContent
                                        ? [] : [memberRestrictedEmbed],
                                    ephemeral: true
                                });
                                return;
                            }
                        }
                        if (giveaway.participantsFilter?.requiredRoles?.length) {
                            if (!(interaction.member instanceof discord_js_1.GuildMember))
                                return;
                            const requiredRoles = giveaway.participantsFilter?.requiredRoles
                                .map(role => role.replaceAll('<@&', '').replaceAll('>', ''));
                            let memberHasAtLeastOneRequiredRole = false;
                            for (const roleID of interaction.member.roles.cache.keys()) {
                                if (requiredRoles.includes(roleID)) {
                                    memberHasAtLeastOneRequiredRole = true;
                                }
                            }
                            if (!memberHasAtLeastOneRequiredRole) {
                                if (!Object.keys(hasNoRequiredRolesMessage).length) {
                                    hasNoRequiredRolesMessage.messageContent =
                                        'You **don\'t** have any of the **required** roles' +
                                            `to join this giveaway: ${giveaway.participantsFilter.requiredRoles.join(', ')}.`;
                                }
                                const hasNoRequiredRolesEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, hasNoRequiredRolesMessage);
                                interaction.reply({
                                    content: hasNoRequiredRolesMessage?.messageContent,
                                    embeds: Object.keys(hasNoRequiredRolesMessage).length == 1 &&
                                        hasNoRequiredRolesMessage?.messageContent
                                        ? [] : [hasNoRequiredRolesEmbed],
                                    ephemeral: true
                                });
                                return;
                            }
                        }
                        if (giveaway.participantsFilter?.restrictedRoles?.length) {
                            if (!(interaction.member instanceof discord_js_1.GuildMember))
                                return;
                            const restrictedRoles = giveaway.participantsFilter?.restrictedRoles
                                .map(role => role.replaceAll('<@&', '').replaceAll('>', ''));
                            for (const restrictedRole of restrictedRoles) {
                                const memberHasRestrictedRole = interaction.member.roles.cache.has(restrictedRole);
                                if (memberHasRestrictedRole) {
                                    if (!Object.keys(hasRestrictedRolesMessage).length) {
                                        hasRestrictedRolesMessage.messageContent =
                                            'You **cannot** have any of these roles to join this giveaway: ' +
                                                `${giveaway.participantsFilter.restrictedRoles.join(', ')}.`;
                                    }
                                    const hasRestrictedRolesEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, hasRestrictedRolesMessage);
                                    interaction.reply({
                                        content: hasRestrictedRolesMessage?.messageContent,
                                        embeds: Object.keys(hasRestrictedRolesMessage).length == 1 &&
                                            hasRestrictedRolesMessage?.messageContent
                                            ? [] : [hasRestrictedRolesEmbed],
                                        ephemeral: true
                                    });
                                    return;
                                }
                            }
                        }
                        if (!isUserJoined) {
                            const giveawayJoinMessage = giveaway.messageProps?.embeds?.joinGiveawayMessage || {};
                            const giveawayLeaveEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, giveawayJoinMessage);
                            const newGiveaway = giveaway.addEntry(interaction.guild.id, interaction.user.id);
                            if (!Object.keys(giveawayJoinMessage).length) {
                                giveawayJoinMessage.messageContent = 'You have joined the giveaway!';
                            }
                            interaction.reply({
                                content: giveawayJoinMessage?.messageContent,
                                embeds: Object.keys(giveawayJoinMessage).length == 1 &&
                                    giveawayJoinMessage?.messageContent
                                    ? [] : [giveawayLeaveEmbed],
                                ephemeral: true
                            }).catch((err) => {
                                // catching the "unknown interaction" error
                                // while still sending the response on the button click somehow
                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError_1.GiveawaysError('Cannot join the giveaway: ' + err, GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_ERROR);
                                }
                            });
                            this._messageUtils.editEntryGiveawayMessage(newGiveaway);
                        }
                        else {
                            const giveawayLeaveMessage = giveaway.messageProps?.embeds?.leaveGiveawayMessage || {};
                            const giveawayLeaveEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, giveawayLeaveMessage);
                            const newGiveaway = giveaway.removeEntry(interaction.guild.id, interaction.user.id);
                            if (!Object.keys(giveawayLeaveMessage).length) {
                                giveawayLeaveMessage.messageContent = 'You have left the giveaway!';
                            }
                            interaction.reply({
                                content: giveawayLeaveMessage?.messageContent,
                                embeds: Object.keys(giveawayLeaveMessage).length == 1 &&
                                    giveawayLeaveMessage?.messageContent
                                    ? [] : [giveawayLeaveEmbed],
                                ephemeral: true
                            }).catch((err) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow
                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError_1.GiveawaysError('Cannot leave the giveaway: ' + err, GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_ERROR);
                                }
                            });
                            this._messageUtils.editEntryGiveawayMessage(newGiveaway);
                        }
                    }
                    else {
                        throw new GiveawaysError_1.GiveawaysError('Cannot join the giveaway: ' + GiveawaysError_1.errorMessages.UNKNOWN_GIVEAWAY(interactionMessage.id), GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_GIVEAWAY);
                    }
                }
                if (interaction.customId == 'rerollButton') {
                    const guildGiveaways = this.getGuildGiveaways(interactionMessage.guild.id);
                    const giveaway = guildGiveaways.find(giveaway => giveaway.messageID == interactionMessage.id);
                    const rerollEmbedStrings = giveaway?.messageProps?.embeds?.reroll;
                    if (giveaway) {
                        if (interaction.user.id !== giveaway?.host.id) {
                            const onlyHostCanReroll = rerollEmbedStrings?.onlyHostCanReroll || {};
                            const rerollErroredMessageContent = onlyHostCanReroll?.messageContent;
                            const errorEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, onlyHostCanReroll);
                            interaction.reply({
                                content: rerollErroredMessageContent,
                                embeds: Object.keys(onlyHostCanReroll).length == 1 && rerollErroredMessageContent ? [] : [errorEmbed],
                                ephemeral: true
                            }).catch((err) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow
                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError_1.GiveawaysError('Cannot reply to the button: ' + err, GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_ERROR);
                                }
                            });
                        }
                        else {
                            const rerollSuccess = rerollEmbedStrings?.successMessage || {};
                            const rerollSuccessfulMessageCreate = rerollSuccess?.messageContent;
                            giveaway.reroll();
                            const successEmbed = this._messageUtils.buildGiveawayEmbed(giveaway.raw, rerollSuccess);
                            interaction.reply({
                                content: rerollSuccessfulMessageCreate,
                                embeds: Object.keys(rerollSuccess).length == 1 && rerollSuccessfulMessageCreate ? [] : [successEmbed],
                                ephemeral: true
                            }).catch((err) => {
                                // catching the "unknown interaction" error
                                // while still sending the responce on the button click somehow
                                if (!err.message.toLowerCase().includes('interaction')) {
                                    throw new GiveawaysError_1.GiveawaysError('Cannot reroll the winners: ' + err, GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_ERROR);
                                }
                            });
                        }
                    }
                    else {
                        throw new GiveawaysError_1.GiveawaysError('Cannot reroll the winners: ' + GiveawaysError_1.errorMessages.UNKNOWN_GIVEAWAY(interactionMessage.id), GiveawaysError_1.GiveawaysErrorCodes.UNKNOWN_GIVEAWAY);
                    }
                }
            }
        });
    }
    /**
     * Sends the {@link Giveaways} module update state in the console.
     * @returns {Promise<void>}
     * @private
     */
    async _sendUpdateMessage() {
        /* eslint-disable max-len */
        if (this.options.updatesChecker?.checkUpdates) {
            const result = await (0, checkUpdates_function_1.checkUpdates)();
            if (!result.updated) {
                console.log('\n\n');
                console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════════╗');
                console.log(this._logger.colors.green + '║ @ discord-giveaways-super                                    - [] X ║');
                console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════════║');
                console.log(this._logger.colors.yellow + `║                      The module is ${this._logger.colors.red}out of date!${this._logger.colors.yellow}                     ║`);
                console.log(this._logger.colors.magenta + '║                       New version is available!                     ║');
                console.log(this._logger.colors.blue + `║                             ${result.installedVersion} --> ${result.availableVersion}                         ║`);
                console.log(this._logger.colors.cyan + '║                Run "npm i discord-giveaways-super@latest"           ║');
                console.log(this._logger.colors.cyan + '║                              to update!                             ║');
                console.log(this._logger.colors.white + '║                     View the full changelog here:                   ║');
                console.log(this._logger.colors.red + `║     https://dgs-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog     ║`);
                console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════════╝\x1b[37m');
                console.log('\n\n');
            }
            else {
                if (this.options.updatesChecker?.upToDateMessage) {
                    console.log('\n\n');
                    console.log(this._logger.colors.green + '╔═════════════════════════════════════════════════════════════════╗');
                    console.log(this._logger.colors.green + '║ @ discord-giveaways-super                                - [] X ║');
                    console.log(this._logger.colors.green + '║═════════════════════════════════════════════════════════════════║');
                    console.log(this._logger.colors.yellow + `║                      The module is ${this._logger.colors.cyan}up to date!${this._logger.colors.yellow}                  ║`);
                    console.log(this._logger.colors.magenta + '║                      No updates are available.                  ║');
                    console.log(this._logger.colors.blue + `║                      Current version is ${result.availableVersion}.                  ║`);
                    console.log(this._logger.colors.cyan + '║                               Enjoy!                            ║');
                    console.log(this._logger.colors.white + '║                   View the full changelog here:                 ║');
                    console.log(this._logger.colors.red + `║   https://dgs-docs.js.org/#/docs/main/${result.availableVersion}/general/changelog   ║`);
                    console.log(this._logger.colors.green + '╚═════════════════════════════════════════════════════════════════╝\x1b[37m');
                    console.log('\n\n');
                }
            }
        }
    }
    /**
     * Starts the giveaway.
     * @param {IGiveawayStartConfig} giveawayOptions {@link Giveaway} options.
     * @returns {Promise<SafeGiveaway<Giveaway<DatabaseType>>>} Created {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified.
     */
    async start(giveawayOptions) {
        const { channelID, guildID, hostMemberID, prize, time, winnersCount, defineEmbedStrings, buttons, participantsFilter } = giveawayOptions;
        if (!channelID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('channelID', 'Giveaways.start'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!guildID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaways.start'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!hostMemberID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('hostMemberID', 'Giveaways.start'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!prize) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('prize', 'Giveaways.start'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof channelID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.channelID', 'string', channelID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof guildID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.guildID', 'string', guildID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof hostMemberID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.hostMemberID', 'string', hostMemberID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof prize !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.prize', 'string', prize), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof time !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.time', 'string', time), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (isNaN(winnersCount)) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.winnersCount', 'number', winnersCount), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (buttons && typeof buttons !== 'object') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.buttons', 'object', buttons), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof defineEmbedStrings !== 'function') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayOptions.defineEmbedStrings', 'function', defineEmbedStrings), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (!(0, time_function_1.isTimeStringValid)(time)) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.GiveawaysErrorCodes.INVALID_TIME);
        }
        const joinGiveawayButton = buttons?.joinGiveawayButton;
        const rerollButton = buttons?.rerollButton;
        const goToMessageButton = buttons?.goToMessageButton;
        const guildGiveaways = this.getGuildGiveaways(guildID);
        const newGiveaway = {
            id: ((guildGiveaways.at(-1)?.id || 0)) + 1,
            hostMemberID,
            guildID,
            channelID,
            messageID: '',
            prize,
            startTimestamp: Math.floor(Date.now() / 1000),
            endTimestamp: Math.floor((Date.now() + (0, time_function_1.convertTimeToMilliseconds)(time)) / 1000),
            endedTimestamp: 0,
            time: time || '1d',
            state: giveaway_interface_1.GiveawayState.STARTED,
            winnersCount: winnersCount || 1,
            entriesCount: 0,
            entries: [],
            winners: [],
            participantsFilter: participantsFilter || {},
            isEnded: false
        };
        const hostMember = await this.client.users.fetch(hostMemberID).catch(console.error);
        if (!hostMember) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.USER_NOT_FOUND(hostMemberID), GiveawaysError_1.GiveawaysErrorCodes.USER_NOT_FOUND);
        }
        const definedEmbedStrings = defineEmbedStrings ? defineEmbedStrings(giveawayTemplate_1.giveawayTemplate, hostMember, newGiveaway.participantsFilter) : {};
        const startEmbedStrings = definedEmbedStrings?.start || {};
        const finish = definedEmbedStrings?.finish;
        const reroll = definedEmbedStrings?.reroll;
        const restrictionsMessages = definedEmbedStrings?.restrictionsMessages;
        const channel = this.client.channels.cache.get(channelID);
        const giveawayEmbed = this._messageUtils.buildGiveawayEmbed(newGiveaway, startEmbedStrings);
        const buttonsRow = this._messageUtils.buildButtonsRow(joinGiveawayButton);
        const [finishEmbedStrings, rerollEmbedStrings, restrictionsMessagesStrings] = [
            finish ? finish('{winnersString}', winnersCount) : {},
            reroll ? reroll('{winnersString}', winnersCount) : {},
            restrictionsMessages ? restrictionsMessages('{memberMention}') : {}
        ];
        const message = await channel.send({
            content: startEmbedStrings?.messageContent,
            embeds: Object.keys(startEmbedStrings).length == 1 && startEmbedStrings?.messageContent ? [] : [giveawayEmbed],
            components: [buttonsRow]
        });
        newGiveaway.messageID = message.id;
        newGiveaway.messageURL = message.url;
        newGiveaway.endTimestamp = Math.floor((Date.now() + (0, time_function_1.convertTimeToMilliseconds)(newGiveaway.time)) / 1000);
        newGiveaway.messageProps = {
            embeds: {
                start: startEmbedStrings,
                joinGiveawayMessage: definedEmbedStrings?.joinGiveawayMessage,
                leaveGiveawayMessage: definedEmbedStrings?.leaveGiveawayMessage,
                finish: finishEmbedStrings,
                reroll: rerollEmbedStrings,
                restrictionsMessages: restrictionsMessagesStrings
            },
            buttons: {
                joinGiveawayButton,
                rerollButton,
                goToMessageButton
            }
        };
        this.database.push(`${guildID}.giveaways`, newGiveaway);
        const startedGiveaway = new Giveaway_1.Giveaway(this, newGiveaway);
        this.emit('giveawayStart', startedGiveaway);
        return startedGiveaway;
    }
    /**
     * Finds the giveaway in all giveaways database by its ID.
     * @param {number} giveawayID Giveaway ID to find the giveaway by.
     * @returns {Maybe<UnsafeGiveaway<Giveaway<TDatabaseType>>>} Giveaway instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    get(giveawayID) {
        if (!giveawayID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('giveawayID', 'Giveaways.get'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (isNaN(giveawayID)) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveawayID', 'number', giveawayID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const result = this.find(giveaway => giveaway.id == giveawayID) || null;
        return result;
    }
    /**
     * Finds the giveaway in all giveaways database by the specified callback function.
     *
     * @param {FindCallback<Giveaway<TDatabaseType>>} cb
     * The callback function to find the giveaway in the giveaways database.
     *
     * @returns {Maybe<UnsafeGiveaway<Giveaway<TDatabaseType>>>} Giveaway instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    find(cb) {
        if (!cb) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('cb', 'Giveaways.find'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof cb !== 'function') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('cb', 'function', cb), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const giveaways = this.getAll();
        const giveaway = giveaways.find(cb) || null;
        return giveaway;
    }
    /**
     * Returns the mapped giveaways array based on the specified callback function.
     *
     * Type parameters:
     *
     * - `TReturnType` - the type being returned in a callback function.
     *
     * @param {FindCallback<Giveaway<TDatabaseType>>} cb
     * The callback function to call on the giveaway.
     *
     * @returns {TReturnType[]} Mapped giveaways array.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    map(cb) {
        if (!cb) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('cb', 'Giveaways.find'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof cb !== 'function') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('cb', 'function', cb), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const giveaways = this.getAll();
        const giveaway = giveaways.map(cb);
        return giveaway;
    }
    /**
     * Gets all the giveaways from the specified guild in database.
     * @param {DiscordID<string>} guildID Guild ID to get the giveaways from.
     * @returns {Array<UnsafeGiveaway<Giveaway<TDatabaseType>>>} Giveaways array from the specified guild in database.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    getGuildGiveaways(guildID) {
        if (!guildID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaways.getGuildGiveaways'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof guildID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('guildID', 'string', guildID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const giveaways = this.database.get(`${guildID}.giveaways`) || [];
        return giveaways.map(giveaway => new Giveaway_1.Giveaway(this, giveaway));
    }
    /**
     * Gets all the giveaways from all the guilds in database.
     * @returns {Array<Giveaway<TDatabaseType>>} Giveaways array from all the guilds in database.
     */
    getAll() {
        const giveaways = [];
        const guildIDs = this.database.getKeys();
        for (const guildID of guildIDs.filter(guildID => !isNaN(parseInt(guildID)))) {
            const databaseGiveaways = this.database.get(`${guildID}.giveaways`) || [];
            for (const databaseGiveaway of databaseGiveaways) {
                giveaways.push(databaseGiveaway);
            }
        }
        return giveaways.map(giveaway => new Giveaway_1.Giveaway(this, giveaway));
    }
    /**
     * Checks for all giveaways to be finished and end them if they are.
     * @returns {void}
     * @private
     */
    _checkGiveaways() {
        const giveaways = this.getAll();
        for (const giveaway of giveaways) {
            if (giveaway.isFinished && !giveaway.isEnded) {
                giveaway.end();
            }
        }
    }
}
exports.Giveaways = Giveaways;
// For documentation purposes
/**
 * An object that contains an information about a giveaway.
 * @typedef {object} IGiveaway
 * @prop {number} id The ID of the giveaway.
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {GiveawayState} state The state of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {number} startTimestamp The timestamp when the giveaway started.
 * @prop {boolean} isEnded Determines if the giveaway was ended in the database.
 * @prop {number} endTimestamp The timestamp when the giveaway ended.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} messageID The ID of the giveaway message.
 * @prop {string} messageURL The URL of the giveaway message.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 * @prop {Array<DiscordID<string>>} entries The array of user Set of IDs of users who have joined the giveaway.
 * @prop {Array<DiscordID<string>>} winners Array of used ID who have won in the giveaway.
 *
 * Don't confuse this property with `winnersCount`, the setting that dertermines how many users can win in the giveaway.
 * @prop {number} entriesCount The number of users who have joined the giveaway.
 * @prop {Partial<IParticipantsFilter>} participantsFilter An object with conditions for members to join the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 *
 * @template TDatabaseType The database type that is used.
 */
/**
 * An object with conditions for members to join the giveaway.
 * @typedef {object} IParticipantsFilter
 * @prop {Array<DiscordID<string>>} [requiredRoles]
 * Array of role IDs that the user *required* to have in order to participate in a giveaway.
 *
 * @prop {Array<DiscordID<string>>} [restrictedRoles]
 * Array of role IDs that the user *cannot have* in order to participate in a giveaway.
 *
 * @prop {Array<DiscordID<string>>} [restrictedMembers]
 * Array of member IDs of the users who *cannot participate* in the giveaway.
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
 * @prop {IGiveawayEmbedOptions} noWinnersNewGiveawayMessage The options for the embed when there are no winners for the giveaway.
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
 * @prop {IGiveawayEmbedOptions} joinGiveawayMessage The message to reply to user with when they join the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} leaveGiveawayMejoinGiveawayMessage
 * The message to reply to user with when they leave the giveaway.
 *
 * @prop {IGiveawayRerollEmbeds} reroll Message embed data for cases when rerolling the giveaway.
 * @prop {IGiveawayFinishEmbeds} finish Message embed data for cases when the giveaway has finished.
 *
 * @prop {IGiveawayJoinRestrictionsMessages} restrictionsMessages
 * Message embed data for all the giveaway joining restrictions cases.
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
 * @prop {IGiveawayEmbedOptions} noWinnersNewGiveawayMessage
 * The message that will be set to the original giveaway message if there are no winners in the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} noWinnersEndMessage
 * The separated message to be sent in the giveaway channel if there are no winners in the giveaway.
 */
/**
 * A function that is called when giveaway is finished.
 * @callback GiveawayFinishCallback<IsTemplate>
 * @param {string} winnersString A string that contains the users who won the giveaway separated with comma.
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayFinishMessages} Giveaway message object.
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
 * @callback GiveawayRerollCallback<IsTemplate>
 *
 * @param {string} winnersMentionsString
 * A string that contains the mentions of users who won the giveaway, separated with comma.
 *
 * @param {number} winnersCount Number of winners that were picked.
 * @returns {IGiveawayRerollMessages} Giveaway message object.
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
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} messageID The ID of the giveaway message.
 * @prop {string} messageURL The URL of the giveaway message.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 * @prop {Array<DiscordID<string>>} entries The array of user Set of IDs of users who have joined the giveaway.
 * @prop {IGiveawayMessageProps} messageProps The message data properties for embeds and buttons.
 */
/**
 * A type that contains all giveaway properties that may be safely edited.
 * @typedef {'prize' | 'winnersCount' | 'hostMemberID'} EditableGiveawayProperties
 */
/**
 * The type that returns the property's value type based on the specified {@link Giveaway} property in `TProperty`.
 *
 * Type parameters:
 *
 * - `TProperty` ({@link EditableGiveawayProperties}) - {@link Giveaway} property to get its value type.
 *
 * @typedef {object} GiveawayPropertyValue<TProperty>
 * @template TProperty {@link Giveaway} property to get its value type.
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
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will
 * determine which connection configuration should be used.
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
 * @prop {Partial<IUpdateCheckerConfiguration>} [updatesChecker] Updates checker configuration.
 * @prop {Partial<IGiveawaysConfigCheckerConfiguration>} [configurationChecker] Giveaways config checker configuration.
 *
 * @template TDatabaseType
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
 * @prop {Partial<IUpdateCheckerConfiguration>} [updatesChecker] Updates checker configuration.
 * @prop {Partial<IGiveawaysConfigCheckerConfiguration>} [configurationChecker] Giveaways config checker configuration.
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
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingInterval=1000] Determines how often the database file will be checked (in ms). Default: 1000.
 */
/**
 * An object that contains an information about a giveaway that is required fo starting.
 * @typedef {object} IGiveawayData
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 */
/**
 * Giveaway start config.
 * @typedef {object} IGiveawayStartConfig
 * @prop {string} prize The prize of the giveaway.
 * @prop {string} time The time of the giveaway.
 * @prop {number} winnersCount The number of possible winners in the giveaway.
 * @prop {DiscordID<string>} hostMemberID The ID of the host member.
 * @prop {DiscordID<string>} channelID The ID of the channel where the giveaway is held.
 * @prop {DiscordID<string>} guildID The ID of the guild where the giveaway is held.
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {DefineEmbedStringsCallback<IsTemplate>} [defineEmbedStrings] A function that defines the embed strings used in the giveaway.
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
 * @callback DefineEmbedStringsCallback<IsTemplate>
 * @param {IGiveaway} giveaway - An object containing information about the giveaway.
 * @param {User} giveawayHost - The host of the giveaway.
 * @returns {Partial<IEmbedStringsDefinitions<IsTemplate>>} - An object containing the defined embed strings.
 */
/**
 * Giveaway start options.
 * @typedef {object} IGiveawayStartOptions
 * @prop {IGiveawayButtons} [buttons] Giveaway buttons object.
 * @prop {DefineEmbedStringsCallback<IsTemplate>} [defineEmbedStrings] A function that defines the embed strings used in the giveaway.
 */
/**
 * Object containing embed string definitions used in the IGiveaways class.
 *
 * Type parameters:
 *
 * - `IsTemplate` ({@link boolean}) - Determine if the specified giveaway object is a template object.
 *
 * @typedef {object} IEmbedStringsDefinitions
 *
 * @prop {IGiveawayEmbedOptions} start
 * This object is used in the original giveaway message that people will use to join the giveaway.
 *
 * @prop {GiveawayFinishCallback<IsTemplate>} finish
 * This function is called and all returned message objects are extracted when the giveaway is finished.
 *
 * @prop {GiveawayRerollCallback<IsTemplate>} reroll
 * This function is called and all returned message objects are extracted when the giveaway winners are rerolled.
 *
 * @prop {GiveawayJoinRestrictionsCallback<IsTemplate>} restrictionsMessages
 * This function is called and all returned message objects are extracted when any case
 * of the user not being able to participate in a giveaway has triggered
 * (such as not having the required role or being completely restricted).
 *
 * @template IsTemplate Determine if the specified giveaway object is a template object.
 */
/**
 * A function that is called when the member cannot join the giveaway
 * due to participants filter being set up.
 *
 * @callback GiveawayJoinRestrictionsCallback<IsTemplate>
 *
 * @param {string} memberMention The mention of the user who attempted to join the giveaway.
 * @returns {Partial<IGiveawayJoinRestrictionsMessages>} Giveaway join restrictions messages object.
 *
 * @template IsTemplate Determine if the specified giveaway object is a template object.
 */
/**
 * The object where all the giveaway restrictions messages may be specified.
 * @typedef {object} IGiveawayJoinRestrictionsMessages
 * @prop {IGiveawayEmbedOptions} memberRestricted
 * The message to reply with if the member is restricted from participating in the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} hasNoRequiredRoles
 * The message to reply with if the member doesn't have at least one
 * of the **required** roles to participate in the giveaway.
 *
 * @prop {IGiveawayEmbedOptions} hasRestrictedRoles
 * The message to reply with if the member has at least one
 * of the **restricted** roles that are not allowing to participate in the giveaway.
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
 * @prop {?boolean} [checkDatabase=true] Enables the error checking for database file. Default: true
 * @prop {?number} [checkingInterval=1000] Determines how often the database file will be checked (in ms). Default: 1000.
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
 * @see Partial<IJSONDatabaseConfiguration> - JSON configuration.
 *
 * @see EnmapOptions<any, any> - Enmap configuration.
 *
 * @see IMongoConnectionOptions - MongoDB connection configuration.
 *
 * @template TDatabaseType
 * The database type that will determine which connection configuration should be used.
 */
/**
 * External database object based on the used database type.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - Database type that will determine
 * which connection configuration should be used.
 *
 * - `TKey` ({@link string}) - The type of database key that will be used.
 * - `TValue` ({@link any}) - The type of database values that will be used.
 *
 * @typedef {(
 * null | Enmap<string, IDatabaseStructure> | Mongo<IDatabaseStructure>
 * )} Database<TDatabaseType>
 *
 * @see null - JSON database management object - `null`
 * is because it's not an external database - JSON is being parsed by the module itself.
 *
 * @see Enmap<string, IDatabaseStructure> - Enmap database.
 *
 * @see Mongo<IDatabaseStructure> - MongoDB database.
 *
 * @template TDatabaseType
 * The database type that will determine which external database management object should be used.
 * @template TKey The type of database key that will be used.
 * @template TValue The type of database values that will be used.
 */
/**
 * An interface containing the structure of the database used in the IGiveaways class.
 * @typedef {object} IDatabaseStructure
 * @prop {DiscordID<string>} guildID Guild ID that stores the giveaways array
 * @prop {IGiveaway[]} giveaways Giveaways array property inside the [guildID] object in database.
 */
/**
 * The giveaway data that stored in database,
 * @typedef {object} IDatabaseArrayGiveaway
 * @prop {IGiveaway} giveaway Giveaway object.
 * @prop {number} giveawayIndex Giveaway index in the guild giveaways array.
 */
/**
 * A type containing all the {@link Giveaways} events and their return types.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * - `TDatabaseKey` ({@link string}, optional: defaults to `${string}.giveaways`) -
 * The type of database key that will be used in database operations.
 *
 * - `TDatabaseValue` ({@link any}, optional: defaults to {@link IDatabaseStructure}) -
 * The type of database content that will be used in database operations.
 *
 * @typedef {object} IGiveawaysEvents
 * @prop {Giveaways<DatabaseType, TDatabaseKey, TDatabaseValue>} ready Emits when the {@link Giveaways} module is ready.
 * @prop {void} databaseConnect Emits when the connection to the database is established.
 * @prop {Giveaway<DatabaseType>} giveawayStart Emits when the giveaway is started.
 * @prop {Giveaway<DatabaseType>} giveawayRestart Emits when the giveaway is restarted.
 * @prop {Giveaway<DatabaseType>} giveawayEnd Emits when the giveaway is ended.
 * @prop {IGiveawayRerollEvent<DatabaseType>} giveawayReroll Emits when the giveaway winners are rerolled.
 * @prop {IGiveawayEditEvent<DatabaseType>} giveawayEdit Emits when the giveaway info was edited.
 *
 * @template TDatabaseType The database type that is used.
 * @template TDatabaseKey The type of database key that will be used in database operations.
 * @template TDatabaseValue The type of database content that will be used in database operations.
 */
/**
 * Giveaway reroll event object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * @typedef {object} IGiveawayRerollEvent<TDatabaseType>
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 * @prop {string} newWinners Array of the new picked winners after reroll.
 *
 * @template TDatabaseType The database type that is used.
 */
/**
 * Giveaway time change event object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * @typedef {object} IGiveawayTimeChangeEvent
 * @prop {string} time The time that affected the giveaway's length.
 * @prop {Giveaway<DatabaseType>} giveaway Giveaway instance.
 *
 * @template TDatabaseType The database type that is used.
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
 * @template T The boolean type to compare with.
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
 * @typedef {object} OptionalProps<T, K>
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make optional.
 */
/**
 * Makes the specified properties in `K` from the object in `T` required.
 *
 * Type parameters:
 *
 * - `T` ({@link object}) - The object to get the properties from.
 * - `K` (keyof T) - The properties to make required.
 *
 * @template T - The object to get the properties from.
 * @template K - The properties to make required.
 *
 * @typedef {object} RequiredProps
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
 * @template T The type of item to be passed to the callback function.
 * @template TReturnType The type of value returned by the callback function.
 *
 * @param {T} item The item to be passed to the callback function.
 * @returns {TReturnType} The value returned by the callback function.
 */
/**
 * A type that represents any value with "null" possible to be returned.
 *
 * Type parameters:
 *
 * - `T` ({@link any}) - The type to attach.
 *
 * @template T The type to attach.
 * @typedef {any} Maybe<T>
 */
/**
 * Adds a prefix at the beginning of a string literal type.
 *
 * Type parameters:
 *
 * - `TWord` ({@link string}) The string literal type or union type of them to add the prefix to.
 * - `TPrefix` ({@link string}) The string literal type of the prefix to use.
 *
 * @template TWord The string literal type or union type of them to add the prefix to.
 * @template TPrefix The string literal type of the prefix to use.
 *
 * @typedef {string} AddPrefix<TWord, TPrefix>
 */
/**
* Constructs an object type with prefixed properties and specified value for each of them.
*
* Type parameters:
*
* - `TWords` ({@link string}) The union type of string literals to add the prefix to.
* - `TPrefix` ({@link string}) The string literal type of the prefix to use.
* - `Value` ({@link any}) Any value to assign as value of each property of the constructed object.
*
* @template TWords The union type of string literals to add the prefix to.
* @template TPrefix The string literal type of the prefix to use.
* @template Value Any value to assign as value of each property of the constructed object.
*
* @typedef {string} PrefixedObject<TWords, TPrefix, Value>
*/
/**
 * Compares the values on type level and returns a boolean value.
 *
 * Type parameters:
 *
 * - `ToCompare` ({@link any}) - The type to compare.
 * - `CompareWith` ({@link any}) - The type to compare with.
 *
 * @template ToCompare The type to compare.
 * @template CompareWith The type to compare with.
 *
 * @typedef {boolean} Equals<ToCompare, CompareWith>
 */
/**
 * Considers the specified giveaway is running and that is safe to edit its data.
 *
 * Unlocks the following {@link Giveaway} methods - after performing the {@link Giveaway.isRunning()} type-guard check:
 *
 * - {@link Giveaway.end()}
 * - {@link Giveaway.edit()}
 * - {@link Giveaway.extend()}
 * - {@link Giveaway.reduce()}
 * - {@link Giveaway.setPrize()}
 * - {@link Giveaway.setWinnersCount()}
 * - {@link Giveaway.setTime()}
 * - {@link Giveaway.setHostMemberID()}
 *
 * Type parameters:
 *
 * - `TGiveaway` ({@link Giveaway<any>} | {@link UnsafeGiveaway<Giveaway<any>>}) - The giveaway to be considered as safe.
 *
 * @typedef {SafeGiveaway<TGiveaway>}
 * @template TGiveaway The giveaway to be considered as safe.
 */
/**
* Considers the specified giveaway 'that may be ended' and that is *not* safe to edit its data.
*
* Marks the following {@link Giveaway} methods as 'possibly undefined' to prevent them from running
* before performing the {@link Giveaway.isRunning()} type-guard check:
*
* - {@link Giveaway.end()}
* - {@link Giveaway.edit()}
* - {@link Giveaway.extend()}
* - {@link Giveaway.reduce()}
* - {@link Giveaway.setPrize()}
* - {@link Giveaway.setWinnersCount()}
* - {@link Giveaway.setTime()}
* - {@link Giveaway.setHostMemberID()}
*
* Type parameters:
*
* - `TGiveaway` ({@link Giveaway<any>} | {@link SafeGiveaway<Giveaway<any>>}) - The giveaway to be considered as unsafe.
*
* @typedef {UnsafeGiveaway<TGiveaway>}
* @template TGiveaway The giveaway to be considered as unsafe.
*/
/**
 * Returns a length of a string on type level.
 *
 * Type parameters:
 *
 * - `S` ({@link string}) - The string to check the length of.
 *
 * @template S The string to check the length of.
 * @typedef {number} StringLength<S>
 */
/**
* Conditional type that will return the specified string if it matches the specified length.
*
* Type parameters:
*
* - `N` ({@link number}) - The string length to match to.
* - `S` ({@link string}) - The string to check the length of.
*
* @template N The string length to match to.
* @template S The string to check the length of.
*
* @typedef {number} ExactLengthString<N, S>
*/
/**
* Conditional type that will return the specified string if it matches any of the possible Discord ID string lengths.
*
* Type parameters:
*
* - `S` ({@link string}) - The string to check the length of.
*
* @template S The string to check the length of.
* @typedef {number} DiscordID<ID>
*/
/**
 * Extracts the type that was passed into `Promise<...>` type.
 *
 * Type parameters:
 *
 * - `P` ({@link Promise<any>}) - The Promise to extract the type from.
 *
 * @template P The Promise to extract the type from.
 * @typedef {any} ExtractPromisedType<P>
 */
// Events, for documentation purposes
/**
 * Emits when the {@link Giveaways} module is ready.
 * @event Giveaways#ready
 * @param {Giveaways<DatabaseType, TDatabaseKey, TDatabaseValue>} giveaways Initialized {@link Giveaways} instance.
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
