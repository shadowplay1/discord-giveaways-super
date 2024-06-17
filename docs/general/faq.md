# Discord Giveaways Super

[![Downloads](https://img.shields.io/npm/dt/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Stable Version](https://img.shields.io/npm/v/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Build Status](https://github.com/shadowplay1/discord-economy-super/workflows/build/badge.svg)](https://www.npmjs.com/package/discord-giveaways-super)

<b>Discord Giveaways Super</b> - Create and manage giveaways in [Discord](https://old.discordjs.dev/).

## ❓ | Frequently Asked Questions

### **Q:** How do I add requirements to join the giveaway?
### **A:** You can add up to **3** different types of join requirements for the giveaway:
- Having one of the required roles (array of **role IDs**)
- Not having any of the restricted roles (array of **role IDs**)
- Restriction of selected users (array of **user IDs**)

To add these restrictions, you will need to add the `participantsFilter` property inside your giveaway configuration in `Giveaways.start()` method. Here's how to do it:

In the example below:
- Setting up the **required roles** in `requiredRoles` setting in `participantsFilter` object in giveaway configuration.
- Setting up the **restricted roles** in `restrictedRoles` setting in `participantsFilter` object in giveaway configuration.
- Setting up the **restricted users** in `restrictedMembers` setting in `participantsFilter` object in giveaway configuration.

```ts
const myGiveaway = await giveaways.start({
    channelID: channel.id,
    guildID: message.guild.id,
    hostMemberID: message.author.id,
    prize: 'giveaway prize',
    time: '1d',
    winnersCount: 1,

    // example usage of participants filtering (only IDs are supported)
    participantsFilter: {
        requiredRoles: ['<@&841642867100221452>', '<@&669259475156205583>', '841642867100221452', '669259475156205583'],
        restrictedRoles: ['<@&692002313187098677>', '<@&765209398318465075>', '692002313187098677', '765209398318465075'],
        restrictedMembers: ['<@1121494265164468376>', '1121494265164468376']
    },

    // other giveaway settings...
})
```

### **Q:** How does this module work?
### **A:** 
- You setup the database details in `Giveaways` constructor:

```ts
const giveaways = new Giveaways(client, {
    database: DatabaseType.JSON // either DatabaseType.JSON, DatabaseType.MONGODB or DatabaseType.ENMAP,

    connection: {
        // database configuration object,
		// see https://dgs-docs.js.org/#/docs/main/1.1.0/general/configuring
		// for more info
    }
})
```

- Then, when starting a giveaway, you configure all the giveaway settings, messages and strings;
- The rest of the job will be done by the module!

### **Q:** Is there `EmbedBuilder` support to configure giveaway messages as embeds?
### **A:** Not at the moment, but this will added in the future!

### **Q:** Is there support for (X) database?
### **A:** At the moment, there's only support for 3 databases: **JSON**, **MongoDB** and **Enmap**, but support for other databases may be added in the future as well! 

> Don't forget that all strings definitions settings are optional and they're being replaced with fallback values if omitted, no need to be scared of the big configuration :)

### **Q:** How do I disable the post-install console message?
### **A:** Head to your `package.json` and add the following property:
```json
"discord-giveaways-super": {
  "postinstall": false
}
```
To enable the message back, just change the value of `postinstall` property back to `true` or completely delete this property as `postinstall` always defaults to `true`.

Got a question? Feel free to ask it in our [Support Server](https://discord.gg/4pWKq8vUnb)!

## ❗ | Useful Links
<ul>
<li><b><a href = "https://www.npmjs.com/package/discord-giveaways-super">NPM</a></b></li>
<li><b><a href = "https://dgs-docs.js.org/#/docs/main/1.1.0/general/faq">Frequently Asked Questions</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-giveaways-super">GitHub</a></b></li>
<li><b><a href = "https://github.com/shadowplay1/discord-giveaways-super/tree/main/examples">Examples</a></b></li>
<li><b><a href = "https://discord.gg/4pWKq8vUnb">Discord Server</a></b></li>
</ul>
<br>
<b>If you don't understand something in the documentation or you are experiencing problems, feel free to join our <a href = "https://discord.gg/4pWKq8vUnb">Support Server</a>.</b>
<br>
<b>Module Created by ShadowPlay.</b>

# ❤️ Thanks for choosing Discord Giveaways Super ❤️
