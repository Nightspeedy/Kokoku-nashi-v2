const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Guild } = require('@lib/models')
const { RichEmbed } = require('discord.js')


module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'settings',
      aliases: ['config', 'configuration'],
      description: 'Shows your guild\'s settings, or sets them.\n Command always begins with k!settings\n\nAvailable settings are:\nsetwelcomemessage {"Message in quotations"}\nsetleavemessage {"Message in quotations"}\nsetbanmessage {"Message in quotations"}\n\nsetjoinleavechannel {#channelMention}\nsetlogchannel {#channelMention}\n\ntogglewelcome {on/off}\ntoggleleave {on/off}',
      args: "{setting} {setting argument}",
      type: TYPES.MOD_COMMAND,
      permissions: [PERMISSIONS.SETTINGS]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {

    // If no args are given, send the current configuration in an embed
    if (!args[0]) {

      let object = await this.formatGuildSettings(guild)

      let embed = new RichEmbed()
      .setTitle("Guild settings for: " + message.guild.name)
      .setColor(color)
      .setDescription("Here you can see all the current settings for your server :D\n\nLegend:\n<:Enabled:524627369386967042> Setting enabled.\n<:Disabled:524627368757690398> Setting disabled.")
      .addField("Logging", `Logfiles channel: ${object.logChannel}\nLevels channel: ${object.customLevelupChannel}\nWelcome/leave channel: ${object.joinLeaveChannel}`)
      .addField("Enabled/disabled loggers", `${object.enableLogfiles} Logfiles\n${object.enableWelcomeMessage} Welcome messages\n${object.enableLeaveMessage} Leave messages\n${object.enableBanMessage} Ban messages`)
      .addBlankField(false)
      .addField("Custom messages", `Join message: ${object.welcomeMessage}\nLeave message: ${object.leaveMessage}\nBan message: ${object.banMessage}`)
      .addBlankField(false)
      .addField("Premium status", object.premiumStatus)
      // TODO: Make embed with current settings

      message.channel.send("We're currently working on a nice embed for your guild's settings! Not all data might show, sorry for the inconvenience!")
      message.channel.send(embed)

    } else {
      args[0] = args[0].toLowerCase()

      if(!args[1]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})

      // TODO: Make config using reactions, (leave this to Meme, he's a god at that.)

      switch(args[0]) {
        case 'setwelcomemessage':
          let newMessage = args[1]
          if (!guild.isPremium && newMessage.length >= 100) return this.error({message: "Your message is longer then 100 characters! Upgrade to Premium to remove this restriction."})
          if (newMessage.length >= 1000) return this.error({message: "Your message is longer then 1000 characters!"})
          try {
            guild.updateOne({welcomeMessage: newMessage}).then(result => {

              let guild = async()=>{return await Guild.findOne({id: guild.id})} 
              if (guild.welcomeMessage == newMessage) {
                return message.channel.send("Successfully updated welcome message!")
              } else {
                return this.error(ERROR.TRY_AGAIN, {message, args})
              }

            }).catch(e => this.error(ERROR.TRY_AGAIN, {message, args}))
          } catch (e) {}
          break
        case 'setleavemessage':
        
          // TODO: Change the leave message in the database
          //return message.reply("Working on this, don't use.")
          break
        case 'setjoinleavechannel': 
          if (!message.mentions.channels.first()) return this.error(ERROR.INVALID_CHANNEL, { message, args })
          let channel = message.guild.channels.get(message.mentions.channels.first().id)
          if(!channel) return this.error(ERROR.INVALID_CHANNEL, { message, args })

          let id = message.mentions.channels.first().id
          
          if (!id) return

          guild.updateOne({joinLeaveChannel: id}).then(result => {

          })

          // TODO: Change the welcome channel in the database
          //return message.reply("Working on this, don't use.")
          break
        case 'togglewelcome':
          if (args[1].toLowerCase() == "off") {
            guild.updateOne({enableWelcomeMessage: false}).then(result => {

              return message.channel.send("Successfully disabled welcome messages") 

            }).catch(e => this.error(ERROR.TRY_AGAIN, {message, args}))
          } 
          if (args[1].toLowerCase() == "on") {
            guild.updateOne({enableWelcomeMessage: true}).then(result => {

              return message.channel.send("Successfully enabled welcome messages") 

            }).catch(e => this.error(ERROR.TRY_AGAIN, {message, args}))
          }
          break
        case 'toggleleave':
          if (args[1].toLowerCase() == "off") {
            guild.updateOne({enableLeaveMessage: false}).then(result => {
    
              return message.channel.send("Successfully disabled leave messages") 
    
            }).catch(e => this.error(ERROR.TRY_AGAIN, {message, args}))
          }
          if (args[1].toLowerCase() == "on") {
            guild.updateOne({enableLeaveMessage: true}).then(result => {

              return message.channel.send("Successfully enabled leave messages") 

            }).catch(e => this.error(ERROR.TRY_AGAIN, {message, args}))
          }
          break
        case 'setbanmessage':
        
          // TODO: Change the ban message in the database
          //return message.reply("Working on this, don't use.")
          break
      }
    }
  }

  // TODO: Make pretty, and less performance heavy.
  async formatGuildSettings(guild) {
    
    // Get all logger channels
    let logChannel = this.bot.channels.get(guild.logChannel)
    let joinLeaveChannel = this.bot.channels.get(guild.joinLeaveChannel)
    let customLevelupChannel = this.bot.channels.get(guild.customLevelupChannel)

    // Check if channels exist
    if (!logChannel) logChannel = "Not set"
    if (!joinLeaveChannel) joinLeaveChannel = "Not set"
    if (!customLevelupChannel) customLevelupChannel = "Not set"
    
    // Much variables, gets value later
    let premiumStatus, enableBanMessage, enableLeaveMessage, enableLevelupMessages, enableLogfiles, enableWelcomeMessage

    // A heck ton of checks for the variables that are just made
    if(guild.isPremium) {premiumStatus = "Premium enabled"} else {premiumStatus = "Premium disabled"}
    if(guild.enableBanMessage) {enableBanMessage = "<:Enabled:524627369386967042>"} else {enableBanMessage = "<:Disabled:524627368757690398>"}
    if(guild.enableLeaveMessage) {enableLeaveMessage = "<:Enabled:524627369386967042>"} else {enableLeaveMessage = "<:Disabled:524627368757690398>"}
    if(guild.enableLevelupMessages) {enableLevelupMessages = "<:Enabled:524627369386967042>"} else {enableLevelupMessages = "<:Disabled:524627368757690398>"}
    if(guild.enableLogfiles) {enableLogfiles = "<:Enabled:524627369386967042>"} else {enableLogfiles = "<:Disabled:524627368757690398>"}
    if(guild.enableWelcomeMessage) {enableWelcomeMessage = "<:Enabled:524627369386967042>"} else {enableWelcomeMessage = "<:Disabled:524627368757690398>"}

    // Return all the data in an object
    return {

      // String values
      logChannel: logChannel,
      joinLeaveChannel: joinLeaveChannel,
      customLevelupChannel: customLevelupChannel,

      // String values
      welcomeMessage: guild.welcomeMessage,
      leaveMessage: guild.leaveMessage,
      banMessage: guild.banMessage,

      // Boolean values
      enableWelcomeMessage: enableLeaveMessage,
      enableLeaveMessage: enableLeaveMessage,
      enableBanMessage: enableBanMessage,
      enableLogfiles: enableLogfiles,
      enableLevelupMessages: enableLevelupMessages,

      premiumStatus: premiumStatus,
    }
  }
}
// id: { type: String, required: true },
// logChannel: { type: String },
// autoRoles: { type: Array, default: []},
// autoRolesEnabled: { type: Boolean, default: false },
// mustHaveReason: { type: Boolean, default: false },
// enableLogfiles: { type: Boolean, default: false },
// enableLevelupMessages: { type: Boolean, default: true },
// customLevelupChannel: { type: String, default: undefined },
// joinLeaveChannel: { type: String, default: undefined},
// welcomeMessage: { type: String, default: `Welcome {MEMBER} just joined!` },
// enableWelcomeMessage: { type: Boolean, default: false },
// leaveMessage: { type: String, default: `Bye {MEMBER} We're sad to see you go!` },
// enableLeaveMessage: { type: Boolean, default: false },
// banMessage: { type: String, default: `{MEMBER} has experienced the true power of the banhammer!` },
// enableBanMessage: { type: Boolean, default: false },
// isPremium: { type: Boolean, default: false },
// PREMIUMembedColor: { type: String }