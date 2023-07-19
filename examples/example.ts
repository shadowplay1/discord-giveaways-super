import { ButtonStyle, Client, Partials } from 'discord.js'
import { DatabaseType, Giveaways, IGiveawayButtons } from '../src/index'

const { Channel, GuildMember, Message, User } = Partials

const client = new Client({
    rest: {
        offset: 0,
        timeout: 120000
    },
    partials: [Channel, GuildMember, Message, User],
    intents: [
        'Guilds', 'GuildMembers', 'GuildMessages',
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


giveaways.on('ready', async () => {
    console.log('Giveaways module is ready!')
})

client.on('ready', async () => {
    console.log(`${client.user?.tag} is ready!`)
})

client.on('messageCreate', async message => {
    const prefix = '!'
    const args = message.content.slice(prefix.length).split(' ').slice(1)

    const time = args[0]
    const winnersCount = parseInt(args[1])
    const prize = args.slice(2).join(' ')

    const giveawayButtons: IGiveawayButtons = {
        joinGiveawayButton: {
            text: 'sosi',
            emoji: '851818803637125120',
            style: ButtonStyle.Success
        },

        rerollButton: {
            text: 'совершить план-скам',
            emoji: '🤯',
            style: ButtonStyle.Primary
        },

        goToMessageButton: {
            text: 'портал нахуй',
            emoji: '💀'
        }
    }

    if (message.content.startsWith(prefix + 'giveaway-start')) {
        const newGiveaway = await giveaways.start({
            channelID: message.channel.id,
            guildID: message.guild?.id || '',
            hostMemberID: message.author.id,
            prize,
            time,
            winnersCount,

            // defining all the messages for the giveaway
            // EmbedBuilder support will be added later
            defineEmbedStrings(giveaway, host) {
                return {
                    joinGiveawayMessage: {
                        messageContent: ':white_check_mark: | You have joined the giveaway!'
                    },

                    leaveGiveawayMessage: {
                        messageContent: ':white_check_mark: | You have left the giveaway!'
                    },

                    start: {
                        messageContent: ':tada: GIVEAWAY STARTED! :tada:',

                        title: 'Giveaway',
                        titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                        description: `Prize: **${giveaway.prize}**.\nWinners: **${giveaway.winnersCount}**\n` +
                            `Entries: **${giveaway.entries}**\nHost: **${host.username}**\nEnds at: <t:${giveaway.endTimestamp}:R>`,

                        thumbnailURL: client.user?.displayAvatarURL({ size: 2048 }),
                        imageURL: client.user?.displayAvatarURL({ size: 2048 }),
                    },

                    finish(mentionsString, winnersCount) {
                        return {
                            endMessage: {
                                messageContent: `Congratulations ${mentionsString} on winning **${giveaway.prize}**!`
                            },

                            newGiveawayMessage: {
                                messageContent: ':tada: GIVEAWAY FINISHED! :tada:',

                                title: 'finished',
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                                description: `${giveaway.winnersCount == 1 ? 'какой-то лох' : 'какие-то лохи'} ${mentionsString} (**${winnersCount}** winners) выиграл **${giveaway.prize}** среди **${giveaway.entries}** участников.`,

                                thumbnailURL: client.user?.displayAvatarURL({ size: 2048 }),
                                imageURL: client.user?.displayAvatarURL({ size: 2048 }),
                            },

                            noWinners: {
                                description: `no winners in **${giveaway.prize}** haha`
                            },

                            noWinnersEndMessage: {
                                messageContent: `Unfortunetly, there are no winners in the **${giveaway.prize}** giveaway.`
                            }
                        }
                    },

                    reroll(mentionsString, winnersCount) {
                        return {
                            onlyHostCanReroll: {
                                messageContent: '💀'
                            },

                            newGiveawayMessage: {
                                messageContent: '@every3 rerolled',

                                title: 'бб',
                                titleIcon: client.user?.displayAvatarURL({ size: 2048 }),

                                description: `новы${giveaway.winnersCount == 1 ? 'й лох' : 'е лохи'} ${mentionsString} (**${winnersCount}** winners) выиграл **${giveaway.prize}** среди **${giveaway.entries}** участников.`,

                                thumbnailURL: client.user?.displayAvatarURL({ size: 2048 }),
                                imageURL: client.user?.displayAvatarURL({ size: 2048 }),
                            },

                            rerollMessage: {
                                messageContent: `New winner${giveaway.winnersCount == 1 ? ' is' : 's are'} ${mentionsString}, congratulations!`
                            },

                            successMessage: {
                                messageContent: '🤯 ПЛАН СКАМ ВЫПОЛНЕН УСПЕШНО! 🤯'
                            }
                        }
                    }
                }
            },

            buttons: giveawayButtons
        })

        message.channel.send({
            content: `**${newGiveaway.prize}** giveaway (ID: **${newGiveaway.id}**) has started  -----> ${newGiveaway.messageURL}`
        })
    }

    // more examples coming soon!
})
