const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'addgif',
      description: 'Add a gif image to the database',
      type: TYPES.BOT_OWNER,
      args: '{type} {image url}'
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild, color }) {
    if (!args[0] || !args[1]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (!args[1].endsWith('.gif')) return this.error({ message: "Can't add image to db, image is not a valid GIF" })

    switch (args[0]) {
      case 'hug':
        this.addGif('hug', args[1], message)
        break
      case 'kiss':
        this.addGif('kiss', args[1], message)
        break
      case 'poke':
        this.addGif('poke', args[1], message)
        break
      case 'slap':
        this.addGif('slap', args[1], message)
        break
      default:
        return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    }
  }

  async addGif (type, gifUrl, message) {
    const gif = await Gifs.findOne({ gifType: type, url: gifUrl })
    if (gif) return this.error({ message: 'This gif is already added!' }, { message })
    await Gifs.create({ gifType: type, url: gifUrl })
    message.channel.send('Successfully added gif!')
  }
}
