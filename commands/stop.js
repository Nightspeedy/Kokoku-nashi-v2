const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { Queue } = require("@lib/models")
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'stop',
      description: "Stops the audio playback",
      type: TYPES.MUSIC,
      args: '[YT_URL]',
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    if (!message.member.voiceChannel) return this.error(ERROR.NOT_IN_VC, {message})
    if (!message.guild.voiceConnection) return this.error(ERROR.BOT_NOT_IN_VC, {message})

    const confirmation = await message.channel.send({
      embed: {
        title: 'Warning',
        color: 0x3A6AE9,
        description: `Are you sure you want to stop the playback, and clear the song queue if one exists?`
      }
    })

    await confirmation.react('601850856832368640')
    await confirmation.react('601850856718991370')

    const filter = (reaction, user) => {
      return ['no', 'yes'].includes(reaction.emoji.name) && user.id === message.author.id
    }

    const collected = await confirmation.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    const reaction = collected.first()

    if (reaction._emoji.name === 'yes') {
      try {
        console.log(message.guild.voiceConnection)
        const queue = await Queue.findOne({id: message.guild.id})
        await queue.delete()
      } catch(e) {
        console.log(e)
        return this.error(e.message, {message})
      }
    
    } else if (reaction._emoji.name === 'no') {
      return confirmation.delete()
    }
    return this.error({message: "You are not connected"}, message)
  }
}
