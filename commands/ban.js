const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'ban',
      description: 'Bans a user from the server.',
      type: TYPES.MOD_COMMAND,
      args: '{@mention} ["reason"]',
      permissions: [PERMISSIONS.BAN]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild }) {
    const memberToBan = this.mention(args[0], message)
    const reason = args[1]

    if (!memberToBan) return this.error(ERROR.MEMBER_NOT_FOUND, { message, args })
    if (guild.mustHaveReason && !reason) return this.error({ message: 'You must provide a reason with this action!' }, { message, args })

    // TODO: Check guild DB to see if a reason needs to be forced.

    // if (guild.mustHaveReason && !reason) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    try {
      memberToBan.ban(reason).catch(e => {
        return this.error(ERROR.NO_PERMISSION, { message, args })
      })
      message.channel.send('Successfully banned user!').catch(e => {})
    } catch (e) {
      console.error(e)
    }
  }
}
