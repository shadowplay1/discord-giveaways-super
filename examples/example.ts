import { ButtonStyle, Client, Partials, TextChannel } from 'discord.js'
import { DatabaseType, Giveaways, isTimeStringValid } from '../src/index'

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
        ) as TextChannel

        // get the required command arguments
        // get the giveaway details provided by user in the arguemnts
        const time = args[1]
        const winnersCount = parseInt(args[2])
        const prize = args.slice(3).join(' ')

        // performing validation checks
        if (!channel) {
            message.reply(':x: | Giveaway channel is not specified or not found.')
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

        // start the giveaway and read the started giveaway's data
        const newGiveaway = await giveaways.start({
            channelID: channel.id,
            guildID: message.guild?.id as string,
            hostMemberID: message.author.id,
            prize,
            time,
            winnersCount,

            // defining all the messages for the giveaway
            // "EmbedBuilder" support will be added later

            // please note that all the properties
            // in all "defineEmbedStrings" returning objects and
            // in all "buttons" objects are optional

            // all buttons will be replaced with placeholders
            // if not specified, and some of the message objects properties
            // of "defineEmbedStrings" function are also will be replaced with
            // placeholder values
            defineEmbedStrings(giveaway, host) {
                return {
                    // this ephemeral reply will be sent when they join the giveaway
                    joinGiveawayMessage: {
                        messageContent: ':white_check_mark: | You have joined the giveaway!'
                    },

                    // this ephemeral reply will be sent when they leave the giveaway
                    leaveGiveawayMessage: {
                        messageContent: ':white_check_mark: | You have left the giveaway!'
                    },

                    // this embed will be sent on giveaway start
                    start: {
                        messageContent: ':tada: **GIVEAWAY STARTED!** :tada:',

                        // embed properties
                        title: 'Giveaway',
                        titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                        description: `Prize: **${giveaway.prize}**.\nWinners: **${giveaway.winnersCount}**\n` +
                            `Entries: **${giveaway.entries}**\nHost: **${host.username}**\nEnds at: <t:${giveaway.endTimestamp}:R>`,

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

                                title: 'Giveaway',
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),


                                // using "giveaway.winnersCount" to pluralize the "winners" word because
                                // it's constant and most likely to match the actual number of winners

                                // using "winnersCount" in "Winners" string in case if the actual number of winners
                                // will not match the giveaway's number of winners
                                description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entries}**\n` +
                                    `${giveaway.winnersCount == 1 ? 'Winner' : `Winners (${winnersCount})`}: ${mentionsString} `,

                                footer: `Ended at:`,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 }),
                                timestamp: giveaway.endedTimestamp
                            },

                            // the new message that the giveaway message in giveaway channel will be changed to
                            // after the giveaway is finished with no winners
                            noWinnersNewGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY FINISHED!** :tada:',

                                title: 'Giveaway',
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),
                                description: `There was no winners in "**${giveaway.prize}**" giveaway!`,

                                footer: `Ended at:`,
                                timestamp: giveaway.endedTimestamp,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                            },

                            // the new separated message that the giveaway message in giveaway channel
                            // will be changed to after the giveaway is finished with no winners
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
                            // of the giveaway and trying to reroll the winners
                            onlyHostCanReroll: {
                                messageContent: ':x: | Only host of this giveaway can reroll the winners.'
                            },

                            // the new message that the giveaway message in giveaway channel will be changed to
                            // after the reroll
                            newGiveawayMessage: {
                                messageContent: ':tada: **GIVEAWAY REROLLED!** :tada:',

                                title: 'Giveaway',
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                                description: `Prize: **${giveaway.prize}**\nEntries: **${giveaway.entries}**\n` +
                                    `${giveaway.winnersCount == 1 ? 'Winner' : `Winners (${winnersCount})`}: ${mentionsString}`,

                                thumbnailURL: client.user?.displayAvatarURL({ size: 2048 }),
                                imageURL: client.user?.displayAvatarURL({ size: 2048 }),

                                footer: `Ended at:`,
                                timestamp: giveaway.endedTimestamp,
                                footerIcon: client.user?.displayAvatarURL({ size: 2048 })
                            },

                            // this message will be sent separately in the giveaway channel after the reroll
                            // used to mention the new giveaway winners
                            rerollMessage: {
                                messageContent: `${giveaway.winnersCount == 1 ? 'New winner is' : 'New winners are'} ` +
                                    `${mentionsString}, congratulations!`
                            },

                            // this ephemeral reply will be sent after the successful reroll
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
                    style: ButtonStyle.Success
                },

                // the "reroll" button to attach on the separated giveaway end message
                rerollButton: {
                    text: 'совершить план-скам',
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

    if (message.content.startsWith(prefix + 'force-end')) {
        const giveawayID = parseInt(args[0])

        if (!giveawayID) {
            message.reply(':x: | Giveaway ID should be specified.')
            return
        }

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }

        await giveaway.end()
        message.reply(`**${giveaway.prize}** giveaway (ID: **${giveaway.id}**) was ended forcefully.`)
    }

    if (message.content.startsWith(prefix + 'restart')) {
        const giveawayID = parseInt(args[0])

        if (!giveawayID) {
            message.reply(':x: | Giveaway ID should be specified.')
            return
        }

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }

        await giveaway.restart()
        message.reply(`**${giveaway.prize}** giveaway (ID: **${giveaway.id}**) was successfully restarted.`)
    }

    if (message.content.startsWith(prefix + 'extend')) {
        // get the required command arguments
        const giveawayID = parseInt(args[0])
        const time = args[1]

        // perform validation checks
        if (!giveawayID) {
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

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.extendLength(time)

        message.reply(`**${giveaway.prize}** giveaway's length (ID: **${giveaway.id}**) was successfully extended by **${time}**.`)
    }

    if (message.content.startsWith(prefix + 'reduce')) {
        // get the required command arguments
        const giveawayID = parseInt(args[0])
        const time = args[1]

        // perform validation checks
        if (!giveawayID) {
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

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.reduceLength(time)

        message.reply(`**${giveaway.prize}** giveaway's length (ID: **${giveaway.id}**) was successfully reduced by **${time}**.`)
    }

    if (message.content.startsWith(prefix + 'delete')) {
        const giveawayID = parseInt(args[0])

        if (!giveawayID) {
            message.reply(':x: | Giveaway ID should be specified.')
            return
        }


        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.delete()

        message.reply(`**${giveaway.prize}** giveaway's length (ID: **${giveaway.id}**) was successfully deleted.`)
    }

    if (message.content.startsWith(prefix + 'set-prize')) {
        const giveawayID = parseInt(args[0])

        if (!giveawayID) {
            message.reply(':x: | Giveaway ID should be specified.')
            return
        }

        const prize = args.slice(2).join(' ')

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.setPrize(prize)

        message.reply(`**${giveaway.prize}** giveaway's prize (ID: **${giveaway.id}**) was successfully set to **${prize}**.`)
    }

    if (message.content.startsWith(prefix + 'set-winners')) {
        const giveawayID = parseInt(args[0])

        if (!giveawayID) {
            message.reply(':x: | Giveaway ID should be specified.')
            return
        }

        const winners = args.slice(2).join(' ')

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.setWinnersCount(parseInt(winners))

        message.reply(`**${giveaway.prize}** giveaway's winners count (ID: **${giveaway.id}**) was successfully set to **${winners}**.`)
    }

    if (message.content.startsWith(prefix + 'set-host')) {
        const giveawayID = parseInt(args[0])

        if (!giveawayID) {
            message.reply(':x: | Giveaway ID should be specified.')
            return
        }

        const hostMemberID = args[2]

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.setHostMemberID(hostMemberID)

        message.reply(`**${giveaway.prize}** giveaway's host (ID: **${giveaway.id}**) was successfully changed to **<@${hostMemberID}>**.`)
    }

    if (message.content.startsWith(prefix + 'set-time')) {
        // get the required command arguments
        const giveawayID = parseInt(args[0])
        const time = args[1]

        // perform validation checks
        if (!giveawayID) {
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

        const giveaway = await giveaways.find(giveaway => giveaway.id == giveawayID)

        if (!giveaway) {
            message.channel.send(':x: | Giveaway not found.')
        }
        await giveaway.setTime(time)

        message.reply(`**${giveaway.prize}** giveaway's time (ID: **${giveaway.id}**) was successfully set to **${time}**.`)
    }

    // more examples coming soon!
})

// authenticate the bot in discord
client.login('MTEyMTQ5NDI2NTE2NDQ2ODM3Ng.GSr3gF.A6Dbunh7ierKMm4NLuuOu6jz7YsT7mpcYKJqG0')
