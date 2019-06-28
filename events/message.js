const { Guild, Member } = require('@lib/models')
let cmdhandler

const handle = async (message) => {
  if (message.author.bot) return
  let guild = await Guild.findOne({ id: message.guild.id })
  if (!guild) Guild.create({ id: message.guild.id })
  let user = await Member.findOne({ id: message.author.id })
  if (!user && !message.author.bot) Member.create({ id: message.author.id })
  cmdhandler.handle(message)
}

module.exports = async (on, handler) => {
  cmdhandler = handler.bot.cmdhandler
  on('message', handle)
}
