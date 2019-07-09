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
      type: TYPES.UTILITY,
      args: "{#channel} {'message in quotations'}",
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    message.delete().catch(e => {})

    let string = args[1]

    if (args[1]) {
      let channelMention = message.mentions.channels.first()
      if (!channelMention) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
      if (!message.guild.channels.get(channelMention.id)) return this.error(ERROR.INVALID_CHANNEL, { message, args })
    }

    if (!string) {
      string = args[0]
    }

    if (string.toLowerCase().includes("@everyone") || string.toLowerCase().includes("@here")) {
      if(!message.member.hasPermission("MENTION_EVERYONE")) return this.error({message: "You don't have permission to mention everyone!"}, {message, args})
    }

    let mentionChannel = message.mentions.channels.first()

    if (!mentionChannel && !args[1] || mentionChannel && !args[1]) {
      console.log("send to local channel")
      message.channel.send(string)
    } else {
      console.log("send to other channel")
      try {
        let channel = message.guild.channels.get(message.mentions.channels.first().id)
        if (!channel.permissionsFor(message.author.id).has("SEND_MESSAGES")) return message.channel.send("You don't have permission to send messages to this channel!")
        channel.send(string).catch(e => console.error(e))
      } catch (err) {
        console.log(err)
        return message.channel.send('You can only send messages to a channel in this server!')
      }
    }
  }
}
