const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'top',
      description: 'List the top 10 users based on reputation or level.',
      type: TYPES.SOCIAL,
      args: '["level" or "reputation"]'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    let order = 'reputation'

    if (args && args[0] && args[0].charAt(0) === 'l') {
      order = 'level'
      // Sort by Level first
      var collection = await Member.aggregate([{ $sort: { level: -1, exp: -1, reputation: -1 } }, { $limit: 10 }]) // eslint-disable-line
    } else {
      // Sort by Rep first
      var collection = await Member.aggregate([{ $sort: { reputation: -1, level: -1, exp: -1 } }, { $limit: 10 }]) // eslint-disable-line
    }

    const embed = new RichEmbed().setColor(color).setDescription(`Top 10 ${order} of users`)

    for (const userData of collection) {
      const user = await this.bot.fetchUser(userData.id)

      const fieldText = order === 'level'
        ? `Level: ${userData.level}\nExperience: ${userData.exp}`
        : `Reputation: ${userData.reputation}`

      embed.addField(`${user.username}#${user.discriminator}`, fieldText)
    }

    message.channel.send(embed)
  }
}
