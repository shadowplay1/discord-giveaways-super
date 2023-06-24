/// <reference types="node" />
import { Client } from 'discord.js';
import { Database, IGiveawayStartOptions, IGiveawaysConfiguration } from './types/configurations';
import { IGiveawaysEvents } from './types/giveawaysEvents.interface';
import { DatabaseType } from './types/databaseType.enum';
import { Emitter } from './lib/util/classes/Emitter';
import { DatabaseManager } from './lib/managers/DatabaseManager';
import { FindCallback, Optional } from './types/misc/utils';
import { Giveaway } from './lib/Giveaway';
import { IGiveaway } from './lib/giveaway.interface';
/**
 * Main Giveaways class.
 */
export declare class Giveaways<TDatabase extends DatabaseType> extends Emitter<IGiveawaysEvents<TDatabase>> {
    /**
     * Discord Client.
     * @type {Client}
     */
    client: Client<boolean>;
    /**
     * Giveaways ready state.
     * @type {boolean}
     */
    ready: boolean;
    /**
     * Giveaways version.
     * @type {string}
     */
    version: string;
    /**
     * Giveaways options.
     * @type {IGiveawaysConfiguration<DatabaseType>}
     */
    options: IGiveawaysConfiguration<TDatabase>;
    /**
     * External database instanca (such as Enmap or MongoDB) if used.
     * @type {?Database<DatabaseType>}
     */
    db: Database<TDatabase>;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    database: DatabaseManager<TDatabase>;
    /**
     * Module logger.
     * @type {Logger}
     * @private
     */
    private _logger;
    /**
     * Giveaways ending state checking interval.
     * @type {NodeJS.Timeout}
     */
    giveawaysCheckingInterval: NodeJS.Timeout;
    /**
     * Main Giveaways constructor.
     * @param {Client} client Discord client.
     * @param {IGiveawaysConfiguration} options Module configuration.
     */
    constructor(client: Client<boolean>, options?: IGiveawaysConfiguration<TDatabase>);
    /**
     * Initialize the database connection and initialize the module.
     * @returns {Promise<void>}
     * @private
     */
    private _init;
    /**
     * Sends the module update state in the console.
     * @returns {Promise<void>}
     * @private
     */
    private _sendUpdateMessage;
    /**
     * Starts the giveaway.
     * @param giveawayOptions Giveaway options.
     * @returns {Promise<Giveaway<DatabaseType>>} Created giveaway instance.
     */
    start(giveawayOptions: Optional<Omit<IGiveaway, 'id' | 'startTimestamp' | 'endTimestamp' | 'messageID' | 'messageURL' | 'entries' | 'entriesArray' | 'state'>, 'time' | 'winnersCount'> & Partial<IGiveawayStartOptions>): Promise<Giveaway<TDatabase>>;
    find(cb: FindCallback<Giveaway<TDatabase>>): Promise<Giveaway<TDatabase>>;
    getGuildGiveaways(guildID: string): Promise<Giveaway<TDatabase>[]>;
    getAll(): Promise<Giveaway<TDatabase>[]>;
    private _buildGiveawayEmbed;
    private _buildButtonsRow;
    private _editGiveawayMessage;
    private _checkGiveaways;
}
