const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'gamble',
      description: 'Gamble your coins!',
      type: TYPES.GAMES,
      args: '{amount}',
    }) // Pass the appropriate command information to the base class.

    this.gif = ["https://cdn.discordapp.com/attachments/519032774972407828/600203788313427971/koko1_25xL.gif", "https://cdn.discordapp.com/attachments/519032774972407828/600203788875333632/koko1_25xR.gif"]

    this.fetch.member = true


    this.bot = bot
  }

  async run ({ message, args, color }) {

    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, {message})
    if (isNaN(args[0])) return this.error(ERROR.INVALID_ARGUMENTS, {message})
    let botKeys = this.bot.config.wallet

    if (args[0] > 5000) return this.error({message: 'You can\'t bet more then 5000 KKN at once'}, {message})
    if (args[0] < 100 ) return this.error({message: 'The minimum transaction is 100 KKN'}, {message})

    let random = Math.floor(Math.random() * 1000 +1)
    let msg, image, amount, from, to, username
    let embed = new RichEmbed()
    .setTitle("Gamble")
    if (random <= 600) {
        image = "https://cdn.discordapp.com/attachments/519032774972407828/600203786925113365/koko0_5x.gif"
        msg = "And won x0.5 of what you gambled!"
        from = message.author.id
        to = {publicKey: botKeys.public, privateKey: botKeys.private, id: 'Bot'}
        amount = args[0]/2
        username = 'Bot'
    } else if (random >600 && random <= 975 ) {
      let randGif = Math.floor(Math.random() * 2)
      image = this.gif[randGif]
      msg = "And won 1.25x of what you gambled!"
      from = {publicKey: botKeys.public, privateKey: botKeys.private, id: 'Bot'}
      to = message.author.id
      amount = args[0]*0.25
      username = message.author.username
    } else if (random > 975) {
      image = "https://cdn.discordapp.com/attachments/519032774972407828/600203785297461258/koko2_5x.gif"
      msg = "And won 2.5x of what you gambled!"
      from = {publicKey: botKeys.public, privateKey: botKeys.private, id: 'Bot'}
      to = message.author.id
      amount = args[0]*1.5
      username = message.author.username
    }

    await embed.setImage(image)
    .addField("You've gambled!", "Spinning the wheel!")
    let sentMessage = await message.channel.send(embed)

    setTimeout(async() => {
      let newEmbed = new RichEmbed()
      .setTitle("Gamble results:")
      .addField(`You've gambled: ${args[0]}`, msg)
      await sentMessage.edit(newEmbed)
      setTimeout(() => {
        this.sendTransaction(from, to, amount, username, sentMessage)
      }, 5000)
    }, 10000)
  }
  async sendTransaction (from, to, amount, username, sentMessage) {

    const embeds = this.bot.ORBT.embeds(amount, username)

    const transaction = await this.bot.ORBT.transfer(from, to, amount)

    sentMessage.edit({ embed: embeds.queued })

    transaction.status.on('processing', () => {
      sentMessage.edit({ embed: embeds.processing })
    })

    transaction.status.on('success', () => {
      sentMessage.edit({ embed: embeds.completed })
    })
  }
}