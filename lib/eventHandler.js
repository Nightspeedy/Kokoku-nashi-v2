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
    this.bot.cmdhandler = new CommandHandler("dev!", this.bot)
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
    this.bot.on('guildMemberRemove', member => {
      this.guildMemberRemove(member);
    })
  }

  // Callback functions

  // Fired when a message gets sent in a server
  async message(message) {
    if (message.author.bot) return
    let guild = await Guild.findOne({id: message.guild.id})
    if (!guild) Guild.create({ id: message.guild.id })
    let user = await Member.findOne({id: message.author.id})
    if (!user && !message.author.bot) Member.create({id: message.author.id})
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
    if (!guildToAdd) Guild.create({ id: guild.id })
  }

  // Fired when a member joins a guild
  async guildMemberAdd(member) {
    
    this.embed = new RichEmbed()

    let guild = await Guild.findOne({id: member.guild.id})

    // Welcome messages
    if (guild.enableWelcomeMessage && guild.joinLeaveChannel != undefined) {

      let message = guild.welcomeMessage
      message = message.replace("{MEMBER}", `<@${member.user.id}>`)
      this.embed.setTitle('Member joined!')
      .addField('Name', member.user.name)

      try {
        this.bot.channels.get(guild.joinLeaveChannel).send(message).catch(/*this.log(this.error(ERROR.WELCOME_CHANNEL_INVALID,))*/ e => {console.log(e)})
      } catch (e) {
        console.error(e)
      }
      
    }
    // Autoroles
    try {
      member.setRoles(guild.autoRoles)
    } catch (e) {
      console.log(e)
    }
    // if(guild.autorolesEnabled) {

    // }

    //this.log(guild, member, title, message)
  }

  async guildMemberRemove(member) {

    let guild = await Guild.findOne({id: member.guild.id})

    // Leave messages
    if (guild.enableLeaveMessage && guild.joinLeaveChannel != undefined) {

      let message = guild.leaveMessage
      message = message.replace("{MEMBER}", `${member.user.username}#${member.user.discriminator}`)
      //this.embed.setTitle('Member left!')
      //.addField('Name', member.user.name)

      try {
        this.bot.channels.get(guild.joinLeaveChannel).send(message).catch(/*this.log(this.error(ERROR.WELCOME_CHANNEL_INVALID,))*/ e => {console.log(e)})
      } catch (e) {
        console.error(e)
      }
      
    }
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
