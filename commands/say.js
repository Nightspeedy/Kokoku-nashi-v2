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
      permissions: [PERMISSIONS.SAY]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    message.delete().catch(e => {})

    let string = args[1]

    if (args[0] != message.mentions.channels.first()) {
      string = args[0]
    }

    if (args[1] && args[0] != typeof Object) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (!message.mentions.channels.first()) {
      message.channel.send(string)
    } else {
      try {
        message.guild.channels.get(message.mentions.channels.first().id).send(string)
      } catch (err) {
        return this.error({ message: 'You can only send messages to a channel in this server!' })
      }
    }
  }
}
