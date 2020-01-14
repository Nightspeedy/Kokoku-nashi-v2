const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'reminder',
      aliases: ['remind'],
      description: 'Reminds you of something in several minutes.',
      type: TYPES.UTILITY,
      args: '{time in minutes} {...message to send}'
    })
  }

  async run ({ message, args }) {
    const minutes = parseInt(args[0])
    const content = args.slice(1).join(' ')

    if (!minutes || minutes <= 0 || !content) {
      return this.error(ERROR.INVALID_ARGUMENTS, { message })
    }

    const timedAction = await this.bot.timedActionHandler.push('sendDM', minutes * 60 * 1000, {
      userID: message.author.id,
      content: {
        embed: {
          title: `${minutes} minute${minutes !== 1 ? 's' : ''} ago you asked to be reminded of:`,
          description: content
        }
      }
    })

    if (!timedAction) {
      console.error(timedAction)
      this.error(ERROR.UNKNOWN_ERROR, { message, args })
    } else {
      this.success('Reminder set', `Successfully set a reminder for ${minutes} minute${minutes !== 1 ? 's' : ''} from now.`, { message })
    }
  }
}
