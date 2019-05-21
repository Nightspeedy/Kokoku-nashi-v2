const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const Database = require('@lib/database')
const CommandHandler = require('@lib/commandHandler')

module.exports = class Main {
  constructor () {
    this.bot = new Discord.Client({
      unknownCommandResponse: false
    })

    // Loading config file, or... Trying to...
    console.log(`Shard #${this.bot.shard.id}: Loading config file...`)
    this.config = require('./config.json')
    console.log(`Shard #${this.bot.shard.id}: Config file loaded!`)

    // Creating easy access variables
    this.token = this.config.token
    this.prefix = this.config.prefix

    // Setting up database
    this.DB = new Database(this.bot)

    // Setting up command files
    console.log(`Shard #${this.bot.shard.id}: Attempting to set up commands`)
    this.bot.cmdhandler = new CommandHandler()
    this.setupCommands()

    this.bot.login(this.token)
  }

  handleMessage (message) {
    // Checking whether or not the code should continue to run
    if (message.author.bot) return
    if (message.channel.type === 'dm') return

    // Splitting up command and arguments so they are easily usable and accessible
    const args = message.content.slice(this.prefix.length).trim().split(/ +/g)
    const command = args.shift()

    if (message.content.startsWith(this.config.prefix) && !message.content.includes(`${this.config.prefix} `)) this.runCommand(command, message, args)
  }

  runCommand (command, message, args) {
    // Trying to run the command
    console.log(`Shard #${this.bot.shard.id}: Received a command, checking if it's valid`)
    try {
      let command = this.bot.cmdhandler.commands.get(command)
      if (command) console.log(`Shard #${this.bot.shard.id}: Received valid command, running command.`)
      command.trigger(message, args)

      // And if an error is catched, no such command exists.
    } catch (error) {
      console.log(`Shard #${this.bot.shard.id}: Received invalid command, returning.`)

      return message.channel.send('**Error!** Unknown command!')
    }
  }
  
  async setupCommands() {
    await this.bot.cmdhandler.install(path.resolve('./commands'), this.DB)
  }
}
