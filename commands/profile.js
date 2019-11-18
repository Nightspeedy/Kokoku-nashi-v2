const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Attachment } = require('discord.js')
const { Member, Background } = require('@lib/models')

const Pageres = require('pageres')

const twemoji = require('twemoji')
let pageres = new Pageres()

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'profile',
      aliases: ['account', 'me'],
      description: 'Shows your, or someone\'s profile!',
      type: TYPES.SOCIAL,
      args: '[@mention]'
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true

    this.bot = bot
    
    // is this used??
    // no lol
    this.currentShot = -1
  }

  async shot (profile, author) {
    let background = profile.selectedBackground ? await Background.findOne({ name: profile.selectedBackground }) : {}
    let emoji = await new Promise(resolve => twemoji.parse(
      profile.emoji,
      { callback: function (icon, options) { resolve(icon + '.png') } }))

    const wallet = await this.bot.ORBT.wallet(author.id)
    if (!wallet) wallet = { value: 0 }

    let queries = {
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
    let queryString = encodeURIComponent(Buffer.from(JSON.stringify(queries)).toString('base64'))

    let shot = Buffer.from((await pageres
      .src(`http://localhost:8080/profile/card?data=${queryString}`, ['400x600'], { delay: 0.2 })
      .run())[0])
    return shot
  }
  
  async run ({ message, args, member, color }) {
    let buffer, mention
    let username = message.author.username

    if (args[0]) {
      mention = await this.mention(args[0], message)
      if (typeof mention != 'object') return this.error(ERROR.MEMBER_NOT_FOUND,{message})
    }

    if (mention && !(await Member.findOne({id: mention.id})) ) Member.create({id: mention.id})

    let cardMsg = await message.channel.send(`Generating profile...`)
    if (mention != undefined) {
      let mentionMember = await Member.findOne({ id: mention.id })
      if (!mentionMember) return message.channel.send(this.error(ERROR.UNKNOWN_MEMBER, { message, args }))
      buffer = await this.shot(mentionMember, mention)
      username = mention.username
    } else {
      buffer = await this.shot(member, message.author)
    }
    let image = new Attachment(buffer, 'profile.png')
    cardMsg.delete()
    await message.channel.send(`:sparkles: **Profile card for ${username}** :sparkles:`, {
      files: [image]
    })

    pageres.items = []
    pageres.urls = []
    pageres._source = []
    pageres.sizes = ['400x600']
    pageres.stats = { urls: 0, sizes: 1, screenshots: 0 }
  }
}
