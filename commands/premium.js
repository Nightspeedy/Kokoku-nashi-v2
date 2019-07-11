const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Guild } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'premium',
      description: 'Set the server\'s premium status',
      type: TYPES.BOT_OWNER,
      args: '{true/false}'
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {
    // Error checking
    if (!guild) return this.error(ERROR.OTHER, { message, args })
    if (!args[0] || args[1]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    let embed = new RichEmbed()
      .setTitle('Premium')
      .setColor(color)

    switch (args[0]) {
      case 'true':
        await guild.updateOne({ isPremium: true })
        guild = await Guild.findOne({ id: guild.id })
        if (guild.isPremium) {
          embed.addField('Status updated!', 'Premium enabled!')
        } else {
          return message.channel.send('Premium status was not updated!').catch(e => {})
        }
        break
      case 'false':
        await guild.updateOne({ isPremium: false })
        guild = await Guild.findOne({ id: guild.id })
        if (guild.isPremium == false) {
          embed.addField('Status updated!', 'Premium disabled!')
        } else {
          message.channel.send('Premium status was not updated!').catch(e => {})
        }
        break
    }

    message.channel.send(embed).catch(e => {})
  }
}
