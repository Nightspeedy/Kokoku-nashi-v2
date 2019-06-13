const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'invite',
      aliases: ['inv'],
      description: 'Send the bot invite URL via DM',
      type: TYPES.UTILITY,
      args: '',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    message.author.send('Invite me to your server using this link: this.is.a.placeholder.com').catch(() => {
      message.channel.send("I coultn't DM you, have you disabled it in your account settings?")
    })
  }
}
