const Command = require('@lib/command')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'help',
      description: "The help command, you're using this dummy!",
      type: "utility",
      args: "[Command]"
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, color }) {

    let object = {
      general: "-",
      modCommand: "-",
      botOwner: "-",
      utility: "-",
      social: "-",
      games: "-",
    }
    let i = 0

    let embed = new RichEmbed()
    .setColor(color)

    if (args[0]) {

      let command = args[0]

      if (!this.bot.cmdhandler.commands.get(command)) return message.channel.send(`**ERROR!** Command '${command}' is unknown!`)

      let cmddesc = this.bot.cmdhandler.commands.get(command).description
      let cmdargs = this.bot.cmdhandler.commands.get(command).args

      
      embed.setTitle("Command help: " + args[0])
      .setColor(color)
      .setDescription(`Arguments enclosed in square brackets ( [] ) are OPTIONAL!\nArguments enclosed in curly braces ( {} ) are REQUIRED! \n\n ${cmddesc}`)
      .addField("Usage", `k!${command} ${cmdargs}`)


    } else {

      this.bot.cmdhandler.commands.forEach(cmd => {

        i++
        if (cmd.type == "general") object.general += ` \`${cmd.name}\``
        if (cmd.type == "modCommand") object.modCommand += ` \`${cmd.name}\``
        if (cmd.type == "botOwner") object.botOwner += ` \`${cmd.name}\``
        if (cmd.type == "utility") object.utility += ` \`${cmd.name}\``
        if (cmd.type == "social") object.social += ` \`${cmd.name}\``
        if (cmd.type == "games") object.games += ` \`${cmd.name}\``
  
      });

      embed.setDescription("Use k!help [command] for detailed command information.")
      .addField("General commands", object.general)
      .addField("Game commands", object.games)
      .addField("Social commands", object.social)
      .addField("Utility commands", object.utility)
      .addField("Mod commands", object.modCommand)
      .addField("Bot owner commands", object.botOwner)
      .setFooter("Total commands: " + i);

    }
    message.channel.send(embed);
  }
}
