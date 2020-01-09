const Event = require('@lib/event')
const { LOG_EVENTS } = require('@lib/consts')
const { Guild } = require('@lib/models')

module.exports = class extends Event {
  constructor (main) {
    super({ })
    this.bot = main.bot

    LOG_EVENTS.forEach(event => {
      this.bot.on(event.event, async (...args) => {
        if (!args[0].guild) return
        if (args[0].bot) return
        if (args[0].author && args[0].author.bot) return
        
        const guild = await Guild.findOne({ id: (args[0].guild).id })
        if (!guild.logChannel) return

        const body = event.message(...args)
        const isObject = typeof (body) === 'object'

        if (isObject && body.abort) return

        this.bot.guilds.get(guild.id).channels.get(guild.logChannel).send({
          embed: {
            title: event.title,
            description: isObject ? '' : body,
            color: event.color,
            timestamp: new Date(Date.now()),
            ...(isObject ? body : {})
          }
        })
      })
    })
  }
}
