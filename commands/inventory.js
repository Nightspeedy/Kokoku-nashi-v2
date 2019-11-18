const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Inventory } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'inventory',
      aliases: ['inv'],
      description: 'Check your inventory, see what you have!',
      type: TYPES.UTILITY,
      args: '[guideName]',
    }) // Pass the appropriate command information to the base class.
    this.embed = new RichEmbed()
    this.bot = bot
  }

  async run ({ message, args, color }) {
    if (!args[0]) {

      let inventory = await Inventory.find({ id: message.author.id })
      let string = inventory[0] ? this.makeString(inventory) : 'You have no items in your inventory'

      let embed = new RichEmbed()
      .setTitle(`${message.author.username}'s inventory`)
      .setDescription(inventory[0] ? `Items in inventory:\n\n${string}` : 'You dont have any items')
      .setColor(color)

      message.channel.send(embed)
    }
  }
  makeString(inventory) {
    let string
    inventory.forEach(item => {
      string += `${item.name} `
    });

    return string
  }
}