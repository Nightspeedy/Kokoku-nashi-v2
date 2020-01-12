const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Background, Inventory, Member, BackgroundCategories } = require('@lib/models')
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
    if (!args[0]) return this.action_list({ message, args })
    if (!this[`action_${args[0].toLowerCase()}`]) return this.error(ERROR.INVALID_ARGUMENTS, { message })
    this[`action_${args[0].toLowerCase()}`]({ message, args: args.slice(1) })
  }

  underscoreToName (underscored) {
    return underscored
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

  async action_set ({ message, args }) { //eslint-disable-line
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    const background = await Background.findOne({ name: this.nameToUnderscore(args.join(' ')) })
    if (!background) return this.error({ message: 'I couldn\'t find that background!' }, { message, args })

    const owns = await Inventory.findOne({ id: message.author.id, category: 'PROFILE_BACKGROUND', name: this.nameToUnderscore(args.join(' ')) })
    if (!owns) return this.error({ message: 'You don\'t own that background!' }, { message, args })

    await Member.findOneAndUpdate({ id: message.author.id }, { selectedBackground: background.name })
    this.success('Background Equipped', 'You\'ve successfully changed your background!', { message })
  }

  async action_view ({ message, args }) { //eslint-disable-line
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const background = await Background.findOne({ name: this.nameToUnderscore(args.join(' ')) })
    if (!background || background.hidden) return this.error({ message: 'I couldn\'t find that background!' }, { message, args })
    if (!background.preview) {
      await this.bot.cmdhandler.commands.get('profile').run({
        message: {
          ...message,
          author: {
            ...message.author,
            id: '215143736114544640',
            avatarURL: 'https://cdn.discordapp.com/attachments/580321698423767050/665926382617886752/43f2fae1f575156386b3bcd2eee06df5.png',
            username: 'Leah'
          }
        },
        args: [],
        background: background.name,
        customMessage: `:sparkles: **Preview of ${this.underscoreToName(background.name)}** :sparkles:`,
        onGenerated: async (url) => {
          console.log(url)
          await background.updateOne({ preview: url })
        }
      })
    } else {
      await message.channel.send(`:sparkles: **Preview of ${this.underscoreToName(background.name)}** :sparkles:`, { files: [background.preview] })
    }
  }

  async action_list ({ message, args }) { //eslint-disable-line
    const backgrounds = await Background.find({ hidden: { $ne: true } })
    const owned = (await Inventory.find({ id: message.author.id, category: 'PROFILE_BACKGROUND' })).map(x => x.name)
    const categories = (await BackgroundCategories.find())
      .reduce((obj, item) => {
        obj[item.key] = { ...item._doc, items: [] }
        return obj
      }, {})
    for (const bg of backgrounds) {
      if (bg.category === 'DEV') continue
      if (!categories[bg.category]) { categories[bg.category] = { cost: 250, items: [] } }
      categories[bg.category].items.push(bg)
    }

    message.channel.send({
      embed: {
        title: 'Available Backgrounds',
        description: 'Use `k!backgrounds view {background name}` to preview any background before purchasing it using `k!backgrounds buy`.',
        fields: Object.keys(categories).map(key => ({
          name: `:dollar: ${categories[key].cost} - ${this.underscoreToName(key)}`,
          value: categories[key].items.map(item => (
            owned.indexOf(item.name) > -1
              ? `~~\`${this.underscoreToName(item.name)}\`~~`
              : `\`${this.underscoreToName(item.name)}\``
          )).join(' ') || 'No Backgrounds Available.'
        }))
      }
    })
  }

  async action_buy ({ message, args }) { //eslint-disable-line
    if (!args[0]) return this.action_list({ message, args })

    const background = await Background.findOne({ name: this.nameToUnderscore(args.join(' ')) })
    if (!background || background.hidden) return this.error({ message: 'I couldn\'t find that background!' }, { message, args })

    const owns = await Inventory.findOne({ id: message.author.id, category: 'PROFILE_BACKGROUND', name: this.nameToUnderscore(args.join(' ')) })
    if (owns) return this.error({ message: 'You already own that background!' }, { message, args })

    const category = await BackgroundCategories.findOne({ key: background.category }) || { cost: 0 }

    const wallet = await this.bot.ORBT.wallet(message.author.id)
    if (!wallet || wallet.value < category.cost) return this.error(ERROR.INSUFFICIENT_FUNDS, { message, args })

    await this.action_view({ message, args })

    const confirmation = await message.channel.send({
      embed: {
        title: 'Confirm Transaction',
        color: 0x3A6AE9,
        description: category.cost === 0
          ? 'Do you want to add this background to your inventory for free?'
          : `Do you want to buy this background for ${category.cost} Kokoin?`
      }
    })

    await confirmation.react('601850856832368640')
    await confirmation.react('601850856718991370')

    const filter = (reaction, user) => {
      return ['no', 'yes'].includes(reaction.emoji.name) && user.id === message.author.id
    }
    const embeds = this.bot.ORBT.embeds(category.cost, 'Background Shop')

    try {
      const collected = await confirmation.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      const reaction = collected.first()

      if (reaction._emoji.name === 'yes') {
        if (category.cost === 0) {
          confirmation.delete()
          await Inventory.create({
            id: message.author.id,
            name: background.name,
            category: 'PROFILE_BACKGROUND',
            content: `Purchased by ${message.author.id} - ${new Date().toISOString()}`
          })
          await Member.findOneAndUpdate({ id: message.author.id }, { selectedBackground: background.name })
          return this.success('Purchased Background', 'Congrats! You now own this super cool background!', { message })
        }
        const botKeys = this.bot.config.wallet
        const transaction = await this.bot.ORBT.transfer(message.author.id, { privateKey: botKeys.private, publicKey: botKeys.public, id: 'Bot' }, category.cost)
        confirmation.edit({ embed: embeds.queued })

        transaction.status.on('processing', () => {
          confirmation.edit({ embed: embeds.processing })
        })

        transaction.status.on('success', async () => {
          confirmation.edit({ embed: embeds.completed })
          await Inventory.create({
            id: message.author.id,
            name: background.name,
            category: 'PROFILE_BACKGROUND',
            content: `Purchased by ${message.author.id} - ${new Date().toISOString()}`
          })
          await Member.findOneAndUpdate({ id: message.author.id }, { selectedBackground: background.name })
          this.success('Purchased Background', 'Congrats! You now own this super cool background!', { message })
        })
      } else if (reaction._emoji.name === 'no') {
        await confirmation.edit({ embed: embeds.canceled })
      }
    } catch (e) {
      await confirmation.edit({ embed: embeds.canceled })
    }
  }
}
