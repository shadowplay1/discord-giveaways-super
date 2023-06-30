const { ButtonStyle, Client, Partials } = require('discord.js')
const { DatabaseType, Giveaways } = require('../src/index')

const { Channel, GuildMember, Message, Reaction, User } = Partials

const client = new Client({
    rest: {
        offset: 0,
        timeout: 120000
    },
    partials: [Channel, GuildMember, Message, Reaction, User],
    intents: [
        // priveleged intents
        'GuildMembers', 'GuildPresences', 'GuildMessages',

        // other intents
        'Guilds', 'GuildBans', 'GuildEmojisAndStickers', 'GuildIntegrations',
        'GuildInvites', 'GuildMessageReactions',
        'GuildMessageTyping', 'GuildVoiceStates', 'GuildWebhooks',
        'DirectMessages', 'DirectMessageReactions', 'DirectMessageTyping',
        'MessageContent'
    ]
})

// using JSON database for this example
// you can use any database the module provides
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

    if (message.content.startsWith(prefix + 'giveaway-start')) {
        // coming soon!
    }

    // more examples coming soon!
})
