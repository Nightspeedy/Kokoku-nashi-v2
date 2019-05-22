
const Command = require('@lib/command')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'avatar',
      description: "Get your avater, or someone else's",
      type: "utility"
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, member }) {
    
    if (!args[0]) {
    
        let embed = new RichEmbed()
        .setTitle(message.author.tag)
        .setColor(this.getRandomColor())
        .setDescription(`Here you go, |[Click me](${message.author.displayAvatarURL})|`)
        .setImage(message.author.displayAvatarURL)
    
        message.channel.send(embed);
    
    }
    if (args[0]) {
    
        if (!message.mentions.members.first()) return message.channel.send("**Error!** Please mention a valid user!");
            // if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
    
            let embed = new RichEmbed()
            .setTitle(message.mentions.members.first().user.tag)
            .setColor(this.getRandomColor())
            .setDescription(`Here you go, |[Click me](${message.mentions.members.first().user.displayAvatarURL})|`)
            .setImage(message.mentions.members.first().user.displayAvatarURL)
    
            message.channel.send(embed);
    
        }

    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
