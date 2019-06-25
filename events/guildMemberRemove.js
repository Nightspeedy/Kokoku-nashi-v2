const { Guild } = require('@lib/models')

const handle = async (member) => {
  let guild = await Guild.findOne({ id: member.guild.id })

  // Leave messages
  if (guild.enableLeaveMessage && guild.joinLeaveChannel !== undefined) {
    let message = guild.leaveMessage
    message = message.replace('{MEMBER}', `${member.user.username}#${member.user.discriminator}`)
    // this.embed.setTitle('Member left!')
    // .addField('Name', member.user.name)

    try {
      this.bot.channels.get(guild.joinLeaveChannel).send(message).catch(/* this.log(this.error(ERROR.WELCOME_CHANNEL_INVALID,)) */ e => { console.log(e) })
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = async (on) => {
  on('guildMemberRemove', handle)
}
