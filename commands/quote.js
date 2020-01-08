const Command = require('@lib/command')
const TYPES = require('@lib/types')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed, MessageMentions } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'quote',
      aliases: ['q'],
      description: 'Quote a specific message, or a user\'s last message.',
      type: TYPES.SOCIAL,
      args: '{message id | @user}'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    if (MessageMentions.USERS_PATTERN.test(args[0])) {
      var quoted = message.channel.lastMessage // TODO: User's last message in the channel
    } else {
      console.log(args[0], typeof args[0])
      var quoted = await message.channel.fetchMessage(`${args[0]}`)
    }

    if (!quoted) {
      return this.error({ message: "Couldn't find the given message." }, { message })
    }

    const embed = new RichEmbed()
      .setAuthor(quoted.author.tag, quoted.author.displayAvatarURL)
      .setTitle(quoted.content)
      .setTimestamp(quoted.timestamp)

    await message.channel.send(embed)
  }
}
