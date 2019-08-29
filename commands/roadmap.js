const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'roadmap',
      description: 'Shows you what we are currently working on/going to be working on in the future',
      type: TYPES.UTILITY,
      args: '',
    }) // Pass the appropriate command information to the base class.

    this.wantToAdd = ['Fun commands', 'Event loggers, (send a logfile if something happens)', 'Music', 'Warning system', 'Punishment based on warnings', 'Muting system']
    this.workingOn = ['Moderation', "An interactive configuration command"]
    this.completed = ['Autoroles', 'Welcome/Leave messages', 'Global Profiles', 'Global levels', 'Profile titles/decriptions', 'Double global EXP/Coins for premium servers']
    this.bot = bot
  }

  async run ({ message, args, color }) {
    
    let embed = new RichEmbed()
    .setTitle('Roadmap')
    .setColor(color)

    let wantToAdd = ''
    let workingOn = ''
    let completed = ''

    for (let i = 0; i < this.wantToAdd.length; i++) {

        wantToAdd += "- " + this.wantToAdd[i] + "\n"

    }
    for (let i = 0; i < this.workingOn.length; i++) {

        workingOn += "- " + this.workingOn[i] + "\n"

    }
    for (let i = 0; i < this.completed.length; i++) {

        completed += "- " + this.completed[i] + "\n"

    }

    embed.addField("Features we want to add (updated as we think of more)", wantToAdd)
    .addField("Features we're working on", workingOn)
    .addField("Features we've completed", completed)

    message.channel.send(embed).catch(e => {})

  }
}
