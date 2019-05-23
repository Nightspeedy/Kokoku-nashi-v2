
const Command = require('@lib/command')
const PERMISSIONS = require('@lib/permissions')
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'say',
      description: 'Make the bot say something',
      type: 'social',
      args: "{#channel} {'message in quotations'}",
      permissions: [PERMISSIONS.SEND_MESSAGES]
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = false // Fetch the Member object from DB on trigger.

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
