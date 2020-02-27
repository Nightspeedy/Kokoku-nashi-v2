const Event = require('@lib/event')
const { Strings } = require('@lib/models')

module.exports = class extends Event {
  constructor (main) {
    super({ event: 'ready' })
    this.cmdhandler = main.bot.cmdhandler
    this.bot = main.bot
  }

  async trigger (data) {
    // TODO: Edit k!update restarting... message if the bot got updated
    const key = await Strings.findOne({ key: 'updated' })
    if (key) {
      const arr = key.value.split('-')
      if (arr[0] === 'true') { //eslint-disable-line
        const channel = this.bot.channels.get(arr[1])
        const message = await channel.fetchMessage(arr[2])
        await message.edit(`${message.content} Done!`)
        await key.delete()
      }
    }
  }
}
