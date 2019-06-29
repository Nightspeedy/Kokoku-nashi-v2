const Event = require('@lib/event')
const { Guild } = require('@lib/models')

module.exports = class extends Event {
  constructor (bot) {
    super({ event: 'guildCreate' })
    this.bot = bot
  }

  async trigger (guild) {
    let guildToAdd = await Guild.findOne({ id: guild.id })
    if (!guildToAdd) Guild.create({ id: guild.id })
  }
}
