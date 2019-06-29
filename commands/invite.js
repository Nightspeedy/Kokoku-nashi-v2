const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'invite',
      aliases: ['inv'],
      description: 'Send the bot invite URL via DM',
      type: TYPES.UTILITY,
      args: '',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, color }) {
    const embed = new RichEmbed().setTitle("Bot invite").setColor(color).addField("Invite me with this link", "[Click here to invite me](https://discordapp.com/api/oauth2/authorize?client_id=503687810885353472&permissions=2146958839&scope=bot)")
    message.author.send(embed).catch(() => {
      message.channel.send("I coultn't DM you, have you disabled it in your account settings?")
    })
  }
}
