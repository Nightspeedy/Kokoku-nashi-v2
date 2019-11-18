const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
// const PERMISSIONS = require('@lib/permissions')
const { Attachment } = require('discord.js')
// const { Member } = require('@lib/models')
var QRCode = require('qrcode')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'wallet',
      description: 'Check your, or someone elses wallet.',
      type: TYPES.UTILITY,
      args: '[@mention]'
    }) // Pass the appropriate command information to the base class.

    this.orbt = bot.ORBT

    this.fetch.guild = true
  }

  async run ({ message, args, guild, color }) {
    const member = this.mention(args[0], message) || message.author
    if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    const wallet = await this.orbt.wallet(member.id)
    if (!wallet) return this.error(ERROR.TRY_AGAIN, { message })

    const qr = Buffer.from((await QRCode.toDataURL(wallet.publicKey)).split(',')[1], 'base64')
    const image = new Attachment(qr, 'wallet.png')

    message.channel.send({
      embed: {
        color: 0x3A6AE9,
        title: `${member.username}'s Wallet`,
        description: `💵 ${wallet.value.toFixed(0)} Kokoin`,
        thumbnail: { url: 'attachment://wallet.png' },
        timestamp: new Date()
      },
      files: [image]
    })
  }
}
