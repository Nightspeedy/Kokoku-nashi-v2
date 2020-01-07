const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'cooldown',
      description: 'Dev command to test cooldown.',
      type: TYPES.UTILITY,
      args: 'Seconds'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    if (typeof args[0] !== 'number') return this.error(ERROR.INVALID_ARGUMENTS, { message })
    this.cooldown(args[0] * 1000, message.author)
    this.success('Chilly', `You've been placed on cooldown for ${args[0]} seconds.`, { message })
  }
}
