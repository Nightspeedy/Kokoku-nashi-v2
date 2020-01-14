const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'botban',
      description: 'Bans a user from interacting with Kōkoku Nashi',
      type: TYPES.BOT_OWNER,
      args: '{@mention}'
    })
  }

  async run ({ message, args, member }) {
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    if (!member) return this.error(ERROR.UNKNOWN_MEMBER, { message })
    if (member.isBanned) return this.error({ message: 'User is already banned!' }, { message })
    try {
      await member.updateOne({ isBanned: true })
      message.channel.send(`<@${member.id}> was banned from interacting with Kōkoku Nashi`)
    } catch (e) {
      return this.error(e.message, { message })
    }
  }
}
