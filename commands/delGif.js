const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'deletegif',
      description: 'Add a gif image to the database',
      type: TYPES.BOT_OWNER,
      args: '{type} {image url}'
    })
    this.fetch.guild = true
  }

  async run ({ message, args }) {
    if (!args[0] || !args[1]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (!args[1].endsWith('.gif')) return this.error({ message: "Can't remove image from the DB, image is not a valid GIF" })

    if (['hug', 'kiss', 'poke', 'slap'].includes(args[0])) {
      return this.removeGif(args[0], args[1], message)
    }
    return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
  }

  async removeGif (type, gifUrl, message) {
    const gif = await Gifs.findOne({ gifType: type, url: gifUrl })
    if (!gif) return this.error({ message: 'This gif is not in the DB!' }, { message })
    await Gifs.deleteOne({ gifType: type, url: gifUrl })
    message.channel.send('Successfully removed gif!')
  }
}
