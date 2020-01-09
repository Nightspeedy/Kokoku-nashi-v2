const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { Strings } = require('@lib/models')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'listkeys',
      description: 'List all the keys with their value',
      type: TYPES.BOT_OWNER,
      args: 'no arguments'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {
    const collection = await Strings.find({ })
    let keys = ''

    collection.map(index => { keys += `key \`${index.key}\` with value: \`${index.value}\`\n\n` })

    if (keys.length >= 2000) return this.error({ message: 'Message is too big to send!' }, { message, args })

    message.channel.send(keys)
  }
}
