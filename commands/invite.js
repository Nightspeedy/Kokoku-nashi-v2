const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'invite',
      description: 'Send the bot invite URL via DM',
      type: TYPES.UTILITY,
      args: ''
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, color, args }) {
    // Make a copy of the current message object
    const preservedMessage = message
    const embed = new RichEmbed().setTitle('Bot invite').setColor(color).addField('Invite me with this link', '[Click here to invite me](https://discordapp.com/api/oauth2/authorize?client_id=503687810885353472&permissions=2146958839&scope=bot)')
    // If DM is successfull, add a reaction to the copied message object
    message.author.send(embed).then(message => { preservedMessage.react('524627369386967042') }).catch(e => {
      // If DM failed, send error
      this.error({ message: "I coultn't DM you, have you disabled it in your account settings?" }, { message, args })
    })
  }
}
