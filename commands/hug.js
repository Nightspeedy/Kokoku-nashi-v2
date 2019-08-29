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
    // let gif = Math.floor(Math.random() * gifs.hug.length)

    let gif = await Gifs.aggregate([{ $match: { gifType: 'hug' } }, { $sample: { size: 1 } }])
    gif = gif[0].url

    const embed = new RichEmbed()
      .setColor(color)
      .setDescription(`image not loading? click [here](${gif})`)

    if (!args[0]) {
      embed.setTitle('Ahw... have a hug :3')
      await embed.setImage(gif)
      return message.channel.send(embed).catch(e => {})
    } else if (args[0]) {
      if (args[0] !== message.mentions.users.first()) return this.error(ERROR.MEMBER_NOT_FOUND, { message, args })
      embed.setTitle(`${message.author.username} hugged ${message.mentions.users.first().username}!`)
      await embed.setImage(gif)
      return message.channel.send(embed).catch(e => {})
    }
  }
}
