const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'profile',
      aliases: ['account'],
      description: 'Shows your, or someone\'s profile!',
      type: TYPES.SOCIAL,
      args: '[@mention]',
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
      .addField(member.title, member.description)
      .addField("Level", member.level)
      .addField("Next level progress", member.exp + "/" + nxtLvl + " Exp")
      .addField("Reputation", member.reputation)
      .addField("Credits", member.credits);

      message.channel.send(embed).catch(e => {})

    } else if (args[0]) {

      let mentionMember = await Member.findOne({id: message.mentions.users.first().id})

      if (!mentionMember) return this.error(ERROR.UNKNOWN_MEMBER, { message, args })
      if (message.mentions.users.first().bot) return this.error({message: "Bots dont have profiles!"}, {message, args});

      let nxtLvl = mentionMember.level * 200;

      const embed = new RichEmbed()
      .setTitle(message.mentions.users.first().username + "'s Profile")
      .setThumbnail(message.mentions.users.first().displayAvatarURL)
      .setColor(color)
      .addField(mentionMember.title, mentionMember.description)
      .addField("Level", mentionMember.level)
      .addField("Next level progress", mentionMember.exp + "/" + nxtLvl + " Exp")
      .addField("Reputation", mentionMember.reputation)
      .addField("Credits", mentionMember.credits);

      message.channel.send(embed).catch(e => {})

    }
  }
}
