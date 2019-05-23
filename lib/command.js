const { Message } = require('discord.js') // eslint-disable-line
const { Member, Guild, Permission } = require('@lib/models') // eslint-disable-line

module.exports = class Command {
  /**
   * The command class from which all commands extend from.
   * @param {Object} meta - {name, description}
   */
  constructor (meta) {
    this.fetch = {}

    // Initialize the command meta
    this.name = meta.name
    this.description = meta.description || ''
    this.type = meta.type
    this.args = meta.args
    this.permissions = meta.permissions || []
  }

  /**
   * Checks the command to be valid then runs {@link this.run}.
   * @param {Message} message - The Discord {@link Message} object to be executed.
   * @param {Array} args - An {@link Array} of arguments, derived from message content split by spaces.
   */
  async trigger (message, args, color) {
    let permission = await Permission.findOne({
      guild: message.guild.id,
      role: { $in: message.member.roles.array().map(role => parseInt(role.id)) }
    }) || { granted: [] }

    if (permission && this.permissions.length > -1) {
      let accessGranted = true
      this.permissions.forEach(required => {
        if (permission.granted.indexOf(required) === -1) { accessGranted = false }
      })

      // replace this with the new error handler later
      if (!accessGranted) return message.channel.send('Error: Permission')
    }

    let member, guild

    if (this.fetch.member) { member = await Member.findOne({ id: message.author.id }) }
    if (this.fetch.guild) { guild = await Guild.findOne({ id: message.guild.id }) }

    // we can add more pre-run checks here like permission etc.

    this.run({ message, args, member, guild, color })
  }

  /**
   * Executes the command, post-precheck
   * @param {Object} params - The {@link Object} containing the message, args and db fetch objects.
   */
  async run ({ message, args, member, guild, color }) {
    // To be overridden by class extension.
  }
}
