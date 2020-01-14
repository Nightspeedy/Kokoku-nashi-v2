const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Attachment } = require('discord.js')
const { Member, Background } = require('@lib/models')

const Pageres = require('pageres')

const twemoji = require('twemoji')
const pageres = new Pageres()

module.exports = class extends Command {
  constructor () {
    super({
      name: 'profile',
      aliases: ['account', 'me'],
      description: "Shows your, or someone's profile!",
      type: TYPES.SOCIAL,
      args: '[@mention]'
    })
  }

  async shot (profile, author, bg) {
    const background = (bg || profile.selectedBackground) ? await Background.findOne({ name: bg || profile.selectedBackground }) : {}
    const emoji = await new Promise(resolve => twemoji.parse(
      profile.emoji,
      { callback: function (icon, options) { resolve(icon + '.png') } }))

    let wallet = await this.bot.ORBT.wallet(author.id)
    if (!wallet) wallet = { value: 0 }

    const queries = {
      avatar: author.avatarURL,
      level: profile.level,
      currentXP: profile.exp,
      nextXP: profile.level * 200,
      name: author.username,
      emojiAlt: profile.emoji,
      emojiLink: emoji,
      title: profile.title,
      description: profile.description,
      reps: profile.reputation,
      credits: wallet.value.toFixed(0),
      backgroundURL: background.url || '',
      filters: background.filters || 'none',
      css: background.css || ''
    }
    const queryString = encodeURIComponent(Buffer.from(JSON.stringify(queries)).toString('base64'))

    const shot = Buffer.from((await pageres
      .src(`http://localhost:8080/profile/card?data=${queryString}`, ['400x600'], { delay: 0.2 })
      .run())[0])
    return shot
  }

  async run ({ message, args, background, customMessage, onGenerated, member }) {
    let user = message.author

    if (args[0]) {
      user = await this.mention(args[0], message)
      if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })
    }

    if (user.bot) return this.error({ message: "Bots don't have profiles!" }, { message })

    if (!member) {
      member = Member.create({ id: user.id })
    }

    const cardMsg = await message.channel.send('Generating profile...')

    const buffer = await this.shot(member, user, background)

    const image = new Attachment(buffer, 'profile.png')
    cardMsg.delete()

    const sentMessage = await message.channel.send(customMessage || `:sparkles: **Profile card for ${user.username}** :sparkles:`, {
      files: [image]
    })

    onGenerated && onGenerated(sentMessage.attachments.first().url)

    // Reset pageres, Dumb hack to prevent memory leaks
    pageres.items = []
    pageres.urls = []
    pageres._source = []
    pageres.sizes = ['400x600']
    pageres.stats = { urls: 0, sizes: 1, screenshots: 0 }
  }
}
