const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { Strings } = require('@lib/models')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'listkeys',
      description: 'List all the keys with their value',
      type: TYPES.BOT_OWNER,
      args: 'no arguments'
    })
  }

  async run ({ message, color }) {
    const collection = await Strings.find({ })
    const embed = new RichEmbed()
      .setTitle('List of key-value pairs')
      .setColor(color)

    collection.map(index => embed.addField(`**${index.key}**`, `\`\`\`${index.value}\`\`\``))

    message.channel.send(embed)
  }
}
