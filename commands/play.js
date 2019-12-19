const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ytdl = require('ytdl-core')
const { Queue } = require("@lib/models")

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'play',
      description: "Play a song",
      type: TYPES.MUSIC,
      args: '[YT_URL]',
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    // TODO: Make fool-proof
    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return this.error({message: "Please join a voice channel before using this command!"}, {message})
    const permissions = voiceChannel.permissionsFor(this.bot.user)
    //if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return this.error({message: "The bot has no permission to join or speak in the voice channel you're currently connected to"}, message)
    
    // Check for a queue
    var queue = await Queue.findOne({id: message.guild.id})
    console.log(`1st queue log ${queue}`)

    if (args[0]) {
      try {
        await ytdl.getInfo(args[0])

        let a = await ytdl.getInfo(args[0])
        let b = a.title

      } catch(e) {
        return this.error({message: 'Invalid youtube URL'}, {message})

      }
    }

    if (!queue) {
    
      await Queue.create({
        id: message.guild.id,
        textChannel: message.channel.id,
        voiceChannel: voiceChannel,
        currentSong: args[0]
      })
      queue = await Queue.findOne({id: message.guild.id})
      await queue.updateOne({isPlaying: true})
      this.play(voiceChannel, message, undefined)

    } else {
      if(queue.isPlaying) {
          
        let audio = await ytdl.getInfo(args[0])
        let songs = queue.songs
        if (!audio) return this.error({message: 'Invalid youtube URL'}, {message})

        songs.push(args[0])
        await queue.updateOne({songs: songs})

        message.channel.send(`Added **${audio.title}** to the song queue.`)

      } else {
        if (args[0] && !queue.isPlaying) await queue.updateOne({isPlaying: true, currentSong: args[0]})
        this.play(voiceChannel, message, undefined)
      }
    }
  }

  async play(voiceChannel, message, connection) {

    var queue = await Queue.findOne({id: message.guild.id})
    console.log(`2nd queue log ${queue}`)

    if (!connection) try {
      connection = await voiceChannel.join()
    } catch (e) {
      return this.error(e.message, {message})
    }
    
    let audio = await ytdl.getInfo(queue.currentSong)
    console.log(audio.title, audio.video_url)
    message.channel.send(`Now playing **${audio.title}**`)
    const dispatcher = connection.playStream(ytdl(queue.currentSong, { quality: 'highestaudio', filter: 'audioonly', highWaterMark: 1024 * 1024 * 16}))
      .on('end', async() => {
        message.channel.send("Song has ended")
        queue = await Queue.findOne({id: message.guild.id})
        let cSong, nSong
        let songs = queue.songs
        nSong = songs[0]
        cSong = nSong
        if (cSong &&!nSong) {
          message.channel.send("No more songs in queue, playing last song")
        }
        if (!cSong) {
          await queue.delete()
          voiceChannel.leave()
          return message.channel.send("Queue finished. Stopping playback and exiting channel.")
        }
        if (songs[0]) songs.shift()

        await queue.updateOne({currentSong: cSong, nextSong: nSong, songs: songs})

        this.play(voiceChannel, message, connection)
        
      })
      .on('error', error => {
        console.log(error)
        message.channel.send("Error")
      })
    dispatcher.setVolumeLogarithmic(5/5)
  }
}
