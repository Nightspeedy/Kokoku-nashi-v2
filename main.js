const Discord = require('discord.js')
const path = require('path')
const DatabaseConnection = require('@lib/database')
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
    this.DB = new DatabaseConnection(this.bot, this.config.db)

    // Setting up command files
    console.log(`Shard #${this.bot.shard.id}: Attempting to set up commands`)
    this.bot.cmdhandler = new CommandHandler(this.prefix)
    this.setupCommands()

    this.bot.login(this.token)
  }

  async setupCommands () {
    await this.bot.cmdhandler.install(path.resolve('./commands'), this.bot)
    this.bot.cmdhandler.listen(this.bot)
  }
}
