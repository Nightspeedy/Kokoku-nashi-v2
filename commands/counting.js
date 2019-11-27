const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Counting } = require('@lib/models')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'counting',
      description: 'Configure the counting feature. To use; make a channel called Counting',
      type: TYPES.MOD_COMMAND,
      args: '{Setting} {Value}',
      permissions: [PERMISSIONS.COUNTING]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {

    let counting = await Counting.findOne({id: message.guild.id})

    if (!counting) return

    switch (args[0].toLowerCase()) {
      case 'enable':
          if (counting.countingEnabled) return this.error({message: "Counting is already enabled!"}, {message})
          try {
            await counting.updateOne({countingEnabled: true})
            message.channel.send("Saved configuration")
          } catch(e) {
            return this.error({message: "Failed to save setting, If this keeps happening. Please contact a developer"}, {message})
          }
        break
      case 'disable':
          if (!counting.countingEnabled) return this.error({message: "Counting is already disabled!"}, {message})
          try {
            await counting.updateOne({countingEnabled: true})
            message.channel.send("Saved configuration")
          } catch(e) {
            return this.error({message: "Failed to save setting, If this keeps happening. Please contact a developer"}, {message})
          }
        break
      case 'set-number':
          if (!args[1]) return this.error(ERROR.INVALID_ARGUMENTS, {message})
          if (isNaN(args[1])) return this.error({message: "That's not a number!"}, {message})
          try {
            await counting.updateOne({countingNumber: args[1]})
            message.channel.send("Saved configuration")
          } catch(e) {
            return this.error({message: "Failed to save setting, If this keeps happening. Please contact a developer"}, {message})
          }
        break
      case 'set-message':
        break
      default:
        return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    }
  }
}
