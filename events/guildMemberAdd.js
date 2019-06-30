const Event = require('@lib/event')
const { Guild, AutoRoles } = require('@lib/models')

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

    if(guild.autoRolesEnabled) {
      try {
        let autoRoles = await AutoRoles.find({guild: member.guild.id}).map(val => val.role)
        if (!autoRoles.length > 0) return
        member.setRoles(guild.autoRoles)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
