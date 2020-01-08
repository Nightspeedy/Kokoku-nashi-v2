const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed, MessageMentions } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'say',
      description: 'Make the bot say something',
      type: TYPES.UTILITY,
      args: '[#channel] {...message}',
      cooldownTime: 10 * 1000
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    let destination

    // Check if the first argument is a channel.
    const matches = args[0].match(MessageMentions.CHANNELS_PATTERN)
    if (matches && args.length > 1) {
      destination = this.bot.channels.get(matches[0].substr(2, matches[0].length - 3)) // HACK
      if (destination && destination.guild === message.guild && destination.permissionsFor(message.author).has('SEND_MESSAGES')) {
        // Don't send destination channel name.
        args = args.slice(1)
      } else {
        // Error if you can't send to the channel.
        return this.error({ message: 'You can\'t send messages to this channel.' }, { message })
      }
    } else {
      // Otherwise, send to the channel where we called from.
      destination = message.channel
    }
    let content = args.join(' ')

    // Clean mentions.
    // Taken from Message.cleanContent()
    content = content.replace(/@(everyone|here)/g, '@\u200b$1')
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, '')
        if (message.channel.type === 'dm' || message.channel.type === 'group') {
          return this.bot.users.has(id) ? `@${this.bot.users.get(id).username}` : input
        }

        const member = message.channel.guild.members.get(id)
        if (member) {
          if (member.nickname) return `@${member.nickname}`
          return `@${member.user.username}`
        } else {
          const user = this.bot.users.get(id)
          if (user) return `@${user.username}`
          return input
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = this.bot.channels.get(input.replace(/<|#|>/g, ''))
        if (channel) return `#${channel.name}`
        return input
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (message.channel.type === 'dm' || message.channel.type === 'group') return input
        const role = message.guild.roles.get(input.replace(/<|@|>|&/g, ''))
        if (role) return `@${role.name}`
        return input
      })
    //

    // Put the message in an embed.
    const embed = new RichEmbed(content)
      .setFooter(message.author.tag, message.author.displayAvatarURL)
      .setTitle(content)
      .setTimestamp(new Date())

    message.delete()
    await destination.send(embed)
  }
}
