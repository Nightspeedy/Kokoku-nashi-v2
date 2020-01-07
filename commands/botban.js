const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'botban',
      description: 'Bans a user from interacting with Kōkoku Nashi',
      type: TYPES.BOT_OWNER,
      args: '{@mention}'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    const member = await Member.findOne({ id: this.mention(args[0]).id })

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
