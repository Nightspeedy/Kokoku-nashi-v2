const Event = require('@lib/event')
const { Guild, Member } = require('@lib/models')

module.exports = class extends Event {
  constructor (main) {
    super({ event: 'message' })
    this.cmdhandler = main.bot.cmdhandler
  }

  async trigger (message) {
    if (message.author.bot) return
    global.datadog.increment('message.receieved')
    if (message.guild) {
      const guild = await Guild.findOne({ id: message.guild.id })
      if (!guild) Guild.create({ id: message.guild.id })
    }
    const user = await Member.findOne({ id: message.author.id })
    if (!user && !message.author.bot) Member.create({ id: message.author.id })
    this.cmdhandler.handle(message)
  }
}
