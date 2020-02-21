const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { OWNERS } = require('@lib/consts')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'botpardon',
      description: 'Unbans a user from interacting with Kōkoku Nashi',
      type: TYPES.BOT_OWNER,
      args: '{@mention}'
    })
  }

  async run ({ message, args }) {
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const user = await this.mention(args[0], message)
    const member = await Member.findOne({ id: user.id })
    if (!member) return this.error(ERROR.UNKNOWN_MEMBER, { message })
    if (!member.isBanned) return this.error({ message: 'User is not banned!' }, { message })
    if (OWNERS.includes(member.id)) return this.error({ message: 'Members of the Kōkoku Nashi team can not be banned!' })
    try {
      await member.updateOne({ isBanned: false })
      message.channel.send(`<@${member.id}> was unbanned from interacting with Kōkoku Nashi`)
    } catch (e) {
      console.log(e)
    }
  }
}
