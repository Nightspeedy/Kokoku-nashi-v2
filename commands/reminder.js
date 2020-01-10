const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'reminder',
      aliases: ['remind'],
      description: 'Reminds you of something in several minutes.',
      type: TYPES.UTILITY,
      args: '{time in minutes} {...message to send}'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, guild }) {
    const minutes = parseInt(args[0])
    const content = args.slice(1).join(' ')

    if (!minutes || !content) {
      return this.error(ERROR.INVALID_ARGUMENTS, { message })
    }

    await this.bot.timedActionHandler.push('sendDM', minutes * 60 * 1000, {
      userID: message.author.id,
      content: {
        embed: {
          title: `${minutes} minutes ago you asked to be reminded of:`,
          description: content
        }
      }
    })
  }
}
