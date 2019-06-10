const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'help',
      description: "The help command, you're using this dummy!",
      type: TYPES.UTILITY,
      args: '[Command]',
      permissions: [PERMISSIONS.GENERAL]
    }) // Pass the appropriate command information to the base class.
    this.fetch.member = true // Fetch the Member object from DB on trigger.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    // Instead of having 20 variables, i put them in an object
    let object = {
      'general': '-',
      'modCommand': '-',
      'guildOwner': '-',
      'botOwner': '-',
      'utility': '-',
      'social': '-',
      'games': '-'
    }

    let embed = new RichEmbed()
      .setColor(color)

    // Total commands, will get value later
    let i = 0

    if (args[0]) {
      let command = args[0]

      if (!this.bot.cmdhandler.commands.get(command)) return message.channel.send(`**ERROR!** Command '${command}' is unknown!`)

      let cmddesc = this.bot.cmdhandler.commands.get(command).description
      let cmdargs = this.bot.cmdhandler.commands.get(command).args

      embed.setTitle('Command help: ' + args[0])
        .setColor(color)
        .setDescription(`Arguments enclosed in square brackets ( [] ) are OPTIONAL!\nArguments enclosed in curly braces ( {} ) are REQUIRED! \n\n ${cmddesc}`)
        .addField('Usage:', `k!${command} ${cmdargs}`)
    } else {
      this.bot.cmdhandler.commands.forEach(cmd => {
        i++
        if (object[cmd.type].indexOf(`\`${cmd.name}\``) > -1) return
        object[cmd.type] += ` \`${cmd.name}\``
      })

      embed.setDescription('Use k!help [command] for detailed command information.')
        .addField('General commands', object.general)
        .addField('Game commands', object.games)
        .addField('Social commands', object.social)
        .addField('Utility commands', object.utility)
        .addField('Mod commands', object.modCommand)
        .addField('Server owner commands', object.guildOwner)
        .addField('Bot owner commands', object.botOwner)
        .setFooter('Total commands: ' + i)
    }
    message.channel.send(embed)
  }
}
