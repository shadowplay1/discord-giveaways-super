import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import { IGiveawayEmbedOptions, IGiveawayButtonOptions, ILinkButton } from '../../../types/configurations';
import { IGiveaway } from '../../giveaway.interface';
import { Giveaways } from '../../../Giveaways';
/**
 * Message utils class.
 */
export declare class MessageUtils {
    /**
     * Discord Client.
     * @type {Client<boolean>}
     */
    private _client;
    /**
     * {@link Giveaways} instance.
     * @type {Giveaways<DatabaseType>}
     */
    private _giveaways;
    /**
     * Message utils class constructor.
     * @param {Giveaways<DatabaseType>} giveaways {@link Giveaways} instance.
     */
    constructor(giveaways: Giveaways<any, any, any>);
    /**
     * Creates a new message embed based on giveaway and specified embed strings.
     * @param {IGiveaway} giveaway Raw giveaway object to get the values from.
     * @param {IGiveawayEmbedOptions} newEmbedStrings String values object to use in the embed.
     * @param {string[]} winners Array of winners to replace the {winners} statements with.
     * @returns {EmbedBuilder} Generated message embed.
     */
    buildGiveawayEmbed(giveaway: IGiveaway, newEmbedStrings?: IGiveawayEmbedOptions, winners?: string[]): EmbedBuilder;
    /**
     * Creates a buttons row based on the specified "join giveaway" button object.
     * @param {IGiveawayButtonOptions} joinGiveawayButton String values object to use in the button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildButtonsRow(joinGiveawayButton: IGiveawayButtonOptions): ActionRowBuilder<ButtonBuilder>;
    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {IGiveawayButtonOptions} rerollButton String values object to use in the "reroll" button.
     * @param {ILinkButton} [goToMessageButton] String values object to use in the "go to message" button.
     * @param {string} [giveawayMessageURL] Giveaway message URL to be set in the "go to message" button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildGiveawayFinishedButtonsRow(rerollButton: IGiveawayButtonOptions, goToMessageButton?: ILinkButton, giveawayMessageURL?: string): ActionRowBuilder<ButtonBuilder>;
    /**
     * Creates a buttons row based on the specified "reroll" and "go to message" button objects.
     * @param {IGiveawayButtonOptions} rerollButton String values object to use in the "reroll" button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildGiveawayRerollButtonRow(rerollButton: IGiveawayButtonOptions): ActionRowBuilder<ButtonBuilder>;
    /**
     * Creates a buttons row based on the specified "go to message" button objects.
     * @param {ILinkButton} goToMessageButton String values object to use in the "go to message" link button.
     * @param {string} giveawayMessageURL Giveaway message URL to be set in the "go to message" button.
     * @returns {ActionRowBuilder<ButtonBuilder>} Generated buttons row.
     */
    buildGiveawayFinishedButtonsRowWithoutRerollButton(goToMessageButton: ILinkButton, giveawayMessageURL: string): ActionRowBuilder<ButtonBuilder>;
    /**
     * Edits the giveaway message on giveaway entry.
     * @param {IGiveaway} giveaway Raw giveaway object.
     * @returns {Promise<void>}
     */
    editEntryGiveawayMessage(giveaway: IGiveaway): Promise<void>;
    /**
     * Edits the giveaway message on giveaway finish.
     * @param {IGiveaway} giveaway Raw giveaway object.
     * @param {string[]} winners Array of giveaway winners.
     * @param {IGiveawayEmbedOptions} customEmbedStrings Embed options to use instead of `finish` embed.
     * @param {boolean} sendWinnersMessage Determines if the separated winners message should be sent.
     * @returns {Promise<void>}
     */
    editFinishGiveawayMessage(giveaway: IGiveaway, winners?: string[], customEmbedStrings?: IGiveawayEmbedOptions, sendWinnersMessage?: boolean, endEmbedStrings?: IGiveawayEmbedOptions): Promise<void>;
}
