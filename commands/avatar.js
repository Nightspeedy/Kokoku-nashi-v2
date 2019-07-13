
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'avatar',
      description: "Get your avater, or someone else's",
      type: TYPES.UTILITY,
      args: '[@user]',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    let embed = new RichEmbed()
      .setColor(color)

    if (!args[0]) {
      embed.setTitle(message.author.tag)
        .setColor(color)
        .setDescription(`Here you go, |[Click me](${message.author.displayAvatarURL})|`)
        .setImage(message.author.displayAvatarURL)

      message.channel.send(embed).catch(e => {})
    }
    if (args[0]) {
      if (!message.mentions.users.first()) return this.error(ERROR.MEMBER_NOT_FOUND, {message, args})
      // if (message.mentions.users.first().bot) return message.channel.send("**Error!** Target user is a bot!");

      embed.setTitle(message.mentions.users.first().tag)
        .setColor(color)
        .setDescription(`Here you go, |[Click me](${message.mentions.users.first().displayAvatarURL})|`)
        .setImage(message.mentions.users.first().displayAvatarURL)

      message.channel.send(embed).catch(e => {})
    }
  }
}
