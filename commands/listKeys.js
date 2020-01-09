const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Strings } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'listkeys',
      description: 'List all the keys with their value',
      type: TYPES.BOT_OWNER,
      args: 'no arguments'
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {
    
    let collection = await Strings.find({ })
    let embed = new RichEmbed()
      .setTitle("List of key-value pairs")
      .setColor(color)

    collection.map(index => embed.addField(`**${index.key}**`, `\`\`\`${index.value}\`\`\``))

    message.channel.send(embed)
  }
}
