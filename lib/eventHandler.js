const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const ArgumentParser = require('@lib/argumentParser')
const CommandHandler = require('@lib/commandHandler')
const LevelSystem = require('@lib/levelSystem')
const { Guild, Member } = require('@lib/models')


module.exports = class eventHandler {
  constructor (bot) {

    this.bot = bot
    this.bot.cmdhandler = new CommandHandler("k!", this.bot)
    this.levelSystem = new LevelSystem(this.bot)
    
    //this.handle = this.handle.bind(this)
  }

  async setup() {

    console.log("debug log");
    
    await this.bot.cmdhandler.install(path.resolve('commands'), this.bot)
    this.bot.cmdhandler.listen(this.bot)
  }

  // Event listeners
  async listen () {
    this.bot.on('message', message => {
        this.message(message)
    })
    this.bot.on('guildCreate', guild => {
        this.guildCreate(guild)
    });
    this.bot.on('guildMemberAdd', member => {
        this.guildMemberAdd(member);
    });
  }

  // Callback functions

  // Fired when a message gets sent in a server
  message(message) {
    if (message.author.bot) return
      
    let user = await Member.findOne({id: message.author.id})
    if (!user) Member.create({id: message.author.id})

    this.cmdhandler.handle(message)
  }

  // Fired when the bot joins a new guild
  async guildCreate(guild) {

    //if(!Guild.findOne({id: guild.id})) console.log()
    // TODO: add guild to database if it doesnt exist already
  }

  // Fired when a member joins a guild
  async guildMemberAdd(member) {
    
    let user = await Member.findOne({id: member.user.id})
    if (!user) {
        Member.create({id: member.user.id})
    }
    let guild = await Guild.findOne({id: member.guild.id})

    // TODO: check if guild has autoroles, give autoroles, check if server has welcome messages, send welcome messages, check if server has logs enabled, log to channel

    if(guild.autorolesEnabled) {
        //give member the roles
    }

  }

  async log(event) {


  }

}
