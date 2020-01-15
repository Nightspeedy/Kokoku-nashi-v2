const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const ArgumentParser = require('@lib/argumentParser')
const { CommandLogs, DisabledCommand } = require('@lib/models')
const ERROR = require('@lib/errors')

// TODO: Document and clean

module.exports = class CommandHandler {
  constructor (prefix, bot) {
    this.commands = new Collection()
    this.prefix = prefix
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
          command.bot = bot
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
    // Used to time how long the command took to handle.
    const commandStartedAt = Date.now()

    // Checking whether or not the code should continue to run
    if (message.author.bot) return
    if (message.channel.type === 'dm') return

    if (!message.content.startsWith(this.prefix) || message.content.includes(`${this.prefix} `)) return

    // Splitting up command and arguments so they are easily usable and accessible
    const args = ArgumentParser(message.content.slice(this.prefix.length).trim(), this.bot)
    const command = args.shift()

    await this.run(command.toLowerCase(), message, args)

    global.datadog.timing('command.runtime', Date.now() - commandStartedAt)
  }

  async run (commandKey, message, args) {
    try {
      const command = this.commands.get(commandKey)
      if (!command) return

      global.datadog.increment('command.run')
      if (message.guild && await DisabledCommand.findOne({ guild: message.guild.id, command: command.name })) return

      const cooldown = await this.bot.cooldowns.get(`${commandKey}-${message.author.id}`)
      if (cooldown) return command.error(ERROR.TIMEOUT(cooldown.time), { message })

      global.datadog.increment(`command.run.${command.name}`)

      if (command.cooldownTime) command.cooldown(command.cooldownTime * 1000, message.author)
      command.trigger(message, args, 0x222244).catch(error => {
        console.error(error)
      })

      await CommandLogs.create({
        user: message.author.id,
        username: message.author.tag,
        command: commandKey,
        arguments: args,
        timestamp: Date.now()
      })

      global.datadog.increment('command.completed')
    } catch (error) {
      // If an error occurs with run() send it to #errors in the Kokoku Nashi server
      this.bot.channels.get('586145896874639360') && this.bot.channels.get('586145896874639360').send({
        embed: {
          title: 'An error occurred!',
          description: `An error occurred while executing \`${commandKey}\` in ${message.guild ? message.guild.name : 'channel'} (${message.guild ? message.guild.id : message.channel.id}).`,
          fields: [
            { name: 'Failed Command', value: message.content.replace(/@/g, '\\@') },
            { name: 'Error Message', value: error.message }
          ],
          timestamp: Date.now()
        }
      })

      global.datadog.increment('command.error.critical')

      return console.log(error)
    }
  }
}
