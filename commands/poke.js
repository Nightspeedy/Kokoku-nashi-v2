const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const gifs = require('@lib/socialGifs.json')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'poke',
      description: 'Poke your friends!',
      type: TYPES.SOCIAL,
      args: '{@mention}',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
   
    let gif = Math.floor(Math.random() * gifs.poke.length);

    let embed = new RichEmbed()
    .setColor(color)
    .setDescription(`image not loading? click [here](${gifs.poke[gif]})`);

    if (!args) {
        
        embed.setTitle("You poked yourself! Silly :3")
        await embed.setImage(gifs.poke[gif])

        message.channel.send(embed).catch(err => {if(err) console.log(err)});
    } else if (args[0]) {

        if (args[0] != message.mentions.members.first()) return this.error(ERROR.MEMBER_NOT_FOUND, {message, args})

        
        embed.setTitle(`${message.author.username} poked ${message.mentions.members.first().user.username}!`)
        await embed.setImage(gifs.poke[gif])
        message.channel.send(embed).catch(err => {if(err) console.log(err)});
    }

  }
}