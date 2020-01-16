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
    this.cooldownTime = meta.cooldownTime || 5

    // Gets set from commandHandler
    this.commandHandler = { }
    this.bot = { }
  }

  /**
   * Error handler.
   * @param {Object} error - One of the possible {@link ERROR} objects or a custom object with the same structure.
   * @param {Object} params - Containing the {@link Message} object and, optionally, the args {@link Object}.
   */
  error (error, { message, args }) {
    global.datadog.increment('command.error.user')
    if (error.message) {
      // If the error contains a message, send a pretty embed with it.
      message.channel.send({
        embed: {
          color: 0xff3333,
          title: 'An Error Occured',
          description: error.message,
          timestamp: new Date()
        }
      }).catch(e => {})
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
    message.channel.send({
      embed: {
        color: 0x32e554,
        title: title || 'Success!',
        description: description,
        timestamp: new Date()
      }
    }).catch(e => {})
  }

  /**
   * Starts a cooldown for a specific user.
   * @param {Number} time - Time of cooldown in milliseconds.
   * @param {Discord.User} user - The user to apply the cooldown for.
   */
  async cooldown (time, user) {
    await this.bot.cooldowns.push(time, `${this.name}-${user.id}`)
  }

  /**
   * Checks the command to be valid then runs {@link this.run}.
   * @param {Message} message - The Discord {@link Message} object to be executed.
   * @param {Array} args - An {@link Array} of arguments, derived from message content split by spaces.
   */
  async trigger (message, args, color, bot) {
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

    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
      try {
        message.author.send(`I do not have permission to send messages in the channel you tried to use the command ${this.name} in!`)
      } catch (e) {
        return
      }
    }

    const member = await Member.findOne({ id: message.author.id })
    if (member.isBanned) return this.error({ message: 'You are banned from interacting with Kōkoku Nashi.' }, { message })
    let guild
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
   * Turns a string into a User object.
   * @param {string} string - The {@link string} that needs to be checked. Should be an ID, a user-/nickname, or a username#0000 tag.
   * @returns {User} the mentioned user, null if not found. Undefined if error occurred.
   */
  async mention (possibleUser, message) {
    if (!message) return this.error({ message })
    try {
      possibleUser = String(possibleUser)
      let IDToCheck
      let mentioned

      // Check guild for members with nick-/names or tags of `possibleUser`
      const member = message.guild.members.find(member => member.user.tag === possibleUser ||
          member.displayName.toLowerCase() === possibleUser.toLowerCase() ||
          member.user.username.toLowerCase() === possibleUser.toLowerCase())
      if (member) {
        // The User of the found GuildMember is what we're looking for
        mentioned = member.user
      } else {
        // Try to find any cached user by name or tag of `possibleUser`
        mentioned = this.bot.users.find((user, id, collection) => user.tag === possibleUser ||
          user.username.toLowerCase() === possibleUser.toLowerCase())
      }

      if (!mentioned) {
        const idTag = possibleUser.match(/<@!?([0-9]+)>/)
        // Find any string that looks like a mention
        // idTag[0] is the entire tag, idTag[1] is the extracted id.

        if (!isNaN(possibleUser)) { // Is possibleUser just numbers, might be an id.
          IDToCheck = possibleUser
        } else if (idTag && idTag[1]) { // String is a user tag.
          IDToCheck = idTag[1].replace(/[^0-9]/g, '') // Remove all characters that arent numbers.
        }
        try {
          if (IDToCheck) mentioned = await this.bot.fetchUser(IDToCheck)
        } catch (e) {
          // Being excessively specific in the error check so we know what we're looking at here.
          if (!(e.name === 'DiscordAPIError' && e.code === 10013 && e.message === 'Unknown User')) throw e
        }
      }

      return mentioned // Return the User, or null if not found
    } catch (e) {
      console.error(e)
      return undefined // Something went wrong, return undefined.
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
