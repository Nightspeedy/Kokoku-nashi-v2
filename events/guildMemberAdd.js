const Event = require('@lib/event')
const { Guild } = require('@lib/models')

module.exports = class extends Event {
  constructor (bot) {
    super({ event: 'guildMemberAdd' })
    this.bot = bot
  }

  async trigger (member) {
    let guild = await Guild.findOne({ id: member.guild.id })

    if (guild.enableWelcomeMessage && guild.joinLeaveChannel !== undefined) {
      let message = guild.welcomeMessage
      message = message.replace('{MEMBER}', `<@${member.user.id}>`)

      try {
        this.bot.channels.get(guild.joinLeaveChannel).send(message).catch(e => { console.log(e) })
      } catch (e) {
        console.error(e)
      }
    }

    try {
      member.setRoles(guild.autoRoles)
    } catch (e) {
      console.log(e)
    }
  }
}
