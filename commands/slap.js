const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const gifs = require('@lib/socialGifs.json')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'slap',
      description: 'Slap your best friend, or... slap that one guy you dont like.',
      type: TYPES.SOCIAL,
      args: '[@mention]',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    let gif = Math.floor(Math.random() * gifs.slap.length);

    let embed = new RichEmbed()
    .setColor(color)
    .setDescription(`image not loading? click [here](${gifs.slap[gif]})`);

	if (args[0]) {

        if (args[0] != message.mentions.members.first()) return this.error(ERROR.MEMBER_NOT_FOUND, {message, args})

        
        embed.setTitle(`${message.author.username} slapped ${message.mentions.members.first().user.username}`)
        await embed.setImage(gifs.slap[gif])

        message.channel.send(embed).catch(e => {})
    } else {
		        
        embed.setTitle("You slapped yourself... does that hurt?")
        await embed.setImage(gifs.slap[gif])

        message.channel.send(embed).catch(e => {})
	}
  }
}