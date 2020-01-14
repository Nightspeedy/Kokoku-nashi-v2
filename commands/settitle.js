
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'settitle',
      aliases: ['set-title', 'title'],
      description: 'Set your profile title',
      type: TYPES.SOCIAL,
      args: '["New title in quotations"]'
    })
  }

  async run ({ message, args, member }) {
    // Check if a user has not provided a 2nd argument
    if (args[0] && !args[1]) {
      if (args[0] === 'reset') {
        try {
          await member.updateOne({ title: 'Very title' })
          message.channel.send('Successfully updated profile information!').catch(e => {})
        } catch (e) {
          message.channel.send('Profile information was not updated!').catch(e => {})
        }
      } else {
        const newTitle = String(args[0])

        if (newTitle.length > 32) return this.error({ message: 'Your description may not be longer then 32 characters!' }, { message, args })

        try {
          await member.updateOne({ title: args[0] })
          message.channel.send('Successfully updated profile information!').catch(e => {})
        } catch (e) {
          message.channel.send('Profile information was not updated!').catch(e => {})
        }
      }
      // If a user provides a 2nd argument return this error
    }
    return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
  }
}
