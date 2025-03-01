const Discord = require('discord.js')
const DatabaseConnection = require('@lib/database')
const Handler = require('@lib/eventHandler')
const ORBTConnection = require('@lib/orbt')
const TimedActionHandler = require('@lib/timedActionHandler')
const Utils = require('@lib/utility')

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

    this.bot.config = this.config

    // Adding utility methods
    this.bot.utils = new Utils(this.bot)

    // Setting up database
    this.DB = new DatabaseConnection(this.bot, this.config.db)

    this.bot.ORBT = new ORBTConnection(this.bot)

    // Setting up command files
    console.log(`Shard #${this.bot.shard.id}: Attempting to set up commands`)
    this.handler = new Handler(this)
    this.setup()

    this.timedActionHandler = new TimedActionHandler(this, this.bot.shard.id)

    this.bot.timedActionHandler = this.timedActionHandler

    this.bot.login(this.devToken || this.token)
  }

  async setup () {
    this.handler.setup()
  }
}
