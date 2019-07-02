const Event = require('@lib/event')
const { Guild, Member } = require('@lib/models')

module.exports = class extends Event {
  constructor (bot) {
    super({ event: 'message' })
    this.cmdhandler = bot.bot.cmdhandler
  }

  async trigger (message) {
    if (message.author.bot) return
    let guild = await Guild.findOne({ id: message.guild.id })
    if (!guild) Guild.create({ id: message.guild.id })
    let user = await Member.findOne({ id: message.author.id })
    if (!user && !message.author.bot) Member.create({ id: message.author.id })
    this.cmdhandler.handle(message)
  }
}
