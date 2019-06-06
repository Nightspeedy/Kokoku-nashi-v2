
const Command = require('@lib/command')
const PERMISSIONS = require('@lib/permissions')
const { Member } = require('@lib/models')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'profile',
      description: 'Purge a specific amount of messages (maximum 1000 messages)',
      type: 'social',
      args: '{Amount}',
      permissions: [PERMISSIONS.GENERAL]
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true;
    this.bot = bot
  }

  async run ({ message, args, color, member}) {
   
    console.log(member)
    //message.reply(JSON.stringify(member))

    let nxtLvl = member.level * 200;
    
    if (!args[0]) {

      let embed = new RichEmbed()
      .setTitle(message.author.username + "'s Profile")
      .setThumbnail(message.author.displayAvatarURL)
      .setColor(color)
      .addField("Level", member.level)
      .addField("Next level progress", member.exp + "/" + nxtLvl + " Exp")
      .addField("Reputation", member.reputation)
      .addField("Credits", member.credits);

      message.channel.send(embed);

    } else {

      if (!member) return console.log("member is undefined");
      if (args[1]) return console.log("too many arguments");

      let mbr = await this.bot.users.get(`${member.id}`)

      let embed = new RichEmbed()
      .setTitle(mbr.username + "'s Profile")
      .setThumbnail(mbr.displayAvatarURL)
      .setColor(color)
      .addField("Level", member.level)
      .addField("Next level progress", member.exp + "/" + nxtLvl + " Exp")
      .addField("Reputation", member.reputation)
      .addField("Credits", member.credits);

      message.channel.send(embed);
    }
  }
}
