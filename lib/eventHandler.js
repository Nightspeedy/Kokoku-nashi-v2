const fs = require('fs')
const path = require('path')
const CommandHandler = require('@lib/commandHandler')

module.exports = class eventHandler {
  constructor (main) {
    this.bot = main.bot
    this.bot.cmdhandler = new CommandHandler(main.devPrefix || main.prefix, this.bot)
    this.listeners = []
  }

  async setup () {
    await this.bot.cmdhandler.install(path.resolve('commands'), this.bot)
    await this.install(path.resolve('events'), this.bot)
  }

  async install (dir, bot) {
    const files = fs.readdirSync(dir)
    const jsfiles = files.filter(f => f.split('.').pop() === 'js')
    const listener = jsfiles.map(jsfile => require(path.join(dir, jsfile)))

    listener.forEach(ListenerClass => {
      try {
        const listener = new ListenerClass(this.bot)
        this.bot.on(listener.event, (args) => listener.trigger(...args))
        this.listeners.push(listener)
      } catch (e) {}
    })
  }
}
