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

      if (!this.bot.cmdhandler.commands.get(command)) return this.error({message: `Command '${command}' is unknown!`}, {message,args})

      let cmddesc = this.bot.cmdhandler.commands.get(command).description
      let cmdargs = this.bot.cmdhandler.commands.get(command).args

      embed.setTitle('Command help: ' + args[0])
        .setColor(color)
        .setDescription(`Arguments enclosed in square brackets ( [] ) are OPTIONAL!\nArguments enclosed in curly braces ( {} ) are REQUIRED! \n\nDon't include example brackets in your command ( [] or {} )\n\n ${cmddesc}`)
        .addField('Usage:', `k!${command} ${cmdargs}`)
    } else {
      this.bot.cmdhandler.commands.forEach(cmd => {
        if (object[cmd.type].indexOf(`\`${cmd.name}\``) > -1) return
        i++
        object[cmd.type] += ` \`${cmd.name}\``
      })

      embed.setDescription('Use k!help [command] for detailed command information. or [join the official Discord server](https://discord.gg/rRSTX4w) \n\n\n **IMPORTANT** \n We currently have an active giveaway in our official server to celebrate our 1000th user! (Prize: Discord  Nitro 1 month)')
        .addField('Game commands', object.games)
        .addField('Social commands', object.social)
        .addField('Utility commands', object.utility)
        .addField('Mod commands', object.modCommand)
        .addField('Server owner commands', object.guildOwner)
        .addField('Bot owner commands', object.botOwner)
        .setFooter('Total commands: ' + i)
    }
    message.channel.send(embed).catch(e => {})
  }
}
