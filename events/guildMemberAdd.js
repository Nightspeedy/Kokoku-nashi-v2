const Event = require('@lib/event')
const { Guild, AutoRoles } = require('@lib/models')

module.exports = class extends Event {
  constructor (main) {
    super({ event: 'guildMemberAdd' })
    this.bot = main.bot
  }

  async trigger (member) {
    let guild = await Guild.findOne({ id: member.guild.id })

    if (guild.enableWelcomeMessage && guild.joinLeaveChannel !== undefined) {
      let message = guild.welcomeMessage

      if (message.includes('{MEMBER}')) message = message.replace('{MEMBER}', `<@${member.user.id}>`)
      if (message.includes('{MEMBER.USERNAME}')) message = message.replace('{MEMBER.USERNAME}', `${member.user.username}`)
      if (message.includes('{MEMBER.TAG}')) message = message.replace('{MEMBER.TAG}', `${member.user.discriminator}`)
      if (message.includes('{GUILD.NAME}')) message = message.replace('{GUILD.NAME}', `${member.guild.name}`)

      try {
        this.bot.channels.get(guild.joinLeaveChannel).send(message).catch(e => { console.log(e) })
      } catch (e) {
        console.error(e)
      }
    }

    // Check for autoroles, and give em if there are any
    if (guild.autoRolesEnabled) {
      try {
        let autoRoles = (await AutoRoles.find({ guild: member.guild.id })).map(val => val.role)
        if (autoRoles.length > 0) {
          member.addRoles(autoRoles)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
