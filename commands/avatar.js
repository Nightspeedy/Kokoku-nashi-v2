
const Command = require('@lib/command')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'avatar',
      description: "Get your avater, or someone else's",
      type: "utility",
      args: "[@user]"
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = false // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    let embed = new RichEmbed()
    .setColor(color)
    
    if (!args[0]) {
    
        embed.setTitle(message.author.tag)
        .setColor(color)
        .setDescription(`Here you go, |[Click me](${message.author.displayAvatarURL})|`)
        .setImage(message.author.displayAvatarURL)
    
        message.channel.send(embed);
    
    }
    if (args[0]) {
    
        if (!message.mentions.members.first()) return message.channel.send("**Error!** Please mention a valid user!");
            // if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
    
            embed.setTitle(message.mentions.members.first().user.tag)
            .setColor(color)
            .setDescription(`Here you go, |[Click me](${message.mentions.members.first().user.displayAvatarURL})|`)
            .setImage(message.mentions.members.first().user.displayAvatarURL)
    
            message.channel.send(embed);
    
        }

    }
}
