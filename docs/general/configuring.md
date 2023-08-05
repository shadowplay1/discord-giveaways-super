# Discord Giveaways Super

[![Downloads](https://img.shields.io/npm/dt/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Stable Version](https://img.shields.io/npm/v/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)

<b>Discord Giveaways Super</b> - Create and manage giveaways in [Discord](https://old.discordjs.dev/#/).

## Introduction

You know that the module has a lot of different settings and you can set them up like you want. In this article, we will go through everything about configuring the Giveaways system!

## Available Databases

The module has support for **3** types of databases: **__JSON__**, **__MongoDB__** and **__Enmap__**.

To set up the database to work in Discord Giveaways Super, we need to specify 2 important configuration properties: [`database`](https://dgs-docs.js.org/#/docs/main/1.0.0/typedef/IGiveawaysConfiguration%3CTDatabaseType%3E) and [`connection`](https://dgs-docs.js.org/#/docs/main/1.0.0/typedef/IGiveawaysConfiguration%3CTDatabaseType%3E)

- `database` is the type of database we want to use
- `connection` is the configuration for the database which we have chosen

```js
const { Giveaways, DatabaseType } = require('discord-giveaways-super')

const giveaways = new Giveaways(client, {
	database: DatabaseType.JSON, // or any other database that is provided by module: DatabaseType.MONGODB or DatabaseType.ENMAP

	connection: {
		// database configuration object based on the chosen database
	}
})
```

## Configuring Giveaways

To configure Discord Giveaways Super, follow these steps:

1. **Import the Module and Dependencies**:
First, make sure you've imported the necessary dependencies and the `Giveaways` class from the module. Your import statements would look something like this:

```js
const { Giveaways, DatabaseType } = require('discord-giveaways-super')
const { Client } = require('discord.js')

// or

import { Giveaways, DatabaseType } from 'discord-giveaways-super'
import { Client } from 'discord.js'
```

1. **Initialize Discord Client**:

```js
const client = new Client({
    intents: [
        'Guilds', 'GuildMembers',
        'GuildMessages', 'GuildMessageReactions',
    ]
})

client.on('ready', () => {
	console.log(`${client.user.username} is ready!`)
})

client.login('YOUR_BOT_TOKEN_HERE')
```

3. **Initialize our Giveaways class from the module**:
```js
const giveaways = new Giveaways(client, {
	database: DatabaseType.JSON, // or any other database that is provided by module

	connection: {
		// database configuration object based on the chosen database
	}
})

giveaways.on('ready', () => {
	console.log(`Giveaways module is ready!`)
})
```

### The full initialation code should look like this:
```js
const client = new Client({
    intents: [
        'Guilds', 'GuildMembers',
        'GuildMessages', 'GuildMessageReactions',
    ]
})

client.on('ready', () => {
	console.log(`${client.user.username} is ready!`)
})

const giveaways = new Giveaways(client, {
	database: DatabaseType.JSON, // or any other database that is provided by module

	connection: {
		// database configuration object based on the chosen database
	}
})

giveaways.on('ready', () => {
	console.log(`Giveaways module is ready!`)
})

client.login('YOUR_BOT_TOKEN_HERE')
```

## Full Configuration Example

Here's the **full** example of Giveaways configuration object and how everything should look like.

This example will contain default values for each setting.

Note that all settings (except `database` and `connection`) are optional and you don't have to specify them all!

```js
/**
 * Default configuration options for Discord Giveaways Super.
 */
const giveawaysConfigExample = {

    /**
     * Determines how often the giveaways ending state will be checked (in ms).
     * This interval controls how frequently the module will check for giveaways that have ended.
     * Type: number
     */
    giveawaysCheckingInterval: 1000,

    /**
     * Determines the minimum required giveaway entries to draw the winner.
     * If the number of entries in a giveaway is below this threshold, a winner will not be drawn.
     * Type: number
     */
    minGiveawayEntries: 1,

    /**
     * Updates checker configuration.
     * Controls whether the module should check for updates and display update-related messages.
     * Type: IUpdateCheckerConfiguration
     */
    updatesChecker: {

        /**
         * Determines if the module should check for updates on start.
         * If enabled, the module will check for updates and display relevant messages.
         * Type: boolean
         */
        checkUpdates: true,

        /**
         * Determines if an "up to date" message should be displayed if the module is already up to date.
         * If enabled, a message will be displayed indicating that the module is up to date.
         * Type: boolean
         */
        upToDateMessage: false
    },

    /**
     * Giveaways config checker configuration.
     * Controls various aspects of the configuration checking process.
     * Type: IGiveawaysConfigCheckerConfiguration
     */
    configurationChecker: {

        /**
         * Allows the method to ignore options with invalid types during configuration checks.
         * If enabled, the configuration checker will ignore options with invalid data types.
         * Type: boolean
         */
        ignoreInvalidTypes: false,

        /**
         * Allows the method to ignore unspecified options during configuration checks.
         * If enabled, the configuration checker will ignore options that are not specified in the configuration.
         * Type: boolean
         */
        ignoreUnspecifiedOptions: true,

        /**
         * Allows the method to ignore options that do not exist during configuration checks.
         * If enabled, the configuration checker will ignore options that are not recognized by the module.
         * Type: boolean
         */
        ignoreInvalidOptions: false,

        /**
         * Determines if problems found during configuration checks should be shown in the console.
         * If enabled, the configuration checker will display problems it encounters during checks.
         * Type: boolean
         */
        showProblems: true,

        /**
         * Determines if the results of configuration checks should be sent to the console.
         * If enabled, the configuration checker will send the overall result to the console.
         * Requires 'showProblems' or 'sendLog' options to be set.
         * Type: boolean
         */
        sendLog: true,

        /**
         * Determines if the results of successful configuration checks should be sent to the console.
         * If enabled, the configuration checker will send the result if no problems were found.
         * Type: boolean
         */
        sendSuccessLog: false
    },

    /**
     * Determines if debug mode is enabled.
     * If enabled, the module will run in debug mode, which may provide additional information for debugging.
     * Type: boolean
     */
    debug: false
}
```

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-giveaways-super">NPM</a></b></li>
<li><b><a href = "https://dgs-docs.js.org/#/docs/main/1.0.0/general/faq">Frequently Asked Questions</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-giveaways-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-giveaways-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<br>
<b>If you don't understand something in the documentation or you are experiencing problems, feel free to join our <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Giveaways Super ❤️
