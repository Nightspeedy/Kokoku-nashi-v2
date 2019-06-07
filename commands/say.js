const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'say',
      description: 'Make the bot say something',
      type: TYPES.MOD_COMMAND,
      args: "{#channel} {'message in quotations'}",
      permissions: [PERMISSIONS.MODERATOR]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    message.delete()

    let string = args[1]

    if (!string) {
      string = args[0]
    }

    if (!message.mentions.channels.first()) {
      message.channel.send(string)
    } else {
      try {
        message.guild.channels.get(message.mentions.channels.first().id).send(string)
      } catch (err) {
        message.channel.send('**ERROR!** You can only send messages to a channel in this server!')
      }
    }
  }
}
