const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'botpardon',
      description: 'Unbans a user from interacting with Kōkoku Nashi',
      type: TYPES.BOT_OWNER,
      args: '{@mention}'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, member }) {
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    if (!member) return this.error(ERROR.UNKNOWN_MEMBER, { message })
    if (!member.isBanned) return this.error({ message: 'User is not banned!' }, { message })
    try {
      await member.updateOne({ isBanned: false })
      message.channel.send(`<@${member.id}> was unbanned from interacting with Kōkoku Nashi`)
    } catch (e) {
      return this.error(e.message, { message })
    }
  }
}
