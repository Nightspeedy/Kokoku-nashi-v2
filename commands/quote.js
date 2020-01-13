const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

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
    // This uses the last fetched message from the user.
    if (args[0]) {
      const mentioned = await this.mention(args[0])
      var quoted = mentioned ? mentioned.lastMessage : undefined
    } else {
      return this.error({ message: 'Please specify a message or member to quote.' }, { message })
    }

    if (!quoted) {
      try {
        quoted = await message.channel.fetchMessage(args[0])
      } catch {
        return this.error({ message: "Couldn't find the given message.\nIf you used an ID, make sure it is from this channel." }, { message })
      }
    }

    if (!message.channel.nsfw && quoted.channel.nsfw) {
      return this.error({ message: 'Quoting messages from NSFW channels is not allowed in SFW channels.' }, { message })
    }

    const embed = new RichEmbed()
      .setAuthor(quoted.author.tag, quoted.author.displayAvatarURL)
      .setTitle(quoted.cleanContent)
      .setDescription(`[Link to message](${quoted.url})`)
      .setTimestamp(quoted.createdTimestamp)
    if (quoted.embeds) {
      embed.setFooter('Message contained an embed.')
    }

    await message.channel.send(embed)
  }
}
