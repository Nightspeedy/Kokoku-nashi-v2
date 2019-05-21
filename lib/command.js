const { Message } = require('discord.js') // eslint-disable-line
const Database = require('@lib/database') // eslint-disable-line

module.exports = class Command {
  /**
   * The command class from which all commands extend from.
   * @param {Object} meta - {name, description}
   */
  constructor (meta) {
    this.DB = undefined // This will be registered later by this.init
    this.fetch = {}

    // Initialize the command meta
    this.name = meta.name
    this.description = meta.description || ''
  }

  /**
   * Initiates the class in a function to avoid boilerplate in command files.
   * @param {Database} database - A pointer to the database object.
   */
  init (database) {
    this.DB = database
  }

  /**
   * Checks the command to be valid then runs {@link this.run}.
   * @param {Message} message - The Discord {@link Message} object to be executed.
   * @param {Array} args - An {@link Array} of arguments, derived from message content split by spaces.
   */
  async trigger (message, args) {
    let member, guild
    if (this.fetch.member) { member = await this.DB.Member.findOne({ id: message.author.id }) }
    if (this.fetch.guild) { guild = await this.DB.Guild.findOne({ id: message.guild.id }) }

    // we can add more pre-run checks here like permission etc.

    this.run({ message, args, member, guild })
  }

  /**
   * Executes the command, post-precheck
   * @param {Object} params - The {@link Object} containing the message, args and db fetch objects.
   */
  async run ({ message, args, member, guild }) {
    // To be overridden by class extension.
  }
}
