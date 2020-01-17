const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'kiss',
      description: 'Gives your best friend a kiss.',
      type: TYPES.SOCIAL,
      args: '[@mention]'
    })
  }

  async run ({ message, args, color }) {
    let gif = await Gifs.aggregate([{ $match: { gifType: 'kiss' } }, { $sample: { size: 1 } }])
    gif = gif[0].url

    const embed = new RichEmbed()
      .setColor(color)
      .setDescription(`image not loading? click [here](${gif})`)

    if (!args[0]) {
      embed.setTitle('I kissed you! :kissing_heart:')
        .setImage(gif)

      return await message.channel.send(embed).catch(e => {})
    }

    const user = await this.mention(args[0], message)
    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })
    embed.setTitle(`${message.author.username} kissed ${user.username}! :blush:`)
      .setImage(gif)
    await message.channel.send(embed)
  }
}
