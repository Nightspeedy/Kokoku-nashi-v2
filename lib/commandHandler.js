const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const ArgumentParser = require('@lib/argumentParser')

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
          console.log(`Shard #${this.bot.shard.id}: Registering command: ${command.name}`)
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
    const args = ArgumentParser(message.content.slice(this.prefix.length).trim(), this.bot)
    const command = args.shift()

    this.run(command.toLowerCase(), message, args)
  }

  run (commandKey, message, args) {
    // if (this.cooldown.has(message.author.id) && CONSTANTS.OWNERS.indexOf(message.author.id) === -1) return message.channel.send("Please wait 5 seconds between commands!")
    try {
      const command = this.commands.get(commandKey)
      command && command.trigger(message, args, this.color).catch(error => {
        console.error(error)
      })
    } catch (error) {
      // If an error occurs with run() send it to #errors in the Kokoku Nashi server
      this.bot.channels.get('586145896874639360').send(error.message)

      return console.log(error)
    }
  }

  randomColor () {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}
