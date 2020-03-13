const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'mine',
      description: 'Links to the Kokoin mining page',
      type: TYPES.UTILITY,
      args: 'This command has no arguments'
    })
  }

  async run ({ message, color }) {
    const embed = new RichEmbed()
      .setTitle('Mine Kokoin using your web-browser')
      .setDescription('Did you know Kokoin is a cryptocurrency? You can mine it too! Simply navigate to [this page](http://kokoku.xyz) and authorize with Discord. Then leave the page open whilst you do other things.')
    message.channel.send(embed)
  }
}
