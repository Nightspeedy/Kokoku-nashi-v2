const Event = require('@lib/event')
const { Guild } = require('@lib/models')

module.exports = class extends Event {
  constructor (bot) {
    super({ event: 'guildMemberRemove' })
    this.bot = bot
  }

  async trigger (member) {
    let guild = await Guild.findOne({ id: member.guild.id })

    // Leave messages
    if (guild.enableLeaveMessage && guild.joinLeaveChannel !== undefined) {
      let message = guild.leaveMessage
      message = message.replace('{MEMBER}', `${member.user.username}#${member.user.discriminator}`)

      try {
        this.bot.channels.get(guild.joinLeaveChannel).send(message).catch(/* this.log(this.error(ERROR.WELCOME_CHANNEL_INVALID,)) */ e => { console.log(e) })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
