# Discord Giveaways Super

[![Downloads](https://img.shields.io/npm/dt/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Stable Version](https://img.shields.io/npm/v/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Build Status](https://github.com/shadowplay1/discord-economy-super/workflows/build/badge.svg)](https://www.npmjs.com/package/discord-giveaways-super)

<b>Discord Giveaways Super</b> - Create and manage giveaways in [Discord](https://old.discordjs.dev/#/).

## Introduction

In giveaway options object object in `start` method of the `Giveaways` class, you can customize the appearance of giveaway-related messages by defining "embed strings" Embed strings allow you to create and style messages using Discord Embeds.

## Overview

Embed strings are objects that define the content and appearance of various messages associated with a giveaway. These messages include:

- The message sent when a user joins the giveaway.
- The message sent when a user leaves the giveaway.
- The initial giveaway start message.
- The giveaway finish messages to be edited to (when winners are chosen).
- The giveaway reroll messages to be edited to (when winners are rerolled).

## Available Embed Strings Properties
Here are some common properties you can use within the embed strings:

`messageContent`: The text content of the message.
`title`: The title of the embed.
`description`: The main content of the embed.
`footer`: The text displayed in the footer of the embed.
`timestamp`: The timestamp displayed in the embed footer.
`thumbnailURL`: The URL of the thumbnail image.
`imageURL`: The URL of the main image in the embed.

**Important Notice**: specifying only `messageContent` property will generate a normal text message without any embeds. Using `messageContent` alongside other embed properties will attach the text of `messageContent` above the displayed embed as message content.

You can also include dynamic giveaway variables provided by the strings definitions functions like `${giveaway.prize}`, `${giveaway.winnersCount}`, and ${mentionsString} to insert the actual values during runtime.

## Defining Embed Strings

To customize these messages, you can define different properties within the embed string objects. Here's an example of how to define embed strings in the `defineEmbedStrings` function of giveaway starting options:

```ts
await giveaway.start({
	// ... (other giveaway starting options)

	defineEmbedStrings(giveaway, host, participantsFilters) {
	    return {
	        joinGiveawayMessage: {
	            messageContent: 'You have joined the giveaway!'
	        },

			leaveGiveawayMessage: {
	            messageContent: 'You have left the giveaway!'
	        },

	        // ... (other messages)

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

	        	// ... (other properties)
	        }
	    },

	    finish(mentionsString, winnersCount) {
	        return {
	            endMessage: {
	                messageContent: `Congratulations ${mentionsString} on winning **${giveaway.prize}**!`
	            },
	            // ... (other properties)
	        }
	    },

	    // ... (other messages)
	}

	// ... (other giveaway starting options)
})
```

You can also view the full Embed Strings configuration in the full [bot examples](https://github.com/shadowplay1/discord-giveaways-super/tree/main/examples).

## Buttons
You can also define buttons within the embed strings to provide interactive actions to users (such as "join giveaway", "go to message" and "reroll"). Buttons can have properties like text, emoji, and style.

There are 3 available buttons objects to set up:
- `joinGiveawayButton`
- `goToMessageButton`
- `rerollButton`

That's how the buttons configuration looks like:

```ts
await giveaway.start({
	// ... (other giveaway starting options)

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

	// ... (other giveaway starting options)
})

```

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
