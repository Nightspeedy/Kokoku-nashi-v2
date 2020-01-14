const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'kick',
      description: 'Kicks a user from the server.',
      type: TYPES.MOD_COMMAND,
      args: '{@mention} ["reason"]',
      permissions: [PERMISSIONS.KICK]
    })
    this.fetch.guild = true
  }

  async run ({ message, args, guild }) {
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) return this.error(ERROR.BOT_NO_PERMISSION, { message, args })

    const memberToKick = this.mention(args[0], message)
    const reason = args[1]

    if (!memberToKick) return this.error(ERROR.UNKNOWN_MEMBER, { message, args })
    if (guild.mustHaveReason && !reason) return this.error({ message: 'You must provide a reason with this action!' }, { message, args })

    try {
      memberToKick.kick(reason).catch(e => {
        return this.error(ERROR.NO_PERMISSION, { message, args })
      })
      message.channel.send('Successfully kicked user!').catch(e => {})
    } catch (e) {
      console.error(e)
    }
  }
}
