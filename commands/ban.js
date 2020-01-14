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

    this.bot = bot
  }

  async run ({ message, args, guild }) {
    const userToBan = this.mention(args[0], message) || await this.bot.fetchUser(args[0]) || undefined
    const reason = args[1]
    // const days = args[2]

    if (!userToBan) return this.error(ERROR.MEMBER_NOT_FOUND, { message, args })
    if (guild.mustHaveReason && !reason) return this.error({ message: 'You must provide a reason with this action!' }, { message, args })

    try {
      await message.guild.ban(userToBan, { reason: reason })
      return message.channel.send('Successfully banned user!')
    } catch (e) {
      this.error(ERROR.NO_PERMISSION, { message, args })
      console.error(e)
    }
  }
}
