const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'quote',
      aliases: ['q'],
      description: 'Quote a specific message, or a user\'s last message.',
      type: TYPES.SOCIAL,
      args: '{message id | @user}'
    })
  }

  async run ({ message, args }) {
    // This uses the last fetched message from the user.

    const mentioned = await this.mention(args[0])
    var quoted = mentioned ? mentioned.lastMessage : await message.channel.fetchMessage(`${args[0]}`) || null

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
      .setDescription(quoted.cleanContent)
      .setTimestamp(quoted.createdTimestamp)
      .setFooter(`\n[Link to message](${quoted.url})` + quoted.embeds.length ? 'Message contained an embed.' : '')

    await message.channel.send(embed)
  }
}
