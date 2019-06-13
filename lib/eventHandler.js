const fs = require('fs')
const path = require('path')
const ERROR = require('@lib/errors')
const { Collection, RichEmbed } = require('discord.js')
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
    await this.bot.cmdhandler.install(path.resolve('commands'), this.bot)
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
  async message(message) {
    if (message.author.bot) return
    let guild = await Guild.findOne({id: message.guild.id})
    if (!guild) Guild.create({ id: message.guild.id })
    let user = await Member.findOne({id: message.author.id})
    if (!user) Member.create({id: message.author.id})
    this.bot.cmdhandler.handle(message)

    try {
      this.levelSystem.run(message)
    } catch(e) {
      console.log(e)
    }
  }

  // Fired when the bot joins a new guild
  async guildCreate(guild) {
    let guildToAdd = await Guild.findOne({id: member.guild.id})
    if (!guild) Guild.create({ id: guild.id })
  }

  // Fired when a member joins a guild
  async guildMemberAdd(member) {
    
    this.embed = new RichEmbed()

    let guild = await Guild.findOne({id: member.guild.id})

    // Welcome messages
    if (guild.enableWelcomeMessage && guild.welcomeChannel != undefined) {

      message = guild.welcomeMessage
      message.replace("{MEMBER}", `<@${member.user.id}>`)
      this.embed.setTitle('Member joined!')
      .addField('Name', member.user.name)

      try {
        bot.channels.get(guild.welcomeChannel).send(message).catch(this.log(this.error(ERROR.WELCOME_CHANNEL_INVALID,)))
      } catch (e) {
        console.error(e)
      }
      
    }

    this.log(guild)
    // TODO: check if guild has autoroles, give autoroles, check if server has welcome messages, send welcome messages, check if server has logs enabled, log to channel

    // Autoroles
    if(guild.autorolesEnabled) {
        //give member the roles
    }

    //this.log(guild, member, title, message)
  }

  async log(guild) {

    let guild = await Guild.findOnd({ id: guild.id})

    if (guild.enableLogfiles) {
      try {
        await this.bot.channels.get(guild.logChannel).send(this.embed)
      } catch(e) {
      }
    }
  }
}
