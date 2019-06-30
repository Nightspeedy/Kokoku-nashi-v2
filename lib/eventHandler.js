const fs = require('fs')
const path = require('path')
const CommandHandler = require('@lib/commandHandler')

module.exports = class eventHandler {
  constructor (main) {
    this.main = main
    this.main.cmdhandler = new CommandHandler(main.devPrefix || main.prefix, this.main)
    this.listeners = []
  }

  async setup () {
    await this.main.cmdhandler.install(path.resolve('commands'), this.main)
    await this.install(path.resolve('events'), this.main)
  }

  async install (dir) {
    const files = fs.readdirSync(dir)
    const jsfiles = files.filter(f => f.split('.').pop() === 'js')
    const listener = jsfiles.map(jsfile => require(path.join(dir, jsfile)))

    listener.forEach(ListenerClass => {
      try {
        const listener = new ListenerClass(this.main)
        this.main.bot.on(listener.event, listener.trigger)
        this.listeners.push(listener)
      } catch (e) { console.log(e) }
    })
  }
}
