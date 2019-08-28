const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { Strings } = require('@lib/models')


module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'roadmap',
      description: 'Shows you what we are currently working on/going to be working on in the future',
      type: TYPES.UTILITY,
      args: '',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    
    let embed = new RichEmbed()
    .setTitle('Roadmap')
    .setColor(color)

    let wantToAdd = await Strings.findOne({key: 'wantToAdd'})// ['Fun commands', 'Event loggers, (send a logfile if something happens)', 'Music', 'Warning system', 'Punishment based on warnings', 'Muting system']
    let workingOn = await Strings.findOne({key: 'workingOn'})// ['Moderation', "An interactive configuration command"]
    let completed = await Strings.findOne({key: 'completed'})// ['Autoroles', 'Welcome/Leave messages', 'Global Profiles', 'Global levels', 'Profile titles/decriptions', 'Double global EXP/Coins for premium servers']
    

    // for (let i = 0; i < this.wantToAdd.length; i++) {

    //     wantToAdd += "- " + this.wantToAdd[i] + "\n"

    // }
    // for (let i = 0; i < this.workingOn.length; i++) {

    //     workingOn += "- " + this.workingOn[i] + "\n"

    // }
    // for (let i = 0; i < this.completed.length; i++) {

    //     completed += "- " + this.completed[i] + "\n"

    // }

    embed.addField("Features we want to add (updated as we think of more)", wantToAdd.value)
    .addField("Features we're working on", workingOn.value)
    .addField("Features we've recently completed", completed.value)

    message.channel.send(embed).catch(e => {})

  }
}
