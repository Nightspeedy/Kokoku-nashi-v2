const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'poke',
      description: 'Poke your friends!',
      type: TYPES.SOCIAL,
      args: '{@mention}'
    })
  }

  async run ({ message, args, color }) {
    let gif = await Gifs.aggregate([{ $match: { gifType: 'poke' } }, { $sample: { size: 1 } }])
    gif = gif[0].url

    const embed = new RichEmbed()
      .setColor(color)
      .setDescription(`image not loading? click [here](${gif})`)

    if (!args) {
      embed.setTitle('You poked yourself! Silly :3').setImage(gif)

      return message.channel.send(embed).catch(e => {})
    }

    const user = await this.mention(args[0], message)
    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })
    embed.setTitle(`${message.author.username} poked ${user.username}!`).setImage(gif)
    message.channel.send(embed).catch(e => {})
  }
}
