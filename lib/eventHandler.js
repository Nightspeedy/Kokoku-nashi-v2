const fs = require('fs')
const path = require('path')
const CommandHandler = require('@lib/commandHandler')
const CooldownHandler = require('@lib/cooldownHandler')

module.exports = class eventHandler {
  constructor (main) {
    this.main = main
    this.main.bot.cmdhandler = new CommandHandler(main.devPrefix || main.prefix, this.main.bot)
    this.main.bot.cooldowns = new CooldownHandler()
    this.listeners = []
  }

  async setup () {
    await this.main.bot.cmdhandler.install(path.resolve('commands'), this.main.bot)
    await this.install(path.resolve('events'), this.main)
  }

  async install (dir) {
    console.log(`Shard #${this.main.bot.shard.id}: Attempting to set up events`)
    const files = fs.readdirSync(dir)
    const jsfiles = files.filter(f => f.split('.').pop() === 'js')
    const listener = jsfiles.map(jsfile => require(path.join(dir, jsfile)))

    listener.forEach(ListenerClass => {
      try {
        const listener = new ListenerClass(this.main)
        if (listener.event) { this.main.bot.on(listener.event, (...a) => listener.trigger(...a)) }
        this.listeners.push(listener)
        console.log(`Shard #${this.main.bot.shard.id}: Registering event: ${listener.event}`)
      } catch (e) { console.log(e) }
    })
  }
}
