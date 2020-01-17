
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'avatar',
      aliases: ['av', 'profileimage'],
      description: "Get your avater, or someone else's",
      type: TYPES.UTILITY,
      args: '[@user]'
    })
  }

  async run ({ message, args, color }) {
    const embed = new RichEmbed()
      .setColor(color)

    let user = message.author
    if (args[0]) {
      user = await this.mention(args[0], message)
    }

    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    embed.setTitle(user.tag)
      .setColor(color)
      .setDescription(`Here you go, |[Click me](${user.displayAvatarURL})|`)
      .setImage(user.displayAvatarURL)

    await message.channel.send(embed).catch(e => {})
  }
}
