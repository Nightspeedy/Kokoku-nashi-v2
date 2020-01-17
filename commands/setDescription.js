const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'setdescription',
      aliases: ['set-description', 'description'],
      description: 'Set your profile title',
      type: TYPES.SOCIAL,
      args: '["New description in quotations"]'
    })
  }

  async run ({ message, args, member }) {
    if (args[0] && !args[1]) {
      if (args[0] === 'reset') {
        try {
          await member.updateOne({ description: 'Much mystery' })
          return message.channel.send('Successfully updated profile information!').catch(e => {})
        } catch (e) {
          return message.channel.send('Profile information was not updated!').catch(e => {})
        }
      } else {
        const newDescription = String(args[0])
        if (newDescription.length > 90) return this.error({ message: 'Your description may not be longer than 90 characters!' }, { message, args })
        try {
          await member.updateOne({ description: args[0] })
          return message.channel.send('Successfully updated profile information!').catch(e => {})
        } catch (e) {
          return message.channel.send('Profile information was not updated!').catch(e => {})
        }
      }
    } else {
      return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    }
  }
}
