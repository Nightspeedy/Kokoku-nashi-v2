const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const ArgumentParser = require('@lib/argumentParser')
const { Member } = require('@lib/models')

// TODO: Document and clean

module.exports = class CommandHandler {
  constructor (prefix, bot) {
    this.commands = new Collection()
    this.prefix = prefix
    this.color = undefined // to be defined later
    this.bot = bot
    this.handle = this.handle.bind(this)
  }

  async install (dir, bot) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) { reject(err); return }
        const jsfiles = files.filter(f => f.split('.').pop() === 'js')
        const commands = jsfiles.map(jsfile => new (require(path.join(dir, jsfile)))(bot))
        commands.forEach(command => {
          command.commandHandler = this
          this.commands.set(command.name, command)
          command.aliases.forEach(alias => {
            this.commands.set(alias, command)
          })
        })
        resolve(this)
      })
    })
  }

  async handle (message) {
    // Checking whether or not the code should continue to run
    if (message.author.bot) return
    if (message.channel.type === 'dm') return

    if (!message.content.startsWith(this.prefix) || message.content.includes(`${this.prefix} `)) return

    this.color = await this.randomColor()

    // Splitting up command and arguments so they are easily usable and accessible
    const args = ArgumentParser(message.content.slice(this.prefix.length).trim())
    const command = args.shift()

    this.run(command, message, args)
  }

  run (commandKey, message, args) {
    try {
      let command = this.commands.get(commandKey)
      command && command.trigger(message, args, this.color).catch(error => {
        console.error(error)
      })
    } catch (error) {
      // TODO: Add channel ID (Koko server, #errors) and then uncomment line 57
      // this.bot.channels.get("CHANNEL_ID_HERE").send(JSON.stringify(error))

      return console.log(error)
    }
  }

  randomColor () {
    let letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}
