import {
    ActionRowBuilder, ButtonBuilder,
    ButtonStyle, Client,
    EmbedBuilder, TextChannel
} from 'discord.js'

import { IGiveawayEmbedOptions, IGiveawayButtonOptions, ILinkButton } from '../../../types/configurations'
import { IGiveaway } from '../../giveaway.interface'

import { replaceGiveawayKeys } from '../../../structures/giveawayTemplate'
import { Giveaways } from '../../../Giveaways'

/**
 * Message utils class.
 */
export class MessageUtils {

    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    private _client: Client<boolean>

    /**
     * Giveaways instance.
     * @type {Giveaways<any>}
     */
    private _giveaways: Giveaways<any>

    /**
     * Message utils class constructor.
     * @param {Giveaways<any>} giveaways Giveaways instance.
     */
    public constructor(giveaways: Giveaways<any>) {
        this._giveaways = giveaways
        this._client = giveaways.client
    }

    /**
     * Creates a new message embed based on giveaway and specified embed strings.
     * @param {IGiveaway} giveaway Raw giveaway object to get the values from.
     * @param {IGiveawayEmbedOptions} newEmbedStrings String values object to use in the embed.
     * @param {string[]} winners Array of winners to replace the {winners} statements with.
     * @returns {EmbedBuilder} Generated message embed.
     */
    public buildGiveawayEmbed(
        giveaway: IGiveaway,
        newEmbedStrings?: IGiveawayEmbedOptions,
        winners?: string[]
    ): EmbedBuilder {
        const embedStrings = newEmbedStrings
            ? { ...newEmbedStrings }
            : { ...giveaway.messageProps?.embeds?.start || {} } as IGiveawayEmbedOptions

        for (const stringKey in embedStrings) {
            const strings = embedStrings as { [key: string]: string }
            strings[stringKey] = replaceGiveawayKeys(strings[stringKey], giveaway, winners)
        }

        const {
            title, titleIcon, color,
            titleIconURL, description, footer,
            footerIcon, imageURL, thumbnailURL
        } = embedStrings

        const embed = new EmbedBuilder()
            .setAuthor({
                name: title || 'Giveaway',
                iconURL: titleIcon,
                url: titleIconURL
            })
            .setDescription(
                description || `**${giveaway.prize}** giveaway has started with **${giveaway.entries}** entries! ` +
                'Press the button below to join!'
            )
            .setColor(color || '#d694ff')
            .setImage(imageURL as string)
            .setThumbnail(thumbnailURL as string)
            .setFooter({
                text: footer || 'Giveaway started',
                iconURL: footerIcon
            })
            .setTimestamp(new Date())

        return embed
    }

    /**
     * Creates a buttons row based on the specified "join giveaway" button object.
     * @param {IGiveawayButtonOptions} joinGiveawayButton String values object to use in the button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    public buildButtonsRow(joinGiveawayButton: IGiveawayButtonOptions): ActionRowBuilder<ButtonBuilder> {
        const buttonsRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    customId: 'joinGiveawayButton',
                    label: joinGiveawayButton?.text || 'Join the giveaway',
                    emoji: joinGiveawayButton?.emoji || '🎉',
                    style: (joinGiveawayButton?.style as any) || ButtonStyle.Primary
                })
            )

        return buttonsRow
    }

    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {IGiveawayButtonOptions} rerollButton String values object to use in the "reroll" button.
     * @param {ILinkButton} [goToMessageButton] String values object to use in the "go to message" button.
     * @param {string} [giveawayMessageURL] Giveaway message URL to be set in the "go to message" button.
     * @returns {EmbedBuilder} Generated buttons row.
     */
    public buildGiveawayFinishedButtonsRow(
        rerollButton: IGiveawayButtonOptions,
        goToMessageButton?: ILinkButton,
        giveawayMessageURL?: string
    ): ActionRowBuilder<ButtonBuilder> {
        const buttonsRow = new ActionRowBuilder<ButtonBuilder>()

        goToMessageButton ? buttonsRow.addComponents(
            new ButtonBuilder({
                customId: 'rerollButton',
                label: rerollButton?.text || 'Reroll',
                emoji: rerollButton?.emoji || '🔁',
                style: (rerollButton?.style as any) || ButtonStyle.Primary
            }),

            new ButtonBuilder({
                label: goToMessageButton?.text || 'Go to Message',
                emoji: goToMessageButton?.emoji || '↗️',
                style: ButtonStyle.Link,
                url: giveawayMessageURL
            })
        ) : buttonsRow.addComponents(
            new ButtonBuilder({
                customId: 'rerollButton',
                label: rerollButton?.text || 'Reroll',
                emoji: rerollButton?.emoji || '🔁',
                style: (rerollButton?.style as any) || ButtonStyle.Primary
            })
        )

        return buttonsRow
    }

    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {IGiveawayButtonOptions} rerollButton String values object to use in the "reroll" button.
     * @returns {EmbedBuilder} Generated buttons row.
     */
    public buildGiveawayRerollButtonRow(
        rerollButton: IGiveawayButtonOptions,
    ): ActionRowBuilder<ButtonBuilder> {
        const buttonsRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    customId: 'rerollButton',
                    label: rerollButton?.text || 'Reroll',
                    emoji: rerollButton?.emoji || '🔁',
                    style: (rerollButton?.style as any) || ButtonStyle.Primary
                })
            )

        return buttonsRow
    }

    /**
     * Creates a buttons row based on the specified "go to message" button objects.
     * @param {ILinkButton} goToMessageButton String values object to use in the "go to message" link button.
     * @param {string} giveawayMessageURL Giveaway message URL to be set in the "go to message" button.
     * @returns {EmbedBuilder} Generated buttons row.
     */
    public buildGiveawayFinishedButtonsRowWithoutRerollButton(
        goToMessageButton: ILinkButton,
        giveawayMessageURL: string
    ): ActionRowBuilder<ButtonBuilder> {
        const buttonsRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    label: goToMessageButton?.text || 'Go to Message',
                    emoji: goToMessageButton?.emoji || '↗️',
                    style: ButtonStyle.Link,
                    url: giveawayMessageURL
                })
            )

        return buttonsRow
    }

    /**
     * Edits the giveaway message on giveaway entry.
     * @param {IGiveaway} giveaway Raw giveaway object.
     * @returns {Promise<void>}
     */
    public async editEntryGiveawayMessage(giveaway: IGiveaway): Promise<void> {
        const embedStrings = giveaway.messageProps?.embeds?.start || {} as IGiveawayEmbedOptions
        const channel = this._client.channels.cache.get(giveaway.channelID) as TextChannel

        const embed = this.buildGiveawayEmbed(giveaway)

        const buttonsRow = this.buildButtonsRow(
            giveaway.messageProps?.buttons.joinGiveawayButton as IGiveawayButtonOptions
        )

        const message = await channel.messages.fetch(giveaway.messageID)

        await message.edit({
            content: embedStrings.messageContent,
            embeds: [embed],
            components: [buttonsRow]
        })
    }

    /**
     * Edits the giveaway message on giveaway finish.
     * @param {IGiveaway} giveaway Raw giveaway object.
     * @param {string[]} winners Array of giveaway winners.
     * @param {IGiveawayEmbedOptions} customEmbedStrings Embed options to use instead of `finish` embed.
     * @returns {Promise<void>}
     */
    public async editFinishGiveawayMessage(
        giveaway: IGiveaway,
        winners?: string[],
        customEmbedStrings?: IGiveawayEmbedOptions
    ): Promise<void> {
        const embedStrings = giveaway.messageProps?.embeds?.finish

        const finishEmbedStrings = customEmbedStrings || embedStrings?.newGiveawayMessage
        const noWinnersEmbedStrings = giveaway.messageProps?.embeds?.finish?.noWinners || {} as IGiveawayEmbedOptions

        const channel = this._client.channels.cache.get(giveaway.channelID) as TextChannel

        const finishDefaultedEmbedStrings: Partial<IGiveawayEmbedOptions> = {
            title: finishEmbedStrings?.title || 'Giveaway',
            color: finishEmbedStrings?.color || '#d694ff',
            description: finishEmbedStrings?.description || 'Giveaway is over!',
            footer: finishEmbedStrings?.footer || 'Giveaway ended',
        }

        const noWinnersDefaultedEmbedStrings: Partial<IGiveawayEmbedOptions> = {
            title: noWinnersEmbedStrings?.title || 'Giveaway',
            color: noWinnersEmbedStrings?.color || '#d694ff',
            description: noWinnersEmbedStrings?.description || 'There are no winners in this giveaway!',
            footer: noWinnersEmbedStrings?.footer || 'Giveaway ended',
        }

        const winnersCondition = winners?.length as number >= this._giveaways.options.minGiveawayEntries
        const defaultedEmbedStrings = winnersCondition ? finishDefaultedEmbedStrings : noWinnersDefaultedEmbedStrings

        const finishEmbed = this.buildGiveawayEmbed(giveaway, defaultedEmbedStrings, winners)

        const giveawayEndEmbed = this.buildGiveawayEmbed(
            giveaway,
            winnersCondition ? finishDefaultedEmbedStrings : embedStrings?.noWinnersEndMessage,
            winners
        )

        const goToMessageButtonRow = this.buildGiveawayFinishedButtonsRowWithoutRerollButton(
            giveaway.messageProps?.buttons.goToMessageButton as ILinkButton,
            giveaway.messageURL as string
        )

        const rerollButtonRow = this.buildGiveawayRerollButtonRow(
            giveaway.messageProps?.buttons.rerollButton as IGiveawayButtonOptions
        )

        const message = await channel.messages.fetch(giveaway.messageID)

        const giveawayMessageContent = defaultedEmbedStrings.messageContent

        const finishMessageContent =
            replaceGiveawayKeys(
                winnersCondition
                    ? embedStrings?.endMessage.messageContent
                    : embedStrings?.noWinnersEndMessage?.messageContent as any,
                giveaway,
                winners
            )

        const finishInputObjectKeys = winnersCondition
            ? Object.keys(embedStrings?.endMessage || {} as any)
            : Object.keys(embedStrings?.noWinnersEndMessage || {} as any)

        await message.edit({
            content: giveawayMessageContent,
            embeds: Object.keys(defaultedEmbedStrings).length == 1 && giveawayMessageContent ? [] : [finishEmbed],
            components: winnersCondition ? [rerollButtonRow] : []
        })

        await message.reply({
            content: finishMessageContent,
            embeds: finishInputObjectKeys.length == 1 && finishMessageContent ? [] : [giveawayEndEmbed],
            components: [goToMessageButtonRow]
        })
    }
}
