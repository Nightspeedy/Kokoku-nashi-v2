const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'kick',
      description: 'Kicks a user from the server.',
      type: TYPES.MOD_COMMAND,
      args: '{@mention} ["reason"]',
      permissions: [PERMISSIONS.KICK || PERMISSIONS.MODERATOR]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild }) {
    let memberToKick = message.mentions.members.first()
    let reason = args[1]

    if (!memberToKick) return this.error(ERROR.UNKNOWN_MEMBER, { message, args })
    if (!reason) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    // TODO: Check guild DB to see if a reason needs to be forced.

    // if (guild.mustHaveReason && !reason) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    try {
      memberToKick.kick(reason).catch(e => {
        return this.error(ERROR.NO_PERMISSION, { message, args })
      })
      message.channel.send('Successfully kicked user!')
    } catch (e) {
      console.error(e)
    }
  }
}
