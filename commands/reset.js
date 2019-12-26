const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ytdl = require('ytdl-core')
const { Queue } = require("@lib/models")

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'resetmusic',
      description: "Reset the music player, WARNING: This will delete EVERYTHING related to music commands (playlists/song queues/current songs) and will disconnect the bot from voice if connected. Use with caution!",
      type: TYPES.MUSIC,
      args: '[YT_URL]'
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    const permissions = voiceChannel.permissionsFor(this.bot.user)
    
    // Check for a queue
    var queue = await Queue.findOne({id: message.guild.id})
    if (!queue) {
      if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()
      return message.channel.send("There's nothing to be reset!")
    }
    if (message.guild.voiceConnection) {

      
    }
    return this.error(ERROR.BOT_NOT_IN_VC, {message})
  }

}
