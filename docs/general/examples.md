# Discord Giveaways Super

[![Downloads](https://img.shields.io/npm/dt/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Stable Version](https://img.shields.io/npm/v/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Build Status](https://github.com/shadowplay1/discord-economy-super/workflows/build/badge.svg)](https://www.npmjs.com/package/discord-giveaways-super)

<b>Discord Giveaways Super</b> - Create and manage giveaways in [Discord](https://old.discordjs.dev/#/).

## Initialation Example

```ts
import { ButtonStyle, Client, Partials } from 'discord.js'
import { DatabaseType, Giveaways } from '../src/index'

const { Channel, GuildMember, Message, Reaction, User } = Partials

const client = new Client({
    rest: {
        offset: 0,
        timeout: 120000
    },

    partials: [Channel, GuildMember, Message, Reaction, User],
    intents: [
        'GuildMembers', 'GuildMessages',
        'Guilds', 'GuildEmojisAndStickers', 'GuildIntegrations',
		'GuildMessageReactions', 'MessageContent'
    ]
})

const giveaways = new Giveaways(client, {
    database: DatabaseType.JSON // either DatabaseType.JSON, DatabaseType.MONGODB or DatabaseType.ENMAP,

    connection: {
        // database configuration object,
		// see https://dgs-docs.js.org/#/docs/main/1.0.1/general/configuring
		// for more info
    }
})
```

## Start a Giveaway
```js
// Trigger on "!giveaway-start" command
// Command usage: "!giveaway-start <channel> <time> <winnersCount> <prize>"
if (message.content.startsWith(prefix + 'giveaway-start')) {
    const channelIDOrName = args[0]

    // Get the channel by mention, name, or id
    const channel = (
        message.mentions.channels.first() ||
        message.guild?.channels.cache.find(channel => channel.name == channelIDOrName) ||
        message.guild?.channels.cache.get(channelIDOrName)
    )

    // Get the required command arguments
    const time = args[1]
    const winnersCount = parseInt(args[2])
    const prize = args.slice(3).join(' ')

    // Performing validation checks
    if (!message.guild) {
        message.reply(':x: | Giveaways cannot be started in DMs.')
        return
    }

    if (!channel) {
        message.reply(':x: | Giveaway channel is not specified or not found.')
        return
    }

    if (channel?.type !== ChannelType.GuildText) {
        message.reply(':x: | Giveaway channel must be a **text** channel.')
        return
    }

    if (!time) {
        message.reply(':x: | Giveaway time should be specified.')
        return
    }

    if (!isTimeStringValid(time)) {
        message.reply(`:x: | Giveaway time "${time}" is not valid.`)
        return
    }

    if (!winnersCount) {
        message.reply(':x: | Giveaway winners count should be specified.')
        return
    }

    if (!prize) {
        message.reply(':x: | Giveaway prize should be specified.')
        return
    }

    // Start the giveaway and read the started giveaway's data
    const newGiveaway = await giveaways.start({
        channelID: channel.id,
        guildID: message.guild.id,
        hostMemberID: message.author.id,
        prize,
        time,
        winnersCount,

        // defining *all* the messages for the giveaway

        // please note that all the properties
        // in all "defineEmbedStrings" returning objects and
        // in all "buttons" objects are optional

        // all buttons will be replaced with placeholders
        // if not specified, and some of the message objects properties
        // of "defineEmbedStrings" function are also will be replaced with
        // placeholder values

		// see https://dgs-docs.js.org/#/docs/main/1.0.1/general/embed-strings
		// for more info about defining embeds
		defineEmbedStrings(giveaway, host) {
    		return {

                // this ephemeral reply will be sent when they join the giveaway (embeds may also be used here)
                joinGiveawayMessage: {
                    messageContent: ':white_check_mark: | You have joined the giveaway!'
            		// ... (other properties)
                },

                // this ephemeral reply will be sent when they leave the giveaway (embeds may also be used here)
                leaveGiveawayMessage: {
                    messageContent: ':exclamation: | You have left the giveaway!'
            		// ... (other properties)
                },

                // this embed will be sent on giveaway start
        		start: {
            		messageContent: ':tada: **GIVEAWAY STARTED!** :tada:',
            		title: 'Giveaway Info',
            		description: `Prize: ${giveaway.prize}\nWinners: ${giveaway.winnersCount}`,
            		// ... (other properties)
        		},

                // defining all messages that are related
                // to giveaway finish
        		finish(mentionsString, winnersCount) {
            		return {

                        // this message will be sent separately in the giveaway channel when the giveaway ends
                        // used to mention the giveaway winners
                		endMessage: {
                    		messageContent: `Congratulations ${mentionsString} on winning!`
            				// ... (other properties)
                		},

                        // the new separated message that the giveaway message in giveaway channel
                        // will be changed to after the giveaway is finished
                        newGiveawayMessage: {
                            messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                            title: `Giveaway (ID: ${giveaway.id})`,
                            description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entriesCount}**\n` +
                                `${giveaway.winnersCount == 1 ? 'Winner' : `Winners **(${winnersCount})**`}: ${mentionsString} `,

                            footer: `Ended at:`,
                            timestamp: giveaway.endedTimestamp

            				// ... (other properties)
                        },

                        // the new message that the giveaway message in giveaway channel will be changed to
                        // after the giveaway is finished with no winners
                        noWinnersNewGiveawayMessage: {
                            messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                            title: `Giveaway (ID: ${giveaway.id})`,
                            description: `There was no winners in "**${giveaway.prize}**" giveaway!`,

                            footer: `Ended at:`,
                            timestamp: giveaway.endedTimestamp,
            				// ... (other properties)
                        },

                        // the new separated message that the giveaway message in giveaway channel
                        // will be changed to after the giveaway is finished with no winners (embeds may also be used here)
                        noWinnersEndMessage: {
                            messageContent: `Unfortunetly, there are no winners in the **${giveaway.prize}** giveaway.`
            				// ... (other properties)
                        }
            		}
        		},

                // defining all messages that are related
                // to rerolling the giveaway winners
                reroll(mentionsString, winnersCount) {
                    return {
                        // this ephemeral reply will be sent when they're not a host
                        // of the giveaway and trying to reroll the winners (embeds may also be used here)
                        onlyHostCanReroll: {
                            messageContent: ':x: | Only host of this giveaway can reroll the winners.'
            				// ... (other properties)
                        },

                        // the new message that the giveaway message in giveaway channel will be changed to
                        // after the reroll
                        newGiveawayMessage: {
							messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                            title: `Giveaway (ID: ${giveaway.id})`,
                            description: `There was no winners in "**${giveaway.prize}**" giveaway!`,

                            footer: `Ended at:`,
                            timestamp: giveaway.endedTimestamp,
            				// ... (other properties)
                        },

                        // this message will be sent separately in the giveaway channel after the reroll
                        // used to mention the new giveaway winners (embeds may also be used here)
                        rerollMessage: {
                            messageContent: `${giveaway.winnersCount == 1 ? 'New winner is' : 'New winners are'} ` +
                                `${mentionsString}, congratulations!`
            				// ... (other properties)
                        },

                        // this ephemeral reply will be sent after the successful reroll (embeds may also be used here)
                        successMessage: {
                            messageContent: ':white_check_mark: | Successfully rerolled the winners!'
            				// ... (other properties)
                        }
                    }
                }
    		}
		}
	})

    // Send the success message
    message.channel.send({
        content: `**${newGiveaway.prize}** giveaway (ID: **${newGiveaway.id}**) has started ------> ${newGiveaway.messageURL}`
    })
}
```

## Force-End Giveaway
```js
// Trigger on "!force-end" command
// Command usage: "!force-end <giveawayOrMessageID>"
if (message.content.startsWith(prefix + 'force-end')) {
    const giveawayOrMessageID = args[0]

    // Perform validation checks for the giveaway ID
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
    )

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Forcefully end the giveaway
    await giveaway.end()

    message.reply(`**${giveaway.prize}** giveaway (ID: **${giveaway.id}**) was ended forcefully.`)
}
```

## Restart Giveaway
```js
// Trigger on "!restart" command
// Command usage: "!restart <giveawayOrMessageID>"
if (message.content.startsWith(prefix + 'restart')) {
    const giveawayOrMessageID = args[0]

    // Perform validation checks for the giveaway ID
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
    )

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Restart the giveaway
    await giveaway.restart()

    message.reply(`**${giveaway.prize}** giveaway (ID: **${giveaway.id}**) was successfully restarted.`)
}
```

## Extend Giveaway Length
```js
// Trigger on "!extend" command
// Command usage: "!extend <giveawayOrMessageID> <time>"
if (message.content.startsWith(prefix + 'extend')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]
    const time = args[1]

    // Perform validation checks for the giveaway ID and time
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    if (!time) {
        message.reply(':x: | Giveaway time should be specified.')
        return
    }

    if (!isTimeStringValid(time)) {
        message.reply(`:x: | Giveaway time "**${time}**" is not valid.`)
        return
    }

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
    )

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Extend the giveaway's length
    await giveaway.extend(time)

    message.reply(`**${giveaway.prize}** giveaway's length (ID: **${giveaway.id}**) was successfully extended by **${time}**.`)
}
```

## Reduce Giveaway Length
```js
// Trigger on "!reduce" command
// Command usage: "!reduce <giveawayOrMessageID> <time>"
if (message.content.startsWith(prefix + 'reduce')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]
    const time = args[1]

    // Perform validation checks for the giveaway ID and time
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    if (!time) {
        message.reply(':x: | Giveaway time should be specified.')
        return
    }

    if (!isTimeStringValid(time)) {
        message.reply(`:x: | Giveaway time "**${time}**" is not valid.`)
        return
    }

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
    )

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Reduce the giveaway's length
    await giveaway.reduce(time)

    message.reply(`**${giveaway.prize}** giveaway's length (ID: **${giveaway.id}**) was successfully reduced by **${time}**.`)
}
```

## Delete Giveaway
```js
// Trigger on "!delete" command
// Command usage: "!delete <giveawayOrMessageID>"
if (message.content.startsWith(prefix + 'delete')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]

    // Perform validation checks for the giveaway ID
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
    )

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Delete the giveaway
    await giveaway.delete()

    message.reply(`**${giveaway.prize}** giveaway (ID: **${giveaway.id}**) was successfully deleted.`)
}
```

## Change Prize of the Giveaway
```js
// Trigger on "!set-prize" command
// Command usage: "!set-prize <giveawayOrMessageID> <prize>"
if (message.content.startsWith(prefix + 'set-prize')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]

    // Perform validation checks for the giveaway ID
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    // Get the new prize from the arguments
    const prize = args.slice(1).join(' ')

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
	)

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Set the new prize for the giveaway
    await giveaway.setPrize(prize)

    message.reply(`**${giveaway.prize}** giveaway's prize (ID: **${giveaway.id}**) was successfully set to **${prize}**.`)
}
```

## Change Winners Count of the Giveaway
```js
// Trigger on "!set-winners" command
// Command usage: "!set-winners <giveawayOrMessageID> <winnersCount>"
if (message.content.startsWith(prefix + 'set-winners')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]

    // Perform validation checks for the giveaway ID
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    // Get the new number of winners from the arguments
    const winnersCount = parseInt(args[1])

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
	)

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Set the new number of winners for the giveaway
    await giveaway.setWinnersCount(winnersCount)

    message.reply(`**${giveaway.prize}** giveaway's winners count (ID: **${giveaway.id}**) was successfully set to **${winnersCount}**.`)
}
```

## Change Host of the Giveaway
```js
// Trigger on "!set-host" command
// Command usage: "!set-host <giveawayOrMessageID> <hostMemberID>"
if (message.content.startsWith(prefix + 'set-host')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]

    // Perform validation checks for the giveaway ID
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    // Get the new host member's ID from the arguments
    const hostMemberID = args[1]

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
	)

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Set the new host member ID for the giveaway
    await giveaway.setHostMemberID(hostMemberID)

    message.reply(`**${giveaway.prize}** giveaway's host (ID: **${giveaway.id}**) was successfully changed to **<@${hostMemberID}>**.`)
}
```

## Change Time of the Giveaway
```js
// Trigger on "!set-time" command
// Command usage: "!set-time <giveawayOrMessageID> <time>"
if (message.content.startsWith(prefix + 'set-time')) {
    // Get the required command arguments
    const giveawayOrMessageID = args[0]
    const time = args[1]

    // Perform validation checks for the giveaway ID and time
    if (!giveawayOrMessageID) {
        message.reply(':x: | Giveaway ID should be specified.')
        return
    }

    if (!time) {
        message.reply(':x: | Giveaway time should be specified.')
        return
    }

    if (!isTimeStringValid(time)) {
        message.reply(`:x: | Giveaway time "**${time}**" is not valid.`)
        return
    }

    // Find the giveaway by its ID or its message ID
    const giveaway = giveaways.get(parseInt(giveawayOrMessageID)) || giveaways.find(
        giveaway => giveaway.messageID == giveawayOrMessageID
	)

    // Send an error message if the giveaway was not found
    if (!giveaway) {
        message.channel.send(':x: | Giveaway not found.')
        return
    }

    // Send an error message if the giveaway is not running and already ended.
    if (!giveaway.isRunning()) {
        message.channel.send(`:x: | Giveaway "**${giveaway.prize}**" has already ended.`)
        return
    }

    // Set the new time for the giveaway
    await giveaway.setTime(time)

    message.reply(`**${giveaway.prize}** giveaway's time (ID: **${giveaway.id}**) was successfully set to **${time}**.`)
}
```

View the **full bot examples** in both **JavaScript** and **TypeScript** [here](https://github.com/shadowplay1/discord-giveaways-super/tree/main/examples).

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-giveaways-super">NPM</a></b></li>
<li><b><a href = "https://dgs-docs.js.org/#/docs/main/1.0.1/general/faq">Frequently Asked Questions</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-giveaways-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-giveaways-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<br>
<b>If you don't understand something in the documentation or you are experiencing problems, feel free to join our <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Giveaways Super ❤️
