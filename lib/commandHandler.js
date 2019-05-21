const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')

const ArgumentParser = require('@lib/argumentParser')

// TODO: Document and clean

module.exports = class CommandHandler {
  constructor (prefix) {
    this.commands = new Discord.Collection()
    this.prefix = prefix
  }

  async install (dir, DB) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) { reject(err); return }
        const jsfiles = files.filter(f => f.split('.').pop() === 'js')
        const commands = jsfiles.map(jsfile => new (require(path.join(dir, jsfile)))())
        commands.forEach(command => command.init(DB))
        commands.forEach(command => this.commands.set(command.name, command))
        resolve(this)
      })
    })
  }

  handle (message) {
    // Checking whether or not the code should continue to run
    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    if (message.content.startsWith(this.config.prefix) || !message.content.includes(`${this.config.prefix} `)) return

    // Splitting up command and arguments so they are easily usable and accessible
    const args = ArgumentParser(message.content.slice(this.prefix.length).trim())
    const command = args.shift()

    this.run(command, message, args)
  }

  run (commandKey, message, args) {
    try {
      let command = this.bot.cmdhandler.commands.get(commandKey)
      if (command) command.trigger(message, args)
    } catch (error) {
      return message.channel.send('**Error!** Unknown command!')
    }
  }

  async listen (bot) {
    bot.on('message', this.handle)
  }
}
