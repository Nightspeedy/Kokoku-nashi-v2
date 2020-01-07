const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'say',
      description: 'Make the bot say something',
      type: TYPES.UTILITY,
      args: "{#channel} {'message in quotations'}"
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    message.delete().catch(e => {})

    // Set the string to send to args[1] and check if it exists later
    let string = args[1]

    // Check if the user mentioned a channel.
    if (args[1]) {
      const channelMention = message.mentions.channels.first()
      if (!channelMention) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
      if (!message.guild.channels.get(channelMention.id)) return this.error(ERROR.INVALID_CHANNEL, { message, args })
    }

    // If no string, string = args[0]
    if (!string) {
      string = args[0]
    }

    // Check if the string to send includes @everyone or @here and check the user's permissions
    if (string.toLowerCase().includes('@everyone') || string.toLowerCase().includes('@here')) {
      if (!message.member.hasPermission('MENTION_EVERYONE')) return this.error({ message: "You don't have permission to mention everyone!" }, { message, args })
    }

    const mentionChannel = message.mentions.channels.first()

    // Send the message
    if (!mentionChannel) {
      // Send to current channel
      message.channel.send(string).catch(e => {})
    } else {
      // Send to mentioned channel, and check permissions.
      try {
        const channel = message.guild.channels.get(mentionChannel.id)
        if (!channel.permissionsFor(message.author.id).has('SEND_MESSAGES')) return this.error({ message: "You don't have permission to send messages to this channel!" }, { message, args })
        channel.send(string).catch(e => {})
      } catch (e) {
        console.log(e)
        return this.error({ message: 'You can only send messages to a channel in this server!' }, { message, args })
      }
    }
  }
}
