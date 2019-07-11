const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'membercount',
      aliases: ['serversize'],
      description: 'Shows your server\'s membercount!',
      type: TYPES.UTILITY,
      args: 'This command has no arguments',
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true

    this.bot = bot
  }

  async run ({ message, color }) {

    let guild = await message.guild.fetchMembers()
    let totalUsers = guild.members.size
    let memberCount = guild.members.filter(member => !member.user.bot).size

    let botCount = totalUsers - memberCount

    let embed = new RichEmbed()
    .setTitle("Guild membercount")
    .setColor(color)
    .setDescription(`Total members in guild: ${totalUsers} \n\n${botCount} Bots\n${memberCount} Humans`)
    message.channel.send(embed).catch(e => {})

  }
}

// msg.guild.members.filter(member => !member.user.bot).size