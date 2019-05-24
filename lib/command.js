const { Message } = require('discord.js') // eslint-disable-line
const { Member, Guild, Permission } = require('@lib/models') // eslint-disable-line
const TYPES = require('@lib/types')
const CONSTANTS = require('@lib/consts')

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
    switch (this.type) {
      case TYPES.GUILD_OWNER:
        if (message.guild.ownerID !== message.author.id) return message.channel.send('Error: Permission')
        break
      case TYPES.BOT_OWNER:
        if (CONSTANTS.OWNERS.indexOf(message.author.id) === -1) return message.channel.send('Error: Permission')
        break
      default:
        let permissions = await Permission.find({
          guild: message.guild.id,
          role: { $in: message.member.roles.array().map(role => parseInt(role.id)) }
        }) || { granted: [] }

        let accessGranted = true
        permissions.reduce(permission => {
          if (permission && this.permissions.length > -1) {
            this.permissions.forEach(required => {
              if (permission.granted.indexOf(required) === -1) { accessGranted = false }
            })
          }
        })
        // TODO: replace this with the new error handler later
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
