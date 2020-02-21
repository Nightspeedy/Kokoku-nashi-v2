const Event = require('@lib/event')
const { Guild } = require('@lib/models')

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

    this.cmdhandler.handle(message)
  }
}
