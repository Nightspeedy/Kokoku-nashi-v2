const { Message } = require('discord.js') // eslint-disable-line

module.exports = class Command {
  constructor (DB) {
    this.DB = DB
  }

  /**
   * Checks the command to be valid then runs {@link this.run}.
   * @param {Message} message - The Discord {@link Message} object to be executed.
   * @param {Array} args - An {@link Array} of arguments, derived from message content split by spaces.
   */
  async trigger (message, args) {
    let member, guild
    if (this.needs.member) { member = await this.DB.Member.findOne({ id: message.author.id }) }
    if (this.needs.guild) { guild = await this.DB.Guild.findOne({ id: message.guild.id }) }

    // we can add more pre-run checks here like permission etc.

    this.run(message, args, { member, guild })
  }

  /**
   * Executes the command, post-precheck
   * @param {Message} message - The Discord {@link Message} object to be executed.
   * @param {Array} args - An {@link Array} of arguments, derived from message content split by spaces.
   * @param {Object} fetched - The {@link Object}s fetched by {@link this.trigger}.
   */
  async run (message, args, fetched) {
    // To be overridden by class extension.
  }
}
