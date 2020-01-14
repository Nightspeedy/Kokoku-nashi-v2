const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')
const { Inventory } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'inventory',
      aliases: ['inv'],
      description: 'Check your inventory, see what you have!',
      type: TYPES.UTILITY,
      args: '[guideName]'
    })
  }

  async run ({ message, args }) {
    if (!args[0]) {
      const inventory = await Inventory.find({ id: message.author.id })

      message.channel.send({
        embed: {
          title: `${message.author.username}'s inventory`,
          description: inventory.length === 0 ? 'You don\'t have any items.' : undefined,
          fields: this.makeFields(inventory)
        }
      })
    }
  }

  underscoreToName (undescored) {
    return undescored
      .split('_')
      .map(split => split.charAt(0).toUpperCase() + split.slice(1).toLowerCase())
      .join(' ')
  }

  makeFields (inventory) {
    const categories = {}
    for (const item of inventory) {
      if (!categories[item.category]) categories[item.category] = []
      categories[item.category].push(item)
    }

    return Object.keys(categories).map(key => ({
      name: this.underscoreToName(key),
      value: categories[key].map(item => `\`${this.underscoreToName(item.name)}\``).join(' ')
    }))
  }
}
