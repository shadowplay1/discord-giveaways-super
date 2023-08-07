"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.MessageUtils=void 0;const discord_js_1=require("discord.js"),giveawayTemplate_1=require("../../../structures/giveawayTemplate");class MessageUtils{_client;_giveaways;constructor(e){this._giveaways=e,this._client=e.client}buildGiveawayEmbed(e,t,s){const o=t?{...t}:{...e.messageProps?.embeds?.start||{}};for(const t in o){const i=o;i[t]=(0,giveawayTemplate_1.replaceGiveawayKeys)(i[t],e,s)}const{title:i,titleIcon:n,color:a,titleURL:r,description:l,footer:d,footerIcon:c,imageURL:u,thumbnailURL:m,timestamp:w}=o,y=(new discord_js_1.EmbedBuilder).setAuthor({name:i||null,iconURL:n,url:r}).setDescription(l||`**${e.prize}** giveaway has started with **${e.entriesCount}** entries! Press the button below to join!`).setColor(a||"#d694ff").setImage(u||null).setThumbnail(m||null).setFooter({text:d||null,iconURL:c});return w&&y.setTimestamp(new Date(parseInt(w.toString()))),y}buildButtonsRow(e){return(new discord_js_1.ActionRowBuilder).addComponents(new discord_js_1.ButtonBuilder({customId:"joinGiveawayButton",label:e?.text||"Join the giveaway",emoji:e?.emoji||"🎉",style:e?.style||discord_js_1.ButtonStyle.Primary}))}buildGiveawayFinishedButtonsRow(e,t,s){const o=new discord_js_1.ActionRowBuilder;return t?o.addComponents(new discord_js_1.ButtonBuilder({customId:"rerollButton",label:e?.text||"Reroll",emoji:e?.emoji||"🔁",style:e?.style||discord_js_1.ButtonStyle.Primary}),new discord_js_1.ButtonBuilder({label:t?.text||"Go to Message",emoji:t?.emoji||"↗️",style:discord_js_1.ButtonStyle.Link,url:s})):o.addComponents(new discord_js_1.ButtonBuilder({customId:"rerollButton",label:e?.text||"Reroll",emoji:e?.emoji||"🔁",style:e?.style||discord_js_1.ButtonStyle.Primary})),o}buildGiveawayRerollButtonRow(e){return(new discord_js_1.ActionRowBuilder).addComponents(new discord_js_1.ButtonBuilder({customId:"rerollButton",label:e?.text||"Reroll",emoji:e?.emoji||"🔁",style:e?.style||discord_js_1.ButtonStyle.Primary}))}buildGiveawayFinishedButtonsRowWithoutRerollButton(e,t){return(new discord_js_1.ActionRowBuilder).addComponents(new discord_js_1.ButtonBuilder({label:e?.text||"Go to Message",emoji:e?.emoji||"↗️",style:discord_js_1.ButtonStyle.Link,url:t}))}async editEntryGiveawayMessage(e){const t=e.messageProps?.embeds?.start||{},s=this._client.channels.cache.get(e.channelID),o=this.buildGiveawayEmbed(e),i=this.buildButtonsRow(e.messageProps?.buttons.joinGiveawayButton),n=await s.messages.fetch(e.messageID);await n.edit({content:t?.messageContent,embeds:1==Object.keys(t).length&&t?.messageContent?[]:[o],components:[i]})}async editFinishGiveawayMessage(e,t,s,o=!0,i){const n=e.messageProps?.embeds?.finish,a=s||n?.newGiveawayMessage||{},r=e.messageProps?.embeds?.finish?.noWinnersNewGiveawayMessage||{},l=this._client.channels.cache.get(e.channelID),d={...a,color:a?.color||"#d694ff",description:a?.description||"Giveaway is over!"},c={...a,color:r?.color||"#d694ff",description:r?.description||"There are no winners in this giveaway!"},u=t?.length>=this._giveaways.options.minGiveawayEntries,m=u?d:c,w=this.buildGiveawayEmbed(e,m,t),y=this.buildGiveawayEmbed(e,u?d:n?.noWinnersEndMessage,t),g=this.buildGiveawayFinishedButtonsRowWithoutRerollButton(e.messageProps?.buttons.goToMessageButton,e.messageURL),_=this.buildGiveawayRerollButtonRow(e.messageProps?.buttons.rerollButton),b=await l.messages.fetch(e.messageID),h=m.messageContent,j=(0,giveawayTemplate_1.replaceGiveawayKeys)(u?i?.messageContent||n?.endMessage.messageContent:n?.noWinnersEndMessage?.messageContent,e,t),B=u?Object.keys(n?.endMessage||{}):Object.keys(n?.noWinnersEndMessage||{});await b.edit({content:h,embeds:1==Object.keys(m).length&&h?[]:[w],components:u?[_]:[]}),o&&await b.reply({content:j,embeds:1==B.length&&j?[]:[y],components:[g]})}}exports.MessageUtils=MessageUtils;
