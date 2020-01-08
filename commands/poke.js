const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'poke',
      description: 'Poke your friends!',
      type: TYPES.SOCIAL,
      args: '{@mention}'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    let gif = await Gifs.aggregate([{ $match: { gifType: 'poke' } }, { $sample: { size: 1 } }])
    gif = gif[0].url

    const embed = new RichEmbed()
      .setColor(color)
      .setDescription(`image not loading? click [here](${gif})`)

    if (!args) {
      embed.setTitle('You poked yourself! Silly :3')
      await embed.setImage(gif)

      message.channel.send(embed).catch(e => {})
    } else if (args[0]) {
      const member = await this.mention(args[0], message)
      if (typeof member !== 'object') return this.error(ERROR.MEMBER_NOT_FOUND, { message })
      embed.setTitle(`${message.author.username} poked ${member.username}!`)
      await embed.setImage(gif)
      message.channel.send(embed).catch(e => {})
    }
  }
}
