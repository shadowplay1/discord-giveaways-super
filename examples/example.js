const { ButtonStyle, ChannelType, Client, Partials } = require('discord.js')
const { DatabaseType, Giveaways, isTimeStringValid } = require('discord-giveaways-super')

const { Channel, GuildMember, Message, User } = Partials

const client = new Client({
    rest: {
        offset: 0,
        timeout: 120000
    },

    partials: [Channel, GuildMember, Message, User],
    intents: [
        'Guilds', 'GuildMembers',
        'GuildMessages', 'GuildMessageReactions',
        'MessageContent'

        // using "MessageContent" intent for this example
        // to provide the text commands functionality
    ]
})

// using JSON database for this example
// you can use any database the module provides:
// JSON, MongoDB or Enmap
const giveaways = new Giveaways(client, {
    database: DatabaseType.JSON,

    connection: {
        path: './data/json/giveaways.json'
    }
})


// send a log telling that giveaways module is ready
giveaways.on('ready', async () => {
    console.log('Giveaways module is ready!')
})

// send a log telling that discord client is ready
client.on('ready', async () => {
    console.log(`${client.user?.tag} is ready!`)
})

// get the user's message
client.on('messageCreate', async message => {
    // define the bot's commands prefix
    const prefix = '!'

    // get the command arguments list
    const args = message.content.slice(prefix.length).split(' ').slice(1)

    // trigger on "!giveaway-start" command
    // command usage: "!giveaway-start <channel> <time> <winnersCount> <prize>"
    if (message.content.startsWith(prefix + 'giveaway-start')) {
        const channelIDOrName = args[0]

        // get the channel by mention, name or id
        const channel = (
            message.mentions.channels.first() ||
            message.guild?.channels.cache.find(channel => channel.name == channelIDOrName) ||
            message.guild?.channels.cache.get(channelIDOrName)
        )

        // get the required command arguments
        // get the giveaway details provided by user in the arguemnts
        const time = args[1]
        const winnersCount = parseInt(args[2])
        const prize = args.slice(3).join(' ')

        // performing validation checks
        if (!message.guild) {
            message.reply(':x: | Giveaways cannot be started in DMs.')
            return
        }

        if (!channel) {
            message.reply(':x: | Giveaway channel is not specified or not found.')
            return
        }

        if (channel.type !== ChannelType.GuildText) {
            message.reply(':x: | Giveaway channel must be a **text** channel.')
            return
        }

        if (!time) {
            message.reply(':x: | Giveaway time should be specified.')
            return
        }

        if (!isTimeStringValid(time)) {
            message.reply(`:x: | Giveaway time "${time}" is not a valid time string.`)
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

        // start the giveaway and read the started giveaway's data
        const newGiveaway = await giveaways.start({
            channelID: channel.id,
            guildID: message.guild.id,
            hostMemberID: message.author.id,
            prize,
            time,
            winnersCount,

            // example usage of participants filtering (only IDs are supported)
            participantsFilter: {
                requiredRoles: ['<@&841642867100221452>', '<@&669259475156205583>', '841642867100221452', '669259475156205583'],
                restrictedRoles: ['<@&692002313187098677>', '<@&765209398318465075>', '692002313187098677', '765209398318465075'],
                restrictedMembers: ['<@1121494265164468376>', '1121494265164468376']
            },

            // defining *all* the messages for the giveaway
            // "EmbedBuilder" support will be added later

            // please note that all the properties
            // in all "defineEmbedStrings" returning objects and
            // in all "buttons" objects are optional

            // all buttons will be replaced with placeholders
            // if not specified, and some of the message objects properties
            // of "defineEmbedStrings" function are also will be replaced with
            // placeholder values
            defineEmbedStrings(giveaway, host, participantsFilters) {
                return {
                    // this ephemeral reply will be sent when they join the giveaway (embeds may also be used here)
                    joinGiveawayMessage: {
                        messageContent: ':white_check_mark: | You have joined the giveaway!'
                    },

                    // this ephemeral reply will be sent when they leave the giveaway (embeds may also be used here)
                    leaveGiveawayMessage: {
                        messageContent: ':exclamation: | You have left the giveaway!'
                    },

                    // this embed will be sent on giveaway start
                    start: {
                        messageContent: ':tada: **GIVEAWAY STARTED!** :tada:',

                        // embed properties
                        title: `Giveaway (ID: ${giveaway.id})`,
                        titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                        description: `Prize: **${giveaway.prize}**.\nWinners: **${giveaway.winnersCount}**\n` +
                            `Entries: **${giveaway.entriesCount}**\nHost: **${host.username}**\nEnds at: <t:${giveaway.endTimestamp}:R>\n\n` + 
                            `- Required roles: ${participantsFilters.requiredRoles?.join(', ') || 'none'}\n` +
                            `- Forbidden roles: ${participantsFilters.restrictedRoles?.join(', ') || 'none'}\n`,

                        footer: `Ends at:`,
                        timestamp: giveaway.endTimestamp,
                        footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                    },

                    // defining all messages that are related
                    // to giveaway finish
                    finish(mentionsString, winnersCount) {
                        return {
                            // this message will be sent separately in the giveaway channel when the giveaway ends
                            // used to mention the giveaway winners
                            endMessage: {
                                messageContent: `Congratulations ${mentionsString} on winning **${giveaway.prize}**!`
                            },

                            // the new separated message that the giveaway message in giveaway channel
                            // will be changed to after the giveaway is finished
                            newGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                                title: `Giveaway (ID: ${giveaway.id})`,
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),


                                // using "giveaway.winnersCount" to pluralize the "winners" word because
                                // it's constant and most likely to match the actual number of winners

                                // using "winnersCount" in "Winners" string in case if the actual number of winners
                                // will not match the giveaway's number of winners
                                description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entriesCount}**\n` +
                                    `${winnersCount == 1 ? 'Winner' : `Winners **(${winnersCount})**`}: ${mentionsString} `,

                                footer: `Ended at:`,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 }),
                                timestamp: giveaway.endedTimestamp
                            },

                            // the new message that the giveaway message in giveaway channel will be changed to
                            // after the giveaway is finished with no winners
                            noWinnersNewGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                                title: `Giveaway (ID: ${giveaway.id})`,
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),
                                description: `There was no winners in "**${giveaway.prize}**" giveaway!`,

                                footer: `Ended at:`,
                                timestamp: giveaway.endedTimestamp,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                            },

                            // the new separated message that the giveaway message in giveaway channel
                            // will be changed to after the giveaway is finished with no winners (embeds may also be used here)
                            noWinnersEndMessage: {
                                messageContent: `Unfortunetly, there are no winners in the **${giveaway.prize}** giveaway.`
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
                            },

                            // the new message that the giveaway message in giveaway channel will be changed to
                            // after the reroll
                            newGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY REROLLED!** :tada:',

                                title: `Giveaway (ID: ${giveaway.id})`,
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                                description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entriesCount}**\n` +
                                    `${winnersCount == 1 ? 'Winner' : `Winners (${winnersCount})`}: ${mentionsString}`,

                                footer: `Ended at:`,
                                timestamp: giveaway.endedTimestamp,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                            },

                            // this message will be sent separately in the giveaway channel after the reroll
                            // used to mention the new giveaway winners (embeds may also be used here)
                            rerollMessage: {
                                messageContent: `${winnersCount == 1 ? 'New winner is' : 'New winners are'} ` +
                                    `${mentionsString}, congratulations!`
                            },

                            // this ephemeral reply will be sent after the successful reroll (embeds may also be used here)
                            successMessage: {
                                messageContent: ':white_check_mark: | Successfully rerolled the winners!'
                            }
                        }
                    }
                }
            },

            // defining the buttons to be attached on giveaway related messages
            buttons: {
                // the "join giveaway" button to attach on the initial giveaway message
                joinGiveawayButton: {
                    text: 'Join the giveaway',
                    emoji: '🎉', // either an emoji or custom emoji ID is acceptable
                    style: ButtonStyle.Primary
                },

                // the "reroll" button to attach on the separated giveaway end message
                rerollButton: {
                    text: 'Reroll Winners',
                    emoji: '🔁', // either an emoji or custom emoji ID is acceptable
                    style: ButtonStyle.Primary
                },

                // the "go to nessage" link button to attach on the separated giveaway end message
                // that will bring to the initial giveaway message
                goToMessageButton: {
                    text: 'Go to Message',
                    emoji: '↗️' // either an emoji or custom emoji ID is acceptable
                }
            }
        })

        // send the success message
        message.channel.send({
            content: `**${newGiveaway.prize}** giveaway (ID: **${newGiveaway.id}**) has started ------> ${newGiveaway.messageURL}`
        })
    }

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
            message.reply(`:x: | Giveaway time "**${time}**" is not a valid time string.`)
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
            message.reply(`:x: | Giveaway time "**${time}**" is not a valid time string.`)
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
        const winners = args.slice(2).join(' ')

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
        await giveaway.setWinnersCount(parseInt(winners))

        message.reply(`**${giveaway.prize}** giveaway's winners count (ID: **${giveaway.id}**) was successfully set to **${winners}**.`)
    }

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
        const hostMemberID = args[2]

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
            message.reply(`:x: | Giveaway time "**${time}**" is not a valid time string.`)
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

    // Trigger on "!help" command
    // Command usage: "!help"
    if (message.content.startsWith(prefix + 'help')) {
        // Available commands array
        const commands = [
            '`!help` - **Display the list of available commands.**',
            '`!giveaway-start <channel> <time> <winnersCount> <prize>` - **Start a new giveaway.**',
            '`!force-end <giveawayOrMessageID>` - **Forcefully end a giveaway.**',
            '`!restart <giveawayOrMessageID>` - **Restart a giveaway.**',
            '`!extend <giveawayOrMessageID> <time>` - **Extend the length of a giveaway.**',
            '`!reduce <giveawayOrMessageID> <time>` - **Reduce the length of a giveaway.**',
            '`!delete <giveawayOrMessageID>` - **Delete a giveaway.**',
            '`!set-prize <giveawayOrMessageID> <prize>` - **Set a new prize for a giveaway.**',
            '`!set-winners <giveawayOrMessageID> <winnersCount>` - **Set the number of winners for a giveaway.**',
            '`!set-host <giveawayOrMessageID> <hostMemberID>` - **Change the host of a giveaway.**',
            '`!set-time <giveawayOrMessageID> <time>` - **Set a new time for a giveaway.**'
        ]

        message.channel.send(
            `Commands list [**${commands.length}** commands]:\n\n` +
            commands
                .map((commandString, commandIndex) => `**${commandIndex + 1}** - ${commandString}`)
                .join('\n')
        )
    }
})

// authenticate the bot in discord
client.login('YOUR_BOT_TOKEN')
