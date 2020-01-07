const Command = require('@lib/command')
const TYPES = require('@lib/types')
const PERMISSIONS = require('@lib/permissions')
const ERROR = require('@lib/errors')
const { Queue } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'resetmusic',
      description: 'Reset the music player, WARNING: This will delete EVERYTHING related to music commands (playlists/song queues/current songs) and will disconnect the bot from voice if connected. Use with caution!',
      type: TYPES.GUILD_OWNER,
      args: '',
      permissions: [PERMISSIONS.GUILD_OWNER]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    // Check for a queue
    var queue = await Queue.findOne({ id: message.guild.id })
    if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()

    if (!queue) {
      return message.channel.send("There's nothing to be reset!")
    }
    if (message.guild.voiceConnection) {
      await queue.delete()
      return message.channel.send('Successfuly reset music!')
    }
    return this.error(ERROR.BOT_NOT_IN_VC, { message })
  }
}
