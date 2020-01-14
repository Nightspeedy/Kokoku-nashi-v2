const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'invite',
      description: 'Send the bot invite URL via DM',
      type: TYPES.UTILITY,
      args: ''
    })
  }

  async run ({ message, color }) {
    const embed = new RichEmbed().setTitle('Bot invite').setColor(color).addField('Invite me with this link', '[Click here to invite me](https://discordapp.com/api/oauth2/authorize?client_id=503687810885353472&permissions=2146958839&scope=bot)')
    // If DM is successfull, add a reaction to the copied message object
    message.author.send(embed).then(() => { message.react('524627369386967042') }).catch(e => {
      // If DM failed, send error
      this.error({ message: "I couldn't DM you, have you disabled it in your account settings?" }, { message })
    })
  }
}
