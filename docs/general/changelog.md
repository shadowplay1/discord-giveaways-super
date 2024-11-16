# Discord Giveaways Super

[![Downloads](https://img.shields.io/npm/dt/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Stable Version](https://img.shields.io/npm/v/discord-giveaways-super?style=for-the-badge)](https://www.npmjs.com/package/discord-giveaways-super)
[![Build Status](https://github.com/shadowplay1/discord-economy-super/workflows/build/badge.svg)](https://www.npmjs.com/package/discord-giveaways-super)

<b>Discord Giveaways Super</b> - Create and manage giveaways in [Discord](https://old.discordjs.dev/#/).

## ⏰ | Changelog

**v1.1.1**:
- Minor JSDoc & types fixes.
- Now the array of giveaway winners is being represented in a `Set` instead of an array.
- Fixed the crash when giveaway guild/host member/channel **cannot** be fetched.
- Fixed the `embedStrings.finish.endMessage` being **unused**.
- Fixed the default giveaway button text being **forced** if it's not specified.
- Minor bug fixes.

**v1.1.0**:
- Fixed `DiscordID` types bug in `Giveaways.start()` method.
- Fixed the incorrect giveaway end timestamp being assigned on giveaway start.
- Fixed inconsistencies after the giveaway being deleted.
- Improved the time strings validation.
- Improved internal types.
- Added the `Giveaway.winners` property that saves an array of user IDs who won the giveaway.
- Added giveaways participants filters object in `Giveaways.start()` method - now you can **restrict** members from participating in a giveaway if they don't have any of the **required** roles or if they have any of the **forbidden** roles, or you can now restrict the **members** themselves from joining your giveaway!
- - Added a `participantsFilter` object in `Giveaway.start()` configuration;
- - Added the `restrictionsMessages` embed strings definition callback so you could define the messages that are being sent in various join rejection cases! 

Here's how you can use this new feature:

```ts
const newGiveaway = await giveaways.start({
    // ... (other giveaway settings)
    
    // example usage of participants filtering (only IDs are supported)
    participantsFilter: {
        requiredRoles: ['<@&841642867100221452>', '<@&669259475156205583>', '841642867100221452', '669259475156205583'],
        restrictedRoles: ['<@&692002313187098677>', '<@&765209398318465075>', '692002313187098677', '765209398318465075'],
        restrictedMembers: ['<@1121494265164468376>', '1121494265164468376']
    },

    defineEmbedStrings(giveaway, host, participantsFilters) {
        return {
            // ... (other strings definitions)

            restrictionsMessages(memberMention) {
                return {
                    hasNoRequiredRoles: {
                        messageContent: `:x: | ${memberMention}, you **must** have at least one of the following roles ` +
                            `to join this giveaway: ${participantsFilters.requiredRoles?.join(', ')}`
                    },

                    hasRestrictedRoles: {
                        messageContent: `:x: | ${memberMention}, you **cannot** have any of the following roles ` +
                            `to join this giveaway: ${participantsFilters.restrictedRoles?.join(', ')}`
                    },

                    memberRestricted: {
                        messageContent: `:x: | ${memberMention}, you're **not allowed** to join this giveaway.`
                    }
                }
            }

            // ... (other strings definitions)
        }
    }
})
```

- Bumped `discord.js` to the latest stable version.
- Renamed the `Giveaway.entriesArray` property to `Giveaway.entries`. Please note that this is **not** the type of `Object.entries()` method, but a property that shows all the users who joined the giveaway.
- Improved **[Frequently Asked Questions](https://dgs-docs.js.org/#/docs/main/1.0.5/general/faq)** page and added more useful and frequently asked questions about the module.
- Fixed some documentation typos and mismatches.
- Made some minor bugfixes, types improvements & JSDoc improvements.

**v1.0.5**:
- Renamed the `checkingCountdown` option from JSON configuration options to `checkingInterval` so it would make more sense.
- Added the database configurtion examples in documentation.

**v1.0.3**:
- Fixed the `INVALID_TARGET_TYPE` error on first-time giveaway creation in MongoDB.
- Fixed the giveaway winners reroll not happening after sending the success reroll message.
- Fixed typos.
- Various minor fixes & improvements.
- Reduced the package size by 3 times.
- Now the compiled code is being minified.
- Fixed documentation links leading to the incorrect docs website.
- Replaced the homepage URL with documentation website.
- Reworked the main README.md file.
- Added module's keywords in `package.json` file.
- Fixed the incorrect database type being displayed in debug logs.
- Added missing types in type arguments descriptions in `CacheManager`.
- Added debug logs on all database operations.

**v1.0.0**:
- Initial module release.

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
