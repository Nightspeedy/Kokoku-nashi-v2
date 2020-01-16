const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { Queue } = require('@lib/models')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'currentsong',
      description: 'check the current song',
      type: TYPES.MUSIC,
      args: '',
      aliases: ['np', 'cs', 'nowplaying', 'playing']
    })
  }

  async run ({ message }) {
    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return this.error(ERROR.NOT_IN_VC, message)
    // const permissions = voiceChannel.permissionsFor(this.bot.user)
    // TODO: Make a check and see if the bot has permissions to speak and connect to the vc, does not currently work
    // if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return this.error({message: "The bot has no permission to join or speak in the voice channel you're currently connected to"}, message)

    // Check for a queue
    var queue = await Queue.findOne({ id: message.guild.id })
    if (!queue || !queue.isPlaying || !queue.currentSong) {
      if (queue && !queue.currentSong) await queue.deleteOne()
      if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()
      return message.channel.send('No songs are currently playing')
    }

    const song = queue.currentSong
    return message.channel.send({
      embed: {
        title: 'Current song',
        description: `Now playing: ${song.title}`
      }
    })
  }
}
