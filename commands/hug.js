const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'hug',
      aliases: ['huggu'],
      description: 'Gives your best buddy a hug! This includes yourself.',
      type: TYPES.SOCIAL,
      args: '[@mention]'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    let gif = await Gifs.aggregate([{ $match: { gifType: 'hug' } }, { $sample: { size: 1 } }])
    gif = gif[0].url

    const embed = new RichEmbed()
      .setColor(color)
      .setDescription(`image not loading? click [here](${gif})`)
      .setImage(gif)

    if (!args[0]) {
      embed.setTitle('Ahw... have a hug :3')
    } else {
      const user = await this.mention(args[0], message)
      if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })
      embed.setTitle(message.author === user ? 'Ahw... have a hug :3' : `${message.author.username} hugged ${user.username}!`)
    }
    return message.channel.send(embed).catch(e => {})
  }
}
