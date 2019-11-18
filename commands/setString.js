const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Strings } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'setstring',
      description: 'Change a string value',
      type: TYPES.BOT_OWNER,
      args: '{key} {value}'
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {
    if (!args[0] || !args[1]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    let keyValuePair = await Strings.findOne({ key: args[0] })
    const keys = await Strings.find({ })

    if (!keyValuePair) {
      await Strings.create({ key: args[0], value: args[1] })
      message.channel.send("Created a new KVP");
    } else {
      try {
        await keyValuePair.update({ value: args[1] })
        keyValuePair = await Strings.findOne({ key: args[0] })
        this.success('Success!', 'Updated KeyValue pair successfully!', { message })
      } catch (e) {
        console.log(e)
        if (e) return this.error(ERROR.UNKNOWN_ERROR, { message, args })
      }
    }
  }
}
