const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Counting, Guild } = require('@lib/models')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'counting',
      description: 'Configure the counting feature. To use; make a channel called Counting. {NUMBER} will be replaced with the last counted value \nAvailable: \nk!counting enable\nk!counting disable\nk!counting set-number [Number]\nk!counting set-description "description"\nk!counting set-double-message "Message to send for double posts"\nk!counting set-wrong-number "Message to send when someone counts a wrong number"',
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

    let guild = await Guild.findOne({id: message.guild.id})

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
      case 'set-description':
          if (!guild.isPremium) return this.error(ERROR.NEEDS_PREMIUM, {message})
          try {
            await counting.updateOne({countingDescription: args[1]})
            message.channel.send("Saved configuration")
          } catch(e) {
            return this.error({message: "Failed to save setting, If this keeps happening. Please contact a developer"}, {message})            
          }
        break
      case 'set-double-message':
          if (!guild.isPremium) return this.error(ERROR.NEEDS_PREMIUM, {message})
          try {
            await counting.updateOne({countingDoubleMessage: args[1]})
            message.channel.send("Saved configuration")
          } catch(e) {
            return this.error({message: "Failed to save setting, If this keeps happening. Please contact a developer"}, {message})            
          }
        break
      case 'set-wrong-number':
          if (!guild.isPremium) return this.error(ERROR.NEEDS_PREMIUM, {message})
          try {
            await counting.updateOne({countingWrongNumber: args[1]})
            message.channel.send("Saved configuration")
          } catch(e) {
            return this.error({message: "Failed to save setting, If this keeps happening. Please contact a developer"}, {message})            
          }
        break
      default:
        return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    }
  }
}
