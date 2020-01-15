const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Queue } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'skip',
      description: 'Skip the current song.',
      type: TYPES.MUSIC,
      args: ''
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
      if (!queue.currentSong) await queue.delete()
      if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()
      return message.channel.send('No songs are currently playing')
    }

    if (message.guild.voiceConnection) {
      // TODO: Allow to skip the next song
      message.guild.voiceConnection.dispatcher.end()
      return message.channel.send('Skipped song.')
    }
    return this.error(ERROR.BOT_NOT_IN_VC, { message })
  }
}
