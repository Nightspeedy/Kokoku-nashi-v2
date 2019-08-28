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

    let wantToAdd = await Strings.findOne({key: 'wantToAdd'})
    let workingOn = await Strings.findOne({key: 'workingOn'})
    let completed = await Strings.findOne({key: 'completed'})

    embed.addField("Features we want to add (updated as we think of more)", wantToAdd.value)
    .addField("Features we're working on", workingOn.value)
    .addField("Features we've recently completed", completed.value)

    message.channel.send(embed).catch(e => {})

  }
}
