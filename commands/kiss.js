const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const gifs = require('@lib/socialGifs.json')

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
    let gif = Math.floor(Math.random() * gifs.kiss.length);

    let embed = new RichEmbed()
    .setColor(color)
    .setDescription(`image not loading? click [here](${gifs.kiss[gif]})`)

    if (!args[0]) {
        
        embed.setTitle(`I kissed you! :kissing_heart:`)
        await embed.setImage(gifs.kiss[gif])

        message.channel.send(embed).catch(err => {});
    } else if (args[0]) {

        if (args[0] != message.mentions.members.first()) return this.error(ERROR.MEMBER_NOT_FOUND, {message, args})

        
        embed.setTitle(`${message.author.username} kissed ${message.mentions.members.first().user.username}! :blush:`)
        await embed.setImage(gifs.kiss[gif])
        message.channel.send(embed).catch(err => {});
    }
  }
}