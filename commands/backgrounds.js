const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Background } = require('@lib/models')
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'backgrounds',
      aliases: ['background', 'bg', 'theme'],
      description: 'Customize your profile!',
      type: TYPES.SOCIAL,
      args: '{buy/set/view/list} [name]',
      bot
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    if (!this[`action_${args[0].toLowerCase()}`]) return this.error(ERROR.INVALID_ARGUMENTS, { message })
    this[`action_${args[0].toLowerCase()}`]({ message, args: args.slice(1) })
  }

  underscoreToName (undescored) {
    return undescored
      .split('_')
      .map(split => split.charAt(0).toUpperCase() + split.slice(1).toLowerCase())
      .join(' ')
  }

  nameToUnderscore (name) {
    return name
      .split(' ')
      .map(split => split.toUpperCase())
      .join('_')
  }

  async action_view ({ message, args }) { //eslint-disable-line
    if (!args[0]) return
    const background = await Background.findOne({ name: this.nameToUnderscore(args[0]) })
    if (!background) return
    this.bot.cmdhandler.commands.get('profile').run({
      message,
      args: [],
      background: background.name,
      customMessage: `:sparkles: **Preview for ${this.underscoreToName(background.name)}** :sparkles:`
    })
  }

  async action_list ({ message, args }) { //eslint-disable-line
    const backgrounds = await Background.find({}).limit(10)
    message.channel.send({
      embed: {
        title: 'Available Backgrounds',
        description: 'Use `k!backgrounds view {background name}` to preview any background before purchasing it.',
        fields: backgrounds.map(bg => ({ name: bg.name, value: `:dollar: ${bg.cost} KKN - ${this.underscoreToName(bg.name)}` }))
      }
    })
  }
}
