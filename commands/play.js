const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ytdl = require('ytdl-core')
const ERROR = require('@lib/errors')
const { Queue } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'play',
      description: 'Play a song',
      type: TYPES.MUSIC,
      args: '[YT_URL]'
    })
  }

  // TODO: Rewrite this entire command and improve its stability and speed.

  async run ({ message, args }) {
    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return this.error(ERROR.NOT_IN_VC, message)

    // Check for a queue
    var queue = await Queue.findOne({ id: message.guild.id })

    if (args[0]) {
      try {
        var video = await ytdl.getInfo(args[0])
        // const check = video.title
        // this is a bit of a weird wonky way of finding out whether or not video is null, but it works.
      } catch (e) {
        return this.error({ message: 'Invalid YouTube URL!' }, { message })
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

      queue = await Queue.findOne({ id: message.guild.id })
      await queue.updateOne({ isPlaying: true })
      this.play(voiceChannel, message, undefined)
    } else {
      if (!queue) return this.error({ message: 'There are no songs to play!' }, { message })
      const connection = message.guild.voiceConnection

      if (!connection) {
        await queue.updateOne({ isPlaying: false })
        this.play(voiceChannel, message, undefined)
      }

      if (queue.isPlaying && args[0]) {
        const songs = queue.songs
        const song = {
          title: video.title,
          url: video.video_url
        }
        songs.push(song)
        await queue.updateOne({ songs: songs })

        message.channel.send(`Added **${video.title}** to the song queue.`)
      } else {
        if (args[0] && !queue.isPlaying) await queue.updateOne({ isPlaying: true, currentSong: { title: video.title, url: video.video_url } })
        this.play(voiceChannel, message, undefined)
      }
    }
  }

  async play (voiceChannel, message, connection) {
    var queue = await Queue.findOne({ id: message.guild.id })

    if (!connection) {
      try {
        connection = await voiceChannel.join()
      } catch (e) {
        return this.error(e.message, { message })
      }
    }

    const audio = await ytdl.getInfo(queue.currentSong.url)
    message.channel.send(`Now playing **${audio.title}**`)

    const dispatcher = connection.playStream(ytdl(queue.currentSong.url, { quality: 'highestaudio', filter: 'audioonly', highWaterMark: 1024 * 1024 * 16 }))
      .on('end', async () => {
        message.channel.send('Song has ended')
        queue = await Queue.findOne({ id: message.guild.id })
        const songs = queue.songs
        const nSong = songs[0]
        const cSong = nSong
        if (cSong && !nSong) {
          message.channel.send('No more songs in queue, playing last song')
        }
        if (!cSong) {
          await queue.delete()
          voiceChannel.leave()
          return message.channel.send('Queue finished. Stopping playback and exiting channel.')
        }
        if (songs[0]) songs.shift()

        await queue.updateOne({ currentSong: cSong, nextSong: nSong, songs: songs })

        this.play(voiceChannel, message, connection)
      })
      .on('error', error => {
        console.log(error)
        message.channel.send('Error')
      })
    dispatcher.setVolumeLogarithmic(5 / 5)
  }
}
