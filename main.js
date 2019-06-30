const Discord = require('discord.js')
const DatabaseConnection = require('@lib/database')
const Handler = require('@lib/eventHandler')
const TimedActionHandler = require('@lib/timedActionHandler')

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
    this.devToken = this.config.devToken

    this.prefix = this.config.prefix
    this.devPrefix = this.config.devPrefix

    // Setting up database
    this.DB = new DatabaseConnection(this.bot, this.config.db)

    // Setting up command files
    console.log(`Shard #${this.bot.shard.id}: Attempting to set up commands`)
    this.handler = new Handler(this)
    this.setup()

    this.bot.login(this.devToken || this.token)

    // Timed Action Handler for things like
    // delayed giving of roles using db
    // instead of setTimeout for redundancy.
    this.timedActionHandler = new TimedActionHandler(this, this.bot.shard.id)
  }

  async setup () {
    this.handler.setup()
  }
}
