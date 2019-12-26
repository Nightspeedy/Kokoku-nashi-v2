const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ytdl = require('ytdl-core')
const Youtube = require('simple-youtube-api')
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

    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return this.error({message: "Please join a voice channel before using this command!"}, {message})
    const permissions = voiceChannel.permissionsFor(this.bot.user)
    // TODO: Make a check and see if the bot has permissions to speak and connect to the vc, does not currently work
    //if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return this.error({message: "The bot has no permission to join or speak in the voice channel you're currently connected to"}, message)
    
    // Check for a queue
    var queue = await Queue.findOne({id: message.guild.id})
    console.log(`1st queue log ${queue}`)
    
    if (args[0]) {
      try {
        console.log("Test 1")
        var video = await ytdl.getInfo(args[0])

        let check = video.title
        // this is a bit of a weird way of finding out whether or not video is null. if it is it should say "video.title is undefined" or smth
      } catch(e) {
        return this.error({message: "Invalid  youtube link!"}, {message})
      }
    }

    if (!queue && args[0]) {
    
      await Queue.create({
        id: message.guild.id,
        textChannel: message.channel.id,
        voiceChannel: voiceChannel,
        currentSong: {
          title: video.title,
          url: video.video_url
        }
      })
      queue = await Queue.findOne({id: message.guild.id})
      await queue.updateOne({isPlaying: true})
      this.play(voiceChannel, message, undefined)

    } else {

      let connection = message.guild.voiceConnection
      if (!connection) {
        await queue.updateOne({isPlaying: false})
        this.play(voiceChannel, message, undefined)
      }

      if(queue.isPlaying && args[0]) {

        let songs = queue.songs
        let song = {
          title: video.title,
          url: video.video_url
        }
        songs.push(song)
        await queue.updateOne({songs: songs})

        message.channel.send(`Added **${video.title}** to the song queue.`)

      } else {
        
        if (args[0] && !queue.isPlaying) await queue.updateOne({ isPlaying: true, currentSong: { title: video.title, url: video.video_url }})
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
    
    let audio = await ytdl.getInfo(queue.currentSong.url)
    console.log(audio.title, audio.video_url)
    message.channel.send(`Now playing **${audio.title}**`)
    const dispatcher = connection.playStream(ytdl(queue.currentSong.url, { quality: 'highestaudio', filter: 'audioonly', highWaterMark: 1024 * 1024 * 16}))
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
