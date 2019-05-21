const Command = require('@lib/command')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'help',
      description: "The help command, you're using this dummy!"
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.
  }

  async run ({ message, args, member }) {
    message.reply(JSON.stringify(member))
  }
}
