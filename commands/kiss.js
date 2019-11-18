const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const { Gifs } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'kiss',
      description: 'Gives your best friend a kiss.',
      type: TYPES.SOCIAL,
      args: '[@mention]',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    let gif = await Gifs.aggregate([ { $match: { gifType: 'kiss' } }, { $sample: { size: 1 } } ])
    gif = gif[0].url

    let embed = new RichEmbed()
    .setColor(color)
    .setDescription(`image not loading? click [here](${gif})`)

    if (!args[0]) {
        
        embed.setTitle(`I kissed you! :kissing_heart:`)
        await embed.setImage(gif)

        message.channel.send(embed).catch(e => {})
    } else if (args[0]) {

        let member = await this.parseMention(String(args[0]))
        if (typeof member != 'object') return this.error(ERROR.MEMBER_NOT_FOUND,{message})
        embed.setTitle(`${message.author.username} kissed ${member.username}! :blush:`)
        await embed.setImage(gif)
        message.channel.send(embed).catch(e => {})
    }
  }
}