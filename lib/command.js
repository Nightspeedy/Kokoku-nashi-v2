const { Message } = require('discord.js') // eslint-disable-line
const { Member, Guild, Permission } = require('@lib/models') // eslint-disable-line
const TYPES = require('@lib/types')
const CONSTANTS = require('@lib/consts')
const PERMISSIONS = require('@lib/permissions')
const ERROR = require('@lib/errors.js')

module.exports = class Command {
  /**
   * The command class from which all commands extend from.
   * @param {Object} meta - {name, description}
   */
  constructor (meta) {
    this.fetch = {}

    // Initialize the command meta
    this.name = meta.name
    this.aliases = meta.aliases || []
    this.description = meta.description || ''
    this.type = meta.type
    this.args = meta.args
    this.permissions = meta.permissions || []
    this.commandHandler = { }
  }

  /**
   * Error handler.
   * @param {Object} error - One of the possible {@link ERROR} objects or a custom object with the same structure.
   * @param {Object} params - Containing the {@link Message} object and, optionally, the args {@link Object}.
   */
  error (error, { message, args }) {
    if (error.message) {
      // If the error contains a message, send a pretty embed with it.
      message.channel.send({ embed: {
        color: 0xff3333,
        title: 'An Error Occured',
        description: error.message,
        timestamp: new Date()
      } }).then(message => { message.delete(15000) }).catch(e => {})
    }
    if (error.function) {
      // If the error contains a custom function, run it.
      error.function({ message, args })
    }
    if (error.run) {
      let command = error.run
      command = command.replace(/{name}/, this.name) // replace {name} with this.name
      command = command.replace(/{arg\((.*?)\)}/g, // replace {arg(X)} with the value of args[X]
        (command.match(/{arg\((.*?)\)}/g) || []) // matches {arg(*)}
          .map(str => str.match(/\((.*?)\)/)[1]) // maps the array to whats between ( ) in {arg(*)}
          .map(index => args[index])) // gets the value of arg(X)

      // This is not optional. We should generate a new message to send to the handler
      // but for now we just replace the content and send it to the command handler.
      // Does the same thing as "bot.on('message')" but with replaced content.
      message.content = command
      this.commandHandler.handle(message)
    }
  }

  /**
   * Sends a success {@link Discord.Embed}.
   * @param {String} title - The title of the embed.
   * @param {String} description - A more detailed text to provide in the embed.
   * @param {Object} params - Containing the {@link Message} object and, optionally, the args {@link Object}.
   */
  success (title, description, { message }) {
    message.channel.send({ embed: {
      color: 0x32e554,
      title: title || 'Scucess!',
      description: description,
      timestamp: new Date()
    } }).catch(e => {})
  }

  /**
   * Checks the command to be valid then runs {@link this.run}.
   * @param {Message} message - The Discord {@link Message} object to be executed.
   * @param {Array} args - An {@link Array} of arguments, derived from message content split by spaces.
   */
  async trigger (message, args, color) {
    switch (this.type) {
      case TYPES.GUILD_OWNER:
        if (message.guild.ownerID !== message.author.id) {
          const hasOwnerPerms = await Permission.find({
            guild: message.guild.id,
            role: { $in: message.member.roles.array().map(role => role.id) },
            granted: PERMISSIONS.OWNER_COMMANDS
          })

          if (!hasOwnerPerms) return this.error(ERROR.PERMISSION_DENIED, { message, args })
        }
        break
      case TYPES.BOT_OWNER:
        if (CONSTANTS.OWNERS.indexOf(message.author.id) === -1) return this.error(ERROR.PERMISSION_DENIED, { message, args })
        break
      default:
        if (this.permissions.length > 0) {
          const granted = (await Permission.find({
            guild: message.guild.id,
            role: { $in: message.member.roles.array().map(role => role.id) },
            granted: { $in: this.permissions }
          }) || []).map(permission => permission.granted)

          const accessGranted = (this.permissions || []).every(premission => granted.indexOf(premission) > -1)

          if (!accessGranted) return this.error(ERROR.PERMISSION_DENIED, { message, args })
        }
    }

    let member, guild
    if (this.fetch.member) member = await Member.findOne({ id: message.author.id })

    if (this.fetch.mention) {
      const memberFirst = message.mentions.users.first()

      if (memberFirst) {
        member = await Member.findOne({ id: memberFirst.id })
      }
    }

    if (this.fetch.guild) guild = await Guild.findOne({ id: message.guild.id })

    // we can add more pre-run checks here like permission etc.

    try {
      this.run({ message, args, member, guild, color })
    } catch (e) {
      this.error(ERROR.OTHER, { message, args })
      console.log(e)
    }
  }

  /**
   * Executes the command, post-precheck
   * @param {Object} params - The {@link Object} containing the message, args and db fetch objects.
   */
  async run ({ message, args, member, guild, color }) {
    // To be overridden by class extension.
  }
}
