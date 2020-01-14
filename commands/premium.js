const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Guild } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'premium',
      description: 'Set the server\'s premium status',
      type: TYPES.BOT_OWNER,
      args: '{true/false}'
    })
    this.fetch.guild = true
  }

  async run ({ message, args, guild, color }) {
    // Error checking
    if (!guild) return this.error(ERROR.OTHER, { message, args })
    if (!args[0] || args[1]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    const embed = new RichEmbed()
      .setTitle('Premium')
      .setColor(color)

    switch (args[0]) {
      case 'true':
        try {
          await guild.updateOne({ isPremium: true })
          embed.addField('Status updated!', 'Premium enabled!')
        } catch (e) {
          return message.channel.send('Premium status was not updated!').catch(e => {})
        }
        break
      case 'false':
        try {
          await guild.updateOne({ isPremium: false })
          embed.addField('Status updated!', 'Premium disabled!')
        } catch (e) {
          return message.channel.send('Premium status was not updated!').catch(e => {})
        }
    }

    return message.channel.send(embed).catch(e => {})
  }
}
