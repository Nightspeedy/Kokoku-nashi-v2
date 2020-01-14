const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'membercount',
      aliases: ['serversize'],
      description: 'Shows your server\'s membercount!',
      type: TYPES.UTILITY,
      args: 'This command has no arguments'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, color }) {
    const guild = await message.guild.fetchMembers()
    const memberCount = guild.members.filter(member => !member.user.bot).size

    const botCount = guild.members.size - memberCount

    const embed = new RichEmbed()
      .setTitle('Guild membercount')
      .setColor(color)
      .setDescription(`Total members in guild: ${guild.members.size} \n\n${botCount} Bots\n${memberCount} Humans`)
    message.channel.send(embed).catch(e => {})
  }
}
