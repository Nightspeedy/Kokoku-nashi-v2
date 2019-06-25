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

    // TODO: Fix problem with arg 1 becomming arg 0. This is turning arg 0 into a string removing the object it's supposed to contain
    if (args[0] != message.mentions.channels.first() || !string) {
      string = args[0]
    }

    if (string.toLowerCase().includes("@everyone" || "@here") && !message.member.hasPermission("MENTION_EVERYONE")) return this.error({message: "You don't have permission to mention everyone!"})

    if (!message.mentions.channels.first()) {
      message.channel.send(string)
    } else {
      
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
