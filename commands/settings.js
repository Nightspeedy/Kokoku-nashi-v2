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
      description: 'Shows your guild\'s settings',
      type: TYPES.MOD_COMMAND,
      args: '[@mention]',
      permissions: [PERMISSIONS.SETTINGS]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild }) {

    console.log("Ran settings.js")
    if (!args) {
      // TODO: Make embed with current settings
    } else {
      args[0] = args[0].toLowerCase()

      if(!args[1]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})
      // TODO: Make config using reactions, (leave this to Meme, he's a god at that.)
      switch(args[0]) {
        case 'welcomemessage':
          console.log("Inside case welcomemessage")
          let newMessage = args[1]
          if (!guild.isPremium && newMessage.length >= 100) return this.error({message: "Your message is longer then 100 characters! Upgrade to Premium to remove this restriction."})
          if (newMessage.length >= 1000) return this.error({message: "Your message is longer then 1000 characters!"})
          try {
            guild.updateOne({welcomeMessage: newMessage}).then(result => {

              console.log(result)
              let guild = async()=>{return await Guild.findOne({id: guild.id})} 
              if (guild.welcomeMessage == newMessage) {
                return message.channel.send("Successfully updated welcome message!")
              } else {
                return this.error(ERROR.TRY_AGAIN, {message, args})
              }

            }).catch(e => this.error(ERROR.TRY_AGAIN, {message, args}))
          } catch (e) {}

        break
      case 'setwelcomechannel': 
          if (!message.mentions.channels.first()) return this.error(ERROR.INVALID_CHANNEL, { message, args })
          let channel = message.guild.channels.get(message.mentions.channels.first().id)
          if(!channel) return this.error(ERROR.INVALID_CHANNEL, { message, args })
          message.reply("PONGGGG!!!!")
      }

    }
  }
}
