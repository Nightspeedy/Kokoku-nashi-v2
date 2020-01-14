const Command = require('@lib/command')
const TYPES = require('@lib/types')
const PERMISSIONS = require('@lib/permissions')
const { Queue } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'resetmusic',
      description: 'Reset the music player, WARNING: This will delete EVERYTHING related to music commands (playlists/song queues/current songs) and will disconnect the bot from voice if connected. Use with caution!',
      type: TYPES.GUILD_OWNER,
      args: '',
      permissions: [PERMISSIONS.GUILD_OWNER]
    })
  }

  async run ({ message }) {
    // Check for a queue
    var queue = await Queue.findOne({ id: message.guild.id })
    if (message.guild.me.voiceChannel) message.guild.me.voiceChannel.leave()

    if (!queue) {
      return this.error({ message: 'There is nothing to be reset!' }, { message })
    }

    await queue.delete()
    return message.channel.send('Successfuly reset music!')
  }
}
