const Command = require('@lib/command')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'invite',
      description: "Send the bot invite URL via DM",
      type: 'utility',
      args: '',
      permissions: [PERMISSIONS.GENERAL]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    message.author.send("Invite me to your server using this link: this.is.a.placeholder.com").catch( () => {
        message.channel.send("I coultn't DM you, have you disabled it in your account settings?")
    })

  }
}
