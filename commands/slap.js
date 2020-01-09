const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'slap',
      description: 'Slap your best friend, or... slap that one guy you dont like.',
      type: TYPES.SOCIAL,
      args: '[@mention]',
      cooldownTime: 5
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    let gif = await Gifs.aggregate([{ $match: { gifType: 'slap' } }, { $sample: { size: 1 } }])
    gif = gif[0].url

    const embed = new RichEmbed()
      .setColor(color)
      .setDescription(`image not loading? click [here](${gif})`)

    if (args[0]) {
      const member = this.mention(args[0], message)
      if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message, args })

      embed.setTitle(`${message.author.username} slapped ${member.username}`)
      await embed.setImage(gif)

      message.channel.send(embed).catch(e => {})
    } else {
      embed.setTitle('You slapped yourself... does that hurt?')
      await embed.setImage(gif)

      message.channel.send(embed).catch(e => {})
    }
  }
}
