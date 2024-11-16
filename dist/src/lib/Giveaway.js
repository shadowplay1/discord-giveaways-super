"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giveaway = void 0;
const giveaway_interface_1 = require("./giveaway.interface");
const time_function_1 = require("./util/functions/time.function");
const MessageUtils_1 = require("./util/classes/MessageUtils");
const TypedObject_1 = require("./util/classes/TypedObject");
const GiveawaysError_1 = require("./util/classes/GiveawaysError");
const giveawayTemplate_1 = require("../structures/giveawayTemplate");
/**
 * Class that represents the Giveaway object.
 *
 * Type parameters:
 *
 * - `TDatabaseType` ({@link DatabaseType}) - The database type that is used.
 *
 * @implements {Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID' | 'entries'>}
 * @template TDatabaseType The database type that is used.
 */
class Giveaway {
    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     * @private
     */
    _giveaways;
    /**
     * Message utils instance.
     * @type {MessageUtils}
     * @private
     */
    _messageUtils;
    /**
     * Input giveaway object.
     * @type {IGiveaway}
     * @private
     */
    _inputGiveaway;
    /**
     * Giveaway ID.
     * @type {number}
     */
    id;
    /**
     * Giveaway prize.
     * @type {string}
     */
    prize;
    /**
     * Giveaway time.
     * @type {string}
     */
    time;
    /**
     * Giveaway state.
     * @type {GiveawayState}
     */
    state;
    /**
     * Number of possible winnersIDs in the giveaway.
     * @type {number}
     */
    winnersCount;
    /**
     * Giveaway start timestamp.
     * @type {number}
     */
    startTimestamp;
    /**
     * Giveaway end timestamp.
     * @type {number}
     */
    endTimestamp;
    /**
     * Timestamp when the giveaway was ended.
     * @type {number}
     */
    endedTimestamp;
    /**
     * Giveaway message ID.
     * @type {DiscordID<string>}
     */
    messageID;
    /**
     * Giveaway message URL.
     * @type {string}
     */
    messageURL;
    /**
     * Guild where the giveaway was created.
     * @type {Guild}
     */
    guild;
    /**
     * User who created the giveaway.
     * @type {User}
     */
    host;
    /**
     * Channel where the giveaway was created.
     * @type {TextChannel}
     */
    channel;
    /**
     * Number of users who have joined the giveaway.
     * @type {number}
     */
    entriesCount;
    /**
     * Set of IDs of users who have joined the giveaway.
     * @type {Set<DiscordID<string>>}
     */
    entries = new Set();
    /**
     * Array of used ID who have won in the giveaway.
     *
     * Don't confuse this property with `winnersCount`, the setting that dertermines how many users can win in the giveaway.
     * @type {Set<DiscordID<string>>}
     */
    winners = new Set();
    /**
     * Determines if the giveaway was ended in database.
     * @type {boolean}
     */
    isEnded;
    /**
     * An object with conditions for members to join the giveaway.
     * @type {?IParticipantsFilter}
     */
    participantsFilter = {};
    /**
     * Message data properties for embeds and buttons.
     * @type {?IGiveawayMessageProps}
     */
    messageProps;
    /**
     * Giveaway constructor.
     * @param {Giveaways<TDatabaseType>} giveaways {@link Giveaways} instance.
     * @param {IGiveaway} giveaway Input {@link Giveaway} object.
     */
    constructor(giveaways, giveaway) {
        /**
         * {@link Giveaways} instance.
         * @type {Giveaways<DatabaseType>}
         * @private
         */
        this._giveaways = giveaways;
        /**
         * Message utils instance.
         * @type {MessageUtils}
         * @private
         */
        this._messageUtils = new MessageUtils_1.MessageUtils(giveaways);
        /**
         * Input giveaway object.
         * @type {IGiveaway}
         */
        this._inputGiveaway = giveaway;
        /**
         * Giveaway ID.
         * @type {number}
         */
        this.id = giveaway.id;
        /**
         * Giveaway prize.
         * @type {string}
         */
        this.prize = giveaway.prize;
        /**
         * Giveaway time.
         * @type {string}
         */
        this.time = giveaway.time;
        /**
         * Giveaway state.
         * @type {GiveawayState}
         */
        this.state = giveaway.state;
        /**
         * Number of possible winners in the giveaway.
         * @type {number}
         */
        this.winnersCount = giveaway.winnersCount;
        /**
         * Giveaway start timestamp.
         * @type {number}
         */
        this.startTimestamp = giveaway.startTimestamp;
        /**
         * Giveaway end timestamp.
         * @type {number}
         */
        this.endTimestamp = giveaway.endTimestamp;
        /**
         * Giveaway end timestamp.
         * @type {number}
         */
        this.endedTimestamp = giveaway.endedTimestamp;
        /**
         * Giveaway message ID.
         * @type {DiscordID<string>}
         */
        this.messageID = giveaway.messageID;
        /**
         * Guild where the giveaway was created.
         * @type {Guild}
         */
        this.guild = this._giveaways.client.guilds.cache.get(giveaway.guildID);
        /**
         * User who created the giveaway.
         * @type {User}
         */
        this.host = this._giveaways.client.users.cache.get(giveaway.hostMemberID);
        /**
         * Channel where the giveaway was created.
         * @type {TextChannel}
         */
        this.channel = this._giveaways.client.channels.cache.get(giveaway.channelID);
        /**
         * Giveaway message URL.
         * @type {string}
         */
        this.messageURL = giveaway.messageURL || '';
        /**
         * Determines if the giveaway was ended in database.
         * @type {boolean}
         */
        this.isEnded = giveaway.isEnded || false;
        /**
         * Set of IDs of users who have joined the giveaway.
         * @type {Set<DiscordID<string>>}
         */
        this.entries = new Set(giveaway.entries);
        /**
         * Set of used ID who have won in the giveaway.
         *
         * Don't confuse this property with `winnersCount`,
         * the **giveaway configuration setting** that
         * dertermines how many users can win in the giveaway.
         * @type {Set<DiscordID<string>>}
         */
        this.winners = new Set(giveaway.winners);
        /**
         * Number of users who have joined the giveaway.
         * @type {number}
         */
        this.entriesCount = giveaway.entries?.length || 0;
        /**
         * An object with conditions for members to join the giveaway.
         * @type {?IParticipantsFilter}
         */
        this.participantsFilter = giveaway.participantsFilter;
        /**
         * Message data properties for embeds and buttons.
         * @type {IGiveawayMessageProps}
         */
        this.messageProps = giveaway.messageProps || {
            embeds: {
                start: {},
                joinGiveawayMessage: {},
                leaveGiveawayMessage: {},
                finish: {
                    endMessage: {},
                    newGiveawayMessage: {},
                    noWinnersNewGiveawayMessage: {},
                    noWinnersEndMessage: {}
                },
                reroll: {
                    newGiveawayMessage: {},
                    onlyHostCanReroll: {},
                    rerollMessage: {},
                    successMessage: {}
                },
                restrictionsMessages: {
                    hasNoRequiredRoles: {},
                    hasRestrictedRoles: {},
                    memberRestricted: {}
                }
            },
            buttons: {
                joinGiveawayButton: {},
                goToMessageButton: {},
                rerollButton: {}
            }
        };
    }
    /**
     * Determines if the giveaway's time is up or if the giveaway was ended forcefully.
     * @type {boolean}
     */
    get isFinished() {
        return (this.state !== giveaway_interface_1.GiveawayState.STARTED || Date.now() > this.endTimestamp * 1000) || this.isEnded;
    }
    /**
     * Raw giveaway object.
     * @type {IGiveaway}
     */
    get raw() {
        const entries = [...this.entries];
        this._inputGiveaway.entries = entries;
        return this._inputGiveaway;
    }
    /**
     * [TYPE GUARD FUNCTION] - Determines if the giveaway is running
     * and allows to perform actions if it is.
     * @returns {boolean} Whether the giveaway is running.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `extend` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.extend('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.extend('10s') // we know that giveaway is running - the method is safe to run
     */
    isRunning() {
        return !this.isFinished;
    }
    /**
     * Restarts the giveaway.
     * @returns {Promise<void>}
     */
    async restart() {
        await this._fetchUncached();
        const { giveawayIndex } = this._getFromCache(this.guild.id);
        this.isEnded = false;
        this.raw.isEnded = false;
        this.endTimestamp = Math.floor((Date.now() + (0, time_function_1.convertTimeToMilliseconds)(this.time)) / 1000);
        this.raw.endTimestamp = Math.floor((Date.now() + (0, time_function_1.convertTimeToMilliseconds)(this.time)) / 1000);
        const strings = this.messageProps;
        const startEmbedStrings = strings?.embeds.start || {};
        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings);
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton || {});
        const message = await this.channel.messages.fetch(this.messageID);
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw);
        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: TypedObject_1.TypedObject.keys(startEmbedStrings).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        });
        this._giveaways.emit('giveawayRestart', this);
    }
    /**
     * Extends the giveaway length.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} extensionTime The time to extend the giveaway length by.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `extend` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.extend('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.extend('10s') // we know that giveaway is running - the method is safe to run
     */
    async extend(extensionTime) {
        await this._fetchUncached();
        const { giveaway, giveawayIndex } = this._getFromCache(this.guild.id);
        if (!extensionTime) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('extensionTime', 'Giveaways.extend'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof extensionTime !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('extensionTime', 'string', extensionTime), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (this.isEnded) {
            throw new GiveawaysError_1.GiveawaysError('Cannot extend the giveaway\'s length: '
                + GiveawaysError_1.errorMessages.GIVEAWAY_ALREADY_ENDED(giveaway.prize, giveaway.id), GiveawaysError_1.GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED);
        }
        this.endTimestamp = this.endTimestamp + this._timeToSeconds(extensionTime);
        this.raw.endTimestamp = this.endTimestamp + this._timeToSeconds(extensionTime);
        const strings = this.messageProps;
        const startEmbedStrings = strings?.embeds.start || {};
        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings);
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton || {});
        const message = await this.channel.messages.fetch(this.messageID);
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw);
        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: TypedObject_1.TypedObject.keys(startEmbedStrings).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        });
        this._giveaways.emit('giveawayLengthExtend', {
            time: extensionTime,
            giveaway: this
        });
    }
    /**
     * Reduces the giveaway length.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} reductionTime The time to reduce the giveaway length by.
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_TIME` - if invalid time string was specified,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `reduce` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.reduce('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.reduce('10s') // we know that giveaway is running - the method is safe to run
     */
    async reduce(reductionTime) {
        await this._fetchUncached();
        const { giveaway, giveawayIndex } = this._getFromCache(this.guild.id);
        if (!reductionTime) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('reductionTime', 'Giveaways.extend'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof reductionTime !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('reductionTime', 'string', reductionTime), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (this.isEnded) {
            throw new GiveawaysError_1.GiveawaysError('Cannot reduce the giveaway\'s length: '
                + GiveawaysError_1.errorMessages.GIVEAWAY_ALREADY_ENDED(giveaway.prize, giveaway.id), GiveawaysError_1.GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED);
        }
        this.endTimestamp = this.endTimestamp - this._timeToSeconds(reductionTime);
        this.raw.endTimestamp = this.endTimestamp - this._timeToSeconds(reductionTime);
        const strings = this.messageProps;
        const startEmbedStrings = strings?.embeds.start || {};
        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings);
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton || {});
        const message = await this.channel.messages.fetch(this.messageID);
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw);
        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: TypedObject_1.TypedObject.keys(startEmbedStrings).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        });
        this._giveaways.emit('giveawayLengthReduce', {
            time: reductionTime,
            giveaway: this
        });
    }
    /**
     * Ends the giveaway.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @returns {Promise<void>}
     *
     * @throws {GiveawaysError} `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `end` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.end()
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.end() // we know that giveaway is running - the method is safe to run
     */
    async end() {
        await this._fetchUncached();
        const { giveaway, giveawayIndex } = this._getFromCache(this.guild.id);
        const winnersIDs = this._pickWinners(giveaway);
        if (this.isEnded) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.GIVEAWAY_ALREADY_ENDED(giveaway.prize, giveaway.id), GiveawaysError_1.GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED);
        }
        const endedTimestamp = Date.now();
        this.isEnded = true;
        this.raw.isEnded = true;
        this.winners = new Set(winnersIDs.map(winnerID => winnerID.slice(2, -1)));
        this.raw.winners = winnersIDs.map(winnerID => winnerID.slice(2, -1));
        this.endedTimestamp = endedTimestamp;
        this.raw.endedTimestamp = endedTimestamp;
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw);
        this._messageUtils.editFinishGiveawayMessage(this.raw, winnersIDs, this.messageProps?.embeds.finish?.newGiveawayMessage);
        this._giveaways.emit('giveawayEnd', this);
    }
    /**
     * Redraws the giveaway winners
     * @returns {Promise<string[]>} Rerolled winners users IDs.
     */
    async reroll() {
        await this._fetchUncached();
        const { giveaway, giveawayIndex } = this._getFromCache(this.guild.id);
        const winnersIDs = this._pickWinners(giveaway);
        const rerollEmbedStrings = giveaway.messageProps?.embeds?.reroll;
        const rerollMessage = rerollEmbedStrings?.rerollMessage || {};
        for (const key in rerollMessage) {
            rerollMessage[key] = (0, giveawayTemplate_1.replaceGiveawayKeys)(rerollMessage[key], this, winnersIDs);
        }
        const rerolledEmbed = this._messageUtils.buildGiveawayEmbed(this.raw, rerollMessage, winnersIDs);
        const giveawayMessage = await this.channel.messages.fetch(this.messageID);
        this.winners = new Set(winnersIDs.map(winnerID => winnerID.slice(2, -1)));
        this.raw.winners = winnersIDs.map(winnerID => winnerID.slice(2, -1));
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw);
        this._messageUtils.editFinishGiveawayMessage(this.raw, winnersIDs, rerollEmbedStrings?.newGiveawayMessage, false, rerollEmbedStrings?.successMessage);
        giveawayMessage.reply({
            content: rerollMessage?.messageContent,
            embeds: TypedObject_1.TypedObject.keys(rerollMessage).length === 1 && rerollMessage?.messageContent ? [] : [rerolledEmbed]
        });
        this._giveaways.emit('giveawayReroll', {
            newWinners: winnersIDs,
            giveaway: this
        });
        return winnersIDs;
    }
    /**
     * Adds the user ID into the giveaway entries.
     * @param {DiscordID<string>} guildID The guild ID where the giveaway is hosted.
     * @param {DiscordID<string>} userID The user ID to add.
     * @returns {IGiveaway} Updated giveaway object.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    addEntry(guildID, userID) {
        if (!guildID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaway.addEntry'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!userID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('userID', 'Giveaway.addEntry'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof guildID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('guildID', 'string', guildID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof userID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('userID', 'string', userID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const { giveaway, giveawayIndex } = this._getFromCache(guildID);
        this.entries.add(userID);
        giveaway.entries.push(userID);
        giveaway.entriesCount = this.entries.size;
        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw);
        return giveaway;
    }
    /**
     * Adds the user ID into the giveaway entries.
     * @param {DiscordID<string>} guildID The guild ID where the giveaway is hosted.
     * @param {DiscordID<string>} userID The user ID to add.
     * @returns {IGiveaway} Updated giveaway object.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    removeEntry(guildID, userID) {
        if (!guildID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaway.removeEntry'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!userID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('userID', 'Giveaway.removeEntry'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof guildID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('guildID', 'string', guildID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (typeof userID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('userID', 'string', userID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const { giveaway, giveawayIndex } = this._getFromCache(guildID);
        this.entries.delete(userID);
        giveaway.entries.splice(giveaway.entries.indexOf(userID), 1);
        giveaway.entriesCount = this.entries.size;
        this.sync(giveaway);
        this._giveaways.database.pull(`${guildID}.giveaways`, giveawayIndex, this.raw);
        return giveaway;
    }
    /**
     * Changes the giveaway's prize and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} prize The new prize to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setPrize` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setPrize('My New Prize')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setPrize('My New Prize') // we know that giveaway is running - the method is safe to run
     */
    async setPrize(prize) {
        if (!prize) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('prize', 'Giveaways.setPrize'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof prize !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('prize', 'string', prize), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        return this.edit('prize', prize);
    }
    /**
     * Changes the giveaway's winners count and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} winnersCount The new winners count to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid, `INVALID_INPUT` - when the input value is bad or invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setWinnersCount` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setWinnersCount(2)
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setWinnersCount(2) // we know that giveaway is running - the method is safe to run
     */
    async setWinnersCount(winnersCount) {
        if (winnersCount == null || winnersCount == undefined) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('winnersCount', 'Giveaways.setWinnersCount'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (isNaN(winnersCount)) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('winnersCount', 'number', winnersCount.toString()), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (winnersCount <= 0) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_INPUT('winnersCount', 'Giveaways.setWinnersCount', 'winners count cannot be less or equal 0'), GiveawaysError_1.GiveawaysErrorCodes.INVALID_INPUT);
        }
        return this.edit('winnersCount', winnersCount);
    }
    /**
     * Changes the giveaway's host member ID and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {DiscordID<string>} hostMemberID The new host member ID to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setHostMemberID` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setHostMemberID('123456789012345678')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setHostMemberID('123456789012345678') // we know that giveaway is running - the method is safe to run
     */
    async setHostMemberID(hostMemberID) {
        if (!hostMemberID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('hostMemberID', 'Giveaways.setHostMemberID'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof hostMemberID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('hostMemberID', 'string', hostMemberID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        return this.edit('hostMemberID', hostMemberID);
    }
    /**
     * Changes the giveaway's time and edits the giveaway message.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} time The new time to set.
     * @returns {Promise<Giveaway<TDatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `setTime` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.setTime('10s')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.setTime('10s') // we know that giveaway is running - the method is safe to run
     */
    async setTime(time) {
        if (!time) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('time', 'Giveaways.setTime'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof time !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('time', 'string', time), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        return this.edit('time', time);
    }
    /**
     * Sets the specified value to the specified giveaway property and edits the giveaway message.
     *
     * Type parameters:
     *
     * - `TProperty` ({@link EditableGiveawayProperties}) - Giveaway property to pass in.
     *
     * [!!!] To be able to run this method, you need to perform a type-guard check
     *
     * [!!!] using the {@link Giveaway.isRunning()} method. (see the example below)
     *
     * @param {string} key The key of the giveaway object to set.
     * @param {string} value The value to set.
     * @returns {Promise<Giveaway<DatabaseType>>} Updated {@link Giveaway} instance.
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid,
     * `GIVEAWAY_ALREADY_ENDED` - if the target giveaway has already ended.
     *
     * @template TProperty Giveaway property to pass in.
     *
     * @example
     *
     * const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(giveaway => giveaway.id == giveawayID)
     *
     * // we don't know if the giveaway is running,
     * // so the method is unsafe to run - `edit` will be marked as "possibly undefined"
     * // to prevent it from running before the check below
     * giveaway.edit('prize', 'My New Prize')
     *
     * // checking if the giveaway is running
     * if (!giveaway.isRunning()) {
     *     return console.log(`Giveaway "${giveaway.prize}" has already ended.`)
     * }
     *
     * giveaway.edit('prize', 'My New Prize') // we know that giveaway is running - the method is safe to run
     */
    async edit(key, value) {
        const { giveawayIndex } = this._getFromCache(this.guild.id);
        if (!key) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('key', 'Giveaways.edit'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!value) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('value', 'Giveaways.edit'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof key !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('key', 'string', key), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        if (this.isEnded) {
            throw new GiveawaysError_1.GiveawaysError('Cannot edit the giveaway: '
                + GiveawaysError_1.errorMessages.GIVEAWAY_ALREADY_ENDED(this.prize, this.id), GiveawaysError_1.GiveawaysErrorCodes.GIVEAWAY_ALREADY_ENDED);
        }
        const strings = this.messageProps;
        const startEmbedStrings = strings?.embeds.start || {};
        const oldRawGiveaway = { ...this.raw };
        const oldValue = oldRawGiveaway[key];
        if (key == 'hostMemberID') {
            const newGiveawayHostUserID = value;
            const newGiveawayHost = this._giveaways.client.users.cache.get(newGiveawayHostUserID);
            if (!newGiveawayHost) {
                throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.USER_NOT_FOUND(newGiveawayHostUserID), GiveawaysError_1.GiveawaysErrorCodes.USER_NOT_FOUND);
            }
            for (const key in startEmbedStrings) {
                if (typeof startEmbedStrings[key] == 'string') {
                    startEmbedStrings[key] = startEmbedStrings[key]
                        .replaceAll(this.host.username, newGiveawayHost.username)
                        .replaceAll(this.host.discriminator, newGiveawayHost.discriminator)
                        .replaceAll(this.host.tag, newGiveawayHost.tag)
                        .replaceAll(this.host.avatar, newGiveawayHost.avatar)
                        .replaceAll(this.host.defaultAvatarURL, newGiveawayHost.defaultAvatarURL)
                        .replaceAll(this.host.bot.toString(), newGiveawayHost.bot.toString())
                        .replaceAll(this.host.system.toString(), newGiveawayHost.system.toString())
                        .replaceAll(this.host.banner, newGiveawayHost.banner)
                        .replaceAll(this.host.createdAt.toString(), newGiveawayHost.createdAt.toString())
                        .replaceAll(this.host.createdTimestamp.toString(), newGiveawayHost.createdTimestamp.toString())
                        .replaceAll(this.host.id, newGiveawayHost.id);
                }
            }
            this.host = newGiveawayHost;
            this.raw.hostMemberID = newGiveawayHostUserID;
        }
        else if (key == 'time') {
            const time = value;
            this.time = time;
            this.raw.time = time;
            this.endTimestamp = Math.floor((Date.now() + (0, time_function_1.convertTimeToMilliseconds)(time)) / 1000);
            this.raw.endTimestamp = Math.floor((Date.now() + (0, time_function_1.convertTimeToMilliseconds)(time)) / 1000);
        }
        else {
            const that = this;
            that[key] = value;
            this.raw[key] = value;
        }
        const embed = this._messageUtils.buildGiveawayEmbed(this.raw, startEmbedStrings);
        const buttonsRow = this._messageUtils.buildButtonsRow(strings?.buttons.joinGiveawayButton || {});
        const message = await this.channel.messages.fetch(this.messageID);
        this._giveaways.database.pull(`${this.guild.id}.giveaways`, giveawayIndex, this.raw);
        message.edit({
            content: startEmbedStrings?.messageContent,
            embeds: TypedObject_1.TypedObject.keys(startEmbedStrings).length == 1
                && startEmbedStrings?.messageContent ? [] : [embed],
            components: [buttonsRow]
        });
        this._giveaways.emit('giveawayEdit', {
            key,
            oldValue,
            newValue: value,
            giveaway: this
        });
        return this;
    }
    /**
     * Deletes the giveaway from database and deletes its message.
     * @returns {Promise<Giveaway<DatabaseType>>} Deleted {@link Giveaway} instance.
     */
    async delete() {
        const { giveawayIndex } = this._getFromCache(this.guild?.id || this.raw.guildID);
        const giveawayMessage = await this.channel.messages.fetch(this.messageID || this.raw.messageID);
        if (giveawayMessage.deletable) {
            giveawayMessage?.delete().catch(() => {
                return;
            });
        }
        else {
            giveawayMessage?.edit({
                content: '',
                embeds: [],
                components: []
            }).catch(() => {
                return;
            });
        }
        this._giveaways.database.pop(`${this.guild.id}.giveaways`, giveawayIndex);
        return this;
    }
    /**
     * Syncs the constructor properties with specified raw giveaway object.
     * @param {IGiveaway} giveaway Giveaway object to sync the constructor properties with.
     * @returns {void}
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    sync(giveaway) {
        const that = this;
        const specifiedGiveaway = giveaway;
        if (!giveaway) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('giveaway', 'Giveaway.sync'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof giveaway !== 'object') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('giveaway', 'object', giveaway), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        for (const key in giveaway) {
            that[key] = specifiedGiveaway[key];
            if (key == 'entries') {
                that[key] = new Set(specifiedGiveaway[key]);
            }
        }
        for (const key in giveaway) {
            that.raw[key] = specifiedGiveaway[key];
            if (key == 'entries') {
                that[key] = new Set(specifiedGiveaway[key]);
            }
        }
    }
    /**
     * Shuffles all the giveaway entries, randomly picks the winner user IDs and converts them into mentions.
     * @param {IGiveaway} [giveawayToSyncWith] The giveaway object to sync the {@link Giveaway} instance with.
     * @returns {string[]} Array of mentions of users who were picked as the winners.
     * @private
     */
    _pickWinners(giveawayToSyncWith) {
        const winnersIDs = [];
        if (giveawayToSyncWith) {
            this.sync(giveawayToSyncWith);
        }
        if (!this.entries.size) {
            return [];
        }
        const shuffledEntries = this._shuffleArray([...this.entries]);
        for (let i = 0; i < this.winnersCount; i++) {
            const recursiveShuffle = () => {
                const randomEntryIndex = Math.floor(Math.random() * shuffledEntries.length);
                const winnerUserID = shuffledEntries[randomEntryIndex];
                if (winnersIDs.includes(winnerUserID)) {
                    if (winnersIDs.length !== this.entries.size) {
                        recursiveShuffle();
                    }
                }
                else {
                    winnersIDs.push(winnerUserID);
                }
            };
            recursiveShuffle();
        }
        return winnersIDs.map(winnerID => `<@${winnerID}>`);
    }
    /**
     * Shuffles an array and returns it.
     *
     * Type parameters:
     *
     * - `T` - The type of array to shuffle.
     *
     * @param {any[]} arrayToShuffle The array to shuffle.
     * @returns {any[]} Shuffled array.
     * @private
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     *
     * @template T The type of array to shuffle.
     */
    _shuffleArray(arrayToShuffle) {
        if (!arrayToShuffle) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('arrayToShuffle', 'Giveaway._shuffleArray'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (!Array.isArray(arrayToShuffle)) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('arrayToShuffle', 'array', arrayToShuffle), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const shuffledArray = [...arrayToShuffle];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }
    /**
     * Gets the giveaway data and its index in guild giveaways array from database.
     * @param {DiscordID<string>} guildID Guild ID to get the giveaways array from.
     * @returns {IDatabaseArrayGiveaway} Database giveaway object.
     * @private
     *
     * @throws {GiveawaysError} `REQUIRED_ARGUMENT_MISSING` - when required argument is missing,
     * `INVALID_TYPE` - when argument type is invalid.
     */
    _getFromCache(guildID) {
        if (!guildID) {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.REQUIRED_ARGUMENT_MISSING('guildID', 'Giveaway._getFromCache'), GiveawaysError_1.GiveawaysErrorCodes.REQUIRED_ARGUMENT_MISSING);
        }
        if (typeof guildID !== 'string') {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.errorMessages.INVALID_TYPE('guildID', 'string', guildID), GiveawaysError_1.GiveawaysErrorCodes.INVALID_TYPE);
        }
        const giveaways = this._giveaways.database.get(`${guildID}.giveaways`) || [];
        const giveawayIndex = giveaways.findIndex(giveaway => giveaway.id == this.id);
        const giveaway = giveaways[giveawayIndex];
        this.sync(giveaway);
        return {
            giveaway,
            giveawayIndex
        };
    }
    /**
     * Converts the time string into seconds.
     * @param {string} time The time string to convert.
     * @returns {number} Converted time string into seconds.
     * @private
     *
     * @throws {GiveawaysError} `INVALID_TIME` - if invalid time string was specified.
     */
    _timeToSeconds(time) {
        try {
            const milliseconds = (0, time_function_1.convertTimeToMilliseconds)(time);
            return Math.floor(milliseconds / 1000 / 2);
        }
        catch {
            throw new GiveawaysError_1.GiveawaysError(GiveawaysError_1.GiveawaysErrorCodes.INVALID_TIME);
        }
    }
    /**
     * Fetches the objects of guild, host user and giveaway channel
     * directly from Discord API if something is not present in the cache.
     * @returns {Promise<void>}
     * @private
     */
    async _fetchUncached() {
        const { guildID, hostMemberID, channelID } = this.raw;
        const printErrorAndDeleteGiveaway = async (dataFailedToFetch) => {
            this._giveaways.logger.error(`Unable to fetch the giveaway ${dataFailedToFetch} info. Cannot proceed with operation!!`);
            this._giveaways.logger.info('Unprocessable Giveaway Info:');
            this._giveaways.logger.info(`Giveaway ID: ${this.id}`);
            this._giveaways.logger.info(`Giveaway prize: "${this.prize}", entries count: ${this.entriesCount}.`);
            this._giveaways.logger.info(`Giveaway entries count: ${this.entriesCount}.`);
            this._giveaways.logger.info();
            this._giveaways.logger.info(`Giveaway Guild ID: ${guildID}`);
            this._giveaways.logger.info(`Giveaway Host Memebr ID: ${hostMemberID}`);
            this._giveaways.logger.info(`Giveaway Channel ID: ${channelID}`);
            this._giveaways.logger.warn('Forcefully deleting the giveaway...');
            await this.delete().catch((err) => {
                this._giveaways.logger.error(`Failed to delete the unprorcessable giveaway: ${err.name}: ${err.message}`);
            });
            this._giveaways.logger.warn();
            this._giveaways.logger.warn('Unprocessable giveaway was deleted.');
        };
        if (!this.guild) {
            const fetched = await this._giveaways.client.guilds.fetch(guildID).catch(() => {
                return null;
            });
            if (!fetched) {
                await printErrorAndDeleteGiveaway('guild');
                return;
            }
            this.guild = fetched;
        }
        if (!this.host) {
            const fetched = await this._giveaways.client.users.fetch(hostMemberID).catch(() => {
                return null;
            });
            if (!fetched) {
                await printErrorAndDeleteGiveaway('host member');
                return;
            }
            this.host = fetched;
        }
        if (!this.channel) {
            const fetched = await this._giveaways.client.channels.fetch(channelID).catch(() => {
                return null;
            });
            if (!fetched) {
                await printErrorAndDeleteGiveaway('channel');
                return;
            }
            this.channel = fetched;
        }
    }
    /**
     * Converts the {@link Giveaway} instance to a plain object representation.
     * @returns {IGiveaway} Plain object representation of {@link Giveaway} instance.
     */
    toJSON() {
        return this.raw;
    }
}
exports.Giveaway = Giveaway;
