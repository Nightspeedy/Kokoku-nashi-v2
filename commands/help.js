const Command = require('@lib/command')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'help',
      description: "The help command, you're using this dummy!",
      type: "utility"
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, member, color }) {

    let object = {
      general: "-",
      modCommand: "-",
      botOwner: "-",
      utility: "-",
      social: "-",
      games: "-",
    }
    let i = 0
    this.bot.cmdhandler.commands.forEach(cmd => {

      i++
      if (cmd.type == "general") object.general += ` \`${cmd.name}\``
      if (cmd.type == "modCommand") object.modCommand += ` \`${cmd.name}\``
      if (cmd.type == "botOwner") object.botOwner += ` \`${cmd.name}\``
      if (cmd.type == "utility") object.utility += ` \`${cmd.name}\``
      if (cmd.type == "social") object.social += ` \`${cmd.name}\``
      if (cmd.type == "games") object.games += ` \`${cmd.name}\``

    });

    let embed = new RichEmbed()
    .setDescription("Use k!help [command] for detailed command information.")
    .setColor(color)
    .addField("General commands", object.general)
    .addField("Game commands", object.games)
    .addField("Social commands", object.social)
    .addField("Utility commands", object.utility)
    .addField("Mod commands", object.modCommand)
    .addField("Bot owner commands", object.botOwner)
    .setFooter("Total commands: " + i);

    message.channel.send(embed);
  }
}
