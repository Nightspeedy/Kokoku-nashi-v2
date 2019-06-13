const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'profile',
      aliases: ['account'],
      description: 'Shows your, or someone\'s profile!',
      type: TYPES.MOD_COMMAND,
      args: '[@mention]',
      permissions: [PERMISSIONS.KICK || PERMISSIONS.MODERATOR]
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true

    this.bot = bot
  }

  async run ({ message, args, member, color }) {

    if (!args[0]) {
 
      let nxtLvl = member.level * 200;

      const embed = new RichEmbed()
      .setTitle(message.author.username + "'s Profile")
      .setThumbnail(message.author.displayAvatarURL)
      .setColor(color)
      .addField("Level", member.level)
      .addField("Next level progress", member.exp + "/" + nxtLvl + " Exp")
      .addField("Reputation", member.reputation)
      .addField("Credits", member.credits);

      message.channel.send(embed);

  } else if (args[0]) {

      if (!member) return message.channel.send(this.error(ERROR.MEMBER_NOT_FOUND, { message, args }))
      //if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");

      let nxtLvl = member.level * botconfig.level;

      const embed = new RichEmbed()
      .setTitle(message.mentions.members.first().user.username + "'s Profile")
      .setThumbnail(message.mentions.members.first().user.displayAvatarURL)
      .setColor(color)
      .addField("Level", member.level)
      .addField("Next level progress", member.Values.exp + "/" + nxtLvl + " Exp")
      .addField("Reputation", member.reputation)
      .addField("Credits", member.credits);

      message.channel.send(embed);

    }
  }
}
