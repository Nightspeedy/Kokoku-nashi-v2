const { Guild } = require('@lib/models')

const handle = async (member) => {
  let guild = await Guild.findOne({ id: member.guild.id })

  if (guild.enableWelcomeMessage && guild.joinLeaveChannel !== undefined) {
    let message = guild.welcomeMessage
    message = message.replace('{MEMBER}', `<@${member.user.id}>`)

    /* let embed = new RichEmbed()
      .setTitle('Member joined!')
      .addField('Name', member.user.name) */

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

module.exports = async (on) => {
  on('guildMemberAdd', handle)
}
