const Event = require('@lib/event')
const { Guild } = require('@lib/models')

module.exports = class extends Event {
  constructor (main) {
    super({ event: 'guildDelete' })
    this.bot = main.bot
  }

  async trigger (guild) {
    const guildToAdd = await Guild.findOne({ id: guild.id })
    if (guildToAdd) await Guild.deleteOne({ id: guild.id })
  }
}
