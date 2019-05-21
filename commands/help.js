const Command = require('@lib/command')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'help',
      description: "The help command, you're using this dummy!"
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, member }) {
    message.reply(JSON.stringify(member))
  }
}
