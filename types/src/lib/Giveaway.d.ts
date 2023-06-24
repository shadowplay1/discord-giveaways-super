import { User, TextChannel, Guild } from 'discord.js';
import { Giveaways } from '../Giveaways';
import { GiveawayState, IGiveaway, IGiveawayMessageProps } from './giveaway.interface';
import { DatabaseType } from '../types/databaseType.enum';
export declare class Giveaway<TDatabase extends DatabaseType> implements Omit<IGiveaway, 'hostMemberID' | 'channelID' | 'guildID'> {
    private _giveaways;
    raw: IGiveaway;
    id: number;
    prize: string;
    time: string;
    state: GiveawayState;
    winnersCount: number;
    startTimestamp: number;
    endTimestamp: number;
    messageID: string;
    messageURL: string;
    guild: Guild;
    host: User;
    channel: TextChannel;
    entries: number;
    entriesArray: string[];
    messageProps?: IGiveawayMessageProps;
    constructor(giveaways: Giveaways<TDatabase>, giveaway: IGiveaway);
    /**
     * Determines if the giveaway is ended.
     * @type {boolean}
     */
    get isEnded(): boolean;
    restart(): Promise<void>;
    end(): Promise<void>;
    forceEnd(): Promise<void>;
    reroll(): Promise<void>;
    addEntry(guildID: string, userID: string): Promise<IGiveaway>;
    removeEntry(guildID: string, userID: string): Promise<IGiveaway>;
    /**
     * Syncs the constructor properties with specified raw giveaway object.
     * @param giveaway Giveaway object to sync the constructor properties with.
     */
    sync(giveaway: IGiveaway): void;
    /**
     * Gets the giveaway data and its index in guild giveaways array from database.
     * @param {string} guildID Guild ID to get the giveaways array from.
     * @returns {Promise<IDatabaseGiveaway>} Database giveaway object.
     * @private
     */
    private _getFromDatabase;
    /**
     * Converts the Giveaway instance to a plain object representation.
     * @returns {IGiveaway} Plain object representation of Giveaway instance.
     */
    toJSON(): IGiveaway;
}
export interface IDatabaseGiveaway {
    giveaway: IGiveaway;
    giveawayIndex: number;
}
