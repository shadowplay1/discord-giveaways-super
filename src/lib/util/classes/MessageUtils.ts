import {
    ActionRowBuilder, ButtonBuilder,
    ButtonStyle, Client,
    EmbedBuilder, TextChannel, User
} from 'discord.js'

import { IGiveawayEmbedOptions, IGiveawayButtonOptions, ILinkButton } from '../../../types/configurations'
import { IGiveaway } from '../../giveaway.interface'

import { replaceGiveawayKeys } from '../../../structures/giveawayTemplate'

/**
 * Message utils class.
 */
export class MessageUtils {

    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    public client: Client<boolean>

    /**
     * Message utils class constructor.
     * @param {Client<boolean>} client Discord client.
     */
    public constructor(client: Client<boolean>) {
        this.client = client
    }

    /**
     * Creates a new message embed based on giveaway and specified embed strings.
     * @param {IGiveaway} giveaway Raw giveaway object to get the values from.
     * @param {IGiveawayEmbedOptions} newEmbedStrings String values to use in the embed.
     * @param {User[]} winners Array of winners to replace the {winners} statements with.
     * @returns {EmbedBuilder} Generated message embed.
     */
    public buildGiveawayEmbed(giveaway: IGiveaway, newEmbedStrings?: IGiveawayEmbedOptions, winners?: User[]): EmbedBuilder {
        const embedStrings = newEmbedStrings
            ? { ...newEmbedStrings }
            : { ...giveaway.messageProps?.embeds?.started || {} } as IGiveawayEmbedOptions

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
     * @param {IGiveawayButtonOptions} joinGiveawayButton String values to use in the button.
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
     * @param {IGiveawayButtonOptions} rerollButton String values to use in the "reroll" button.
     * @param {ILinkButton} goToMessageButton String values to use in the "go to message" link button.
     * @param {string} giveawayMessageURL Giveaway message URL to use in the "go to message" button.
     * @returns {EmbedBuilder} Generated buttons row.
     */
    public buildGiveawayFinishedButtonsRow(
        rerollButton: IGiveawayButtonOptions,
        goToMessageButton: ILinkButton,
        giveawayMessageURL: string
    ): ActionRowBuilder<ButtonBuilder> {
        const buttonsRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
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
            )

        return buttonsRow
    }

    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {ILinkButton} goToMessageButton String values to use in the "go to message" link button.
     * @param {string} giveawayMessageURL Giveaway message URL to use in the "go to message" button.
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
        const embedStrings = giveaway.messageProps?.embeds?.started || {} as IGiveawayEmbedOptions
        const channel = this.client.channels.cache.get(giveaway.channelID) as TextChannel

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
     * @returns {Promise<void>}
     */
    public async editFinishGiveawayMessage(giveaway: IGiveaway, winners?: User[]): Promise<void> {
        const embedStrings = giveaway.messageProps?.embeds?.finished || {} as IGiveawayEmbedOptions
        const channel = this.client.channels.cache.get(giveaway.channelID) as TextChannel

        const defaultedEmbedStrings: Partial<IGiveawayEmbedOptions> = {
            title: embedStrings.title || 'Giveaway',
            color: '#d694ff',
            description: embedStrings.description || 'Giveaway is over!',
            footer: embedStrings.footer || 'Giveaway ended',
        }

        const embed = this.buildGiveawayEmbed(giveaway, defaultedEmbedStrings, winners)

        const buttonsRow = this.buildGiveawayFinishedButtonsRow(
            giveaway.messageProps?.buttons.rerollButton as IGiveawayButtonOptions,
            giveaway.messageProps?.buttons.goToMessageButton as IGiveawayButtonOptions,
            giveaway.messageURL as string
        )

        const message = await channel.messages.fetch(giveaway.messageID)

        await message.edit({
            content: embedStrings.messageContent,
            embeds: [embed],
            components: [buttonsRow]
        })
    }
}
