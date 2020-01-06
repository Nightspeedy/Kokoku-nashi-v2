const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ytdl = require('ytdl-core')
const { Queue } = require("@lib/models")

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'queue',
      description: "Check the song queue",
      type: TYPES.MUSIC,
      args: '',
      aliases: ['songqueue', 'sq', 'que']
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return this.error({message: "Please join a voice channel before using this command!"}, {message})
    const permissions = voiceChannel.permissionsFor(this.bot.user)
    // TODO: Make a check and see if the bot has permissions to speak and connect to the vc, does not currently work
    //if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return this.error({message: "The bot has no permission to join or speak in the voice channel you're currently connected to"}, message)
    
    // Check for a queue

    // TODO: Fix bug where if there's no queue it will 
    var queue = await Queue.findOne({id: message.guild.id})
    if (!queue) {
      if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()
      return message.channel.send("No songs are currently playing")
    }
    if (!queue.isPlaying) {
      if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()
      return message.channel.send("No songs are currently playing")
    }
    if (!queue.currentSong) {
      if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()
      await queue.delete()
      return message.channel.send("No songs are currently playing")
    }

    let songs = queue.songs.map(song => `- ${song.title}`).join('\n')

    return message.channel.send(`Song queue for this server:\n\n${songs}\n\nCurrent song: **${queue.currentSong.title}**`)
    
  }

}
