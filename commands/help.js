const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')
const { Strings, DisabledCommand } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'help',
      description: "The help command, you're using this dummy!",
      type: TYPES.UTILITY,
      args: '[Command]'
    })
  }

  async run ({ message, args, color }) {
    // Instead of having 20 variables, i put them in an object
    const object = {
      general: '-',
      modCommand: '-',
      guildOwner: '-',
      botOwner: '-',
      utility: '-',
      social: '-',
      games: '-',
      music: '-'
    }

    // Fetch the message
    const msg = await Strings.findOne({ key: 'helpEmbed' })

    // Get an array of all disabled commands
    const disabled = (await DisabledCommand.find({ guild: message.guild.id })).map(d => d.command)

    const embed = new RichEmbed()
      .setColor(color)

    if (args[0]) {
      const cmd = this.bot.cmdhandler.commands.get(args[0])

      if (!cmd) return this.error({ message: `Command '${args[0]}' is unknown!` }, { message, args })

      embed.setTitle('Command help: ' + cmd.name)
        .setColor(color)
        .setDescription(`Arguments enclosed in square brackets ( [] ) are OPTIONAL!\nArguments enclosed in curly braces ( {} ) are REQUIRED! \n\nDon't include example brackets in your command ( [] or {} )\n\n ${cmd.description}`)
      if (cmd.aliases.length > 0) {
        embed.addField('Aliases:', `\`${cmd.aliases.join('`, `')}\``)
      }
      embed.addField('Usage:', `k!${cmd.name} ${cmd.args}`)
    } else {
      // Total commands, will get value later
      let i = 0
      this.bot.cmdhandler.commands.forEach(cmd => {
        if (object[cmd.type].indexOf(`\`${cmd.name}\``) > -1) return
        i++
        object[cmd.type] += disabled.indexOf(cmd.name) > -1 ? ` *~~\`${cmd.name}\`~~*` : ` \`${cmd.name}\``
      })

      embed.setDescription(`Use k!help [command] for detailed command information. or [join the official Discord server](https://discord.gg/rRSTX4w) \n\n ${msg.value} \n`)
        .addField('Game commands', object.games)
        .addField('Social commands', object.social)
        .addField('Utility commands', object.utility)
        .addField('Music commands', object.music)
        .addField('Mod commands', object.modCommand)
        .addField('Server owner commands', object.guildOwner)
        .addField('Bot owner commands', object.botOwner)
        .setFooter('Total commands: ' + i)
    }
    message.channel.send(embed).catch(e => {})
  }
}
