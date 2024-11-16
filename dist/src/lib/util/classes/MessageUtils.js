"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUtils = void 0;
const discord_js_1 = require("discord.js");
const giveawayTemplate_1 = require("../../../structures/giveawayTemplate");
const TypedObject_1 = require("./TypedObject");
/**
 * Message utils class.
 */
class MessageUtils {
    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    _client;
    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     */
    _giveaways;
    /**
     * Message utils class constructor.
     * @param {Giveaways<DatabaseType>} giveaways {@link Giveaways} instance.
     */
    constructor(giveaways) {
        /**
         * Discord Client.
         * @type {Client<boolean>}
         */
        this._giveaways = giveaways;
        /**
         * {@link Giveaways} instance.
         * @type {Giveaways<DatabaseType>}
         */
        this._client = giveaways.client;
    }
    /**
     * Creates a new message embed based on giveaway and specified embed strings.
     * @param {IGiveaway} giveaway Raw giveaway object to get the values from.
     * @param {IGiveawayEmbedOptions} newEmbedStrings String values object to use in the embed.
     * @param {string[]} winners Array of winners to replace the {winners} statements with.
     * @returns {EmbedBuilder} Generated message embed.
     */
    buildGiveawayEmbed(giveaway, newEmbedStrings, winners) {
        const embedStrings = newEmbedStrings
            ? { ...newEmbedStrings }
            : { ...giveaway.messageProps?.embeds?.start || {} };
        for (const stringKey in embedStrings) {
            const strings = embedStrings;
            strings[stringKey] = (0, giveawayTemplate_1.replaceGiveawayKeys)(strings[stringKey], giveaway, winners);
        }
        if (embedStrings.timestamp) {
            embedStrings.timestamp = parseInt(embedStrings.timestamp);
        }
        const { title, titleIcon, color, titleURL, description, footer, footerIcon, imageURL, thumbnailURL, timestamp, } = embedStrings;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            // discord.js is only accepting "null" for empty value
            // even though here it's missing in library's typings :/
            name: title || null,
            iconURL: titleIcon,
            url: titleURL
        })
            .setDescription(description || `**${giveaway.prize}** giveaway has started with **${giveaway.entriesCount}** entries! ` +
            'Press the button below to join!')
            .setColor(color || '#d694ff')
            .setImage(imageURL || null)
            .setThumbnail(thumbnailURL || null)
            .setFooter({
            // discord.js is only accepting "null" for empty value
            // even though here it's missing in library's typings :/
            text: footer || null,
            iconURL: footerIcon
        });
        if (timestamp) {
            const date = new Date(timestamp);
            if (date.getFullYear() < 2000) {
                embed.setTimestamp(timestamp * 1000);
            }
            else {
                embed.setTimestamp(timestamp);
            }
        }
        return embed;
    }
    /**
     * Creates a buttons row based on the specified "join giveaway" button object.
     * @param {IGiveawayButtonOptions} joinGiveawayButton String values object to use in the button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildButtonsRow(joinGiveawayButton) {
        const joinGiveawayButtonBuilder = new discord_js_1.ButtonBuilder({
            customId: 'joinGiveawayButton',
            emoji: joinGiveawayButton?.emoji || '🎉',
            style: joinGiveawayButton?.style || discord_js_1.ButtonStyle.Primary
        });
        if (joinGiveawayButton?.text !== null) {
            joinGiveawayButtonBuilder.setLabel(joinGiveawayButton?.text || 'Join the giveaway');
        }
        const buttonsRow = new discord_js_1.ActionRowBuilder()
            .addComponents(joinGiveawayButtonBuilder);
        return buttonsRow;
    }
    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {IGiveawayButtonOptions} rerollButton String values object to use in the "reroll" button.
     * @param {ILinkButton} [goToMessageButton] String values object to use in the "go to message" button.
     * @param {string} [giveawayMessageURL] Giveaway message URL to be set in the "go to message" button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildGiveawayFinishedButtonsRow(rerollButton, goToMessageButton, giveawayMessageURL) {
        const buttonsRow = new discord_js_1.ActionRowBuilder();
        goToMessageButton ? buttonsRow.addComponents(new discord_js_1.ButtonBuilder({
            customId: 'rerollButton',
            label: rerollButton?.text || 'Reroll',
            emoji: rerollButton?.emoji || '🔁',
            style: rerollButton?.style || discord_js_1.ButtonStyle.Primary
        }), new discord_js_1.ButtonBuilder({
            label: goToMessageButton?.text || 'Go to Message',
            emoji: goToMessageButton?.emoji || '↗️',
            style: discord_js_1.ButtonStyle.Link,
            url: giveawayMessageURL
        })) : buttonsRow.addComponents(new discord_js_1.ButtonBuilder({
            customId: 'rerollButton',
            label: rerollButton?.text || 'Reroll',
            emoji: rerollButton?.emoji || '🔁',
            style: rerollButton?.style || discord_js_1.ButtonStyle.Primary
        }));
        return buttonsRow;
    }
    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {IGiveawayButtonOptions} rerollButton String values object to use in the "reroll" button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildGiveawayRerollButtonRow(rerollButton) {
        const buttonsRow = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder({
            customId: 'rerollButton',
            label: rerollButton?.text || 'Reroll',
            emoji: rerollButton?.emoji || '🔁',
            style: rerollButton?.style || discord_js_1.ButtonStyle.Primary
        }));
        return buttonsRow;
    }
    /**
     * Creates a buttons row based on the specified "go to message" button objects.
     * @param {ILinkButton} goToMessageButton String values object to use in the "go to message" link button.
     * @param {string} giveawayMessageURL Giveaway message URL to be set in the "go to message" button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildGiveawayFinishedButtonsRowWithoutRerollButton(goToMessageButton, giveawayMessageURL) {
        const buttonsRow = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder({
            label: goToMessageButton?.text || 'Go to Message',
            emoji: goToMessageButton?.emoji || '↗️',
            style: discord_js_1.ButtonStyle.Link,
            url: giveawayMessageURL
        }));
        return buttonsRow;
    }
    /**
     * Edits the giveaway message on giveaway entry.
     * @param {IGiveaway} giveaway Raw giveaway object.
     * @returns {Promise<void>}
     */
    async editEntryGiveawayMessage(giveaway) {
        const embedStrings = giveaway.messageProps?.embeds?.start || {};
        const channel = this._client.channels.cache.get(giveaway.channelID);
        const embed = this.buildGiveawayEmbed(giveaway);
        const buttonsRow = this.buildButtonsRow(giveaway.messageProps?.buttons.joinGiveawayButton);
        const message = await channel.messages.fetch(giveaway.messageID);
        await message.edit({
            content: embedStrings?.messageContent,
            embeds: TypedObject_1.TypedObject.keys(embedStrings).length == 1 &&
                embedStrings?.messageContent
                ? [] : [embed],
            components: [buttonsRow]
        });
    }
    /**
     * Edits the giveaway message on giveaway finish.
     * @param {IGiveaway} giveaway Raw giveaway object.
     * @param {string[]} winners Array of giveaway winners.
     * @param {IGiveawayEmbedOptions} customEmbedStrings Embed options to use instead of `finish` embed.
     * @param {boolean} sendWinnersMessage Determines if the separated winners message should be sent.
     * @returns {Promise<void>}
     */
    async editFinishGiveawayMessage(giveaway, winners, customEmbedStrings, sendWinnersMessage = true, endEmbedStrings) {
        const embedStrings = giveaway.messageProps?.embeds?.finish;
        const finishEmbedStrings = customEmbedStrings || embedStrings?.newGiveawayMessage || {};
        const noWinnersEmbedStrings = giveaway.messageProps?.embeds?.finish
            ?.noWinnersNewGiveawayMessage || {};
        const channel = this._client.channels.cache.get(giveaway.channelID);
        const finishDefaultedEmbedStrings = {
            ...finishEmbedStrings,
            color: finishEmbedStrings?.color || '#d694ff',
            description: finishEmbedStrings?.description || 'Giveaway is over!'
        };
        const noWinnersDefaultedEmbedStrings = {
            ...finishEmbedStrings,
            color: noWinnersEmbedStrings?.color || '#d694ff',
            description: noWinnersEmbedStrings?.description || 'There are no winners in this giveaway!'
        };
        const winnersCondition = winners.length >= this._giveaways.options.minGiveawayEntries;
        const defaultedEmbedStrings = winnersCondition ? finishDefaultedEmbedStrings : noWinnersDefaultedEmbedStrings;
        const finishEmbed = this.buildGiveawayEmbed(giveaway, defaultedEmbedStrings, winners);
        const giveawayEndEmbed = this.buildGiveawayEmbed(giveaway, winnersCondition
            ? (embedStrings?.endMessage || embedStrings?.newGiveawayMessage || {})
            : embedStrings?.noWinnersEndMessage || {}, winners);
        const goToMessageButtonRow = this.buildGiveawayFinishedButtonsRowWithoutRerollButton(giveaway.messageProps?.buttons.goToMessageButton, giveaway.messageURL);
        const rerollButtonRow = this.buildGiveawayRerollButtonRow(giveaway.messageProps?.buttons.rerollButton);
        const message = await channel.messages.fetch(giveaway.messageID);
        const giveawayMessageContent = defaultedEmbedStrings.messageContent;
        const finishMessageContent = (0, giveawayTemplate_1.replaceGiveawayKeys)(winnersCondition
            ? endEmbedStrings?.messageContent || embedStrings?.endMessage.messageContent || 'Giveaway is over!'
            : embedStrings?.noWinnersEndMessage?.messageContent || 'There was no winners in this giveaway!', giveaway, winners);
        const finishInputObjectKeys = winnersCondition
            ? TypedObject_1.TypedObject.keys(embedStrings?.endMessage)
            : TypedObject_1.TypedObject.keys(embedStrings?.noWinnersEndMessage);
        await message.edit({
            content: giveawayMessageContent,
            embeds: TypedObject_1.TypedObject.keys(defaultedEmbedStrings).length == 1 && giveawayMessageContent ? [] : [finishEmbed],
            components: winnersCondition ? [rerollButtonRow] : []
        });
        if (sendWinnersMessage) {
            await message.reply({
                content: finishMessageContent,
                embeds: finishInputObjectKeys.length == 1 && finishMessageContent ? [] : [giveawayEndEmbed],
                components: [goToMessageButtonRow]
            });
        }
    }
}
exports.MessageUtils = MessageUtils;
