const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Guild } = require('@lib/models')


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

  async run ({ message, args, guild }) {

    console.log("Ran settings.js")
    if (!args[0]) {

      // TODO: Make embed with current settings
      message.reply("We're currently working on a nice embed for your guild's settings! In the meantime, heres the raw data, sorry for the inconveinience!")
      message.channel.send(JSON.stringify(guild))

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
}
