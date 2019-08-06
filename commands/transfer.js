const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Attachment } = require('discord.js')
const { Member } = require('@lib/models')
var QRCode = require('qrcode')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'transfer',
      description: 'Check your, or someone elses wallet.',
      type: TYPES.BOT_OWNER,
      args: '{amount} {@mention}'
    }) // Pass the appropriate command information to the base class.

    this.client = bot
    this.orbt = bot.ORBT
    console.log(this.orbt)

    this.fetch.guild = true
  }

  async run ({ message, args, guild, color }) {
    let me = message.member
    let member = message.mentions.users.first()
    if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    let amount = parseFloat(args[0])
    if (isNaN(amount) || amount <= 0) return this.error(ERROR.INVALID_ARGUMENTS, { message })

    let confirmation = await message.channel.send({ embed: {
      title: 'Confirm Transaction',
      color: 0x3A6AE9,
      description: `Do you want to send ${amount} Kokoin to ${member.username}?`
    } })

    await confirmation.react(this.client.emojis.get(`601850856832368640`))
    await confirmation.react(this.client.emojis.get(`601850856718991370`))

    const filter = (reaction, user) => {
      return ['no', 'yes'].includes(reaction.emoji.name) && user.id === message.author.id
    }
    try {
      let collected = await confirmation.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      const reaction = collected.first()

      if (reaction._emoji.name === 'yes') {
        try {
          await this.orbt.transfer(me.id, member.id, amount)
          await confirmation.edit({ embed: {
            title: 'Transaction Queued.',
            color: 0x4FE475,
            description: `Your transaction has been queued. It may take up to 30 seconds to process it.`,
            footer: { text: `${amount} to ${member.username}` },
            timestamp: new Date(Date.now())
          } })
        } catch (e) {
          return confirmation.edit({ embed: {
            title: 'Transaction Canceled',
            color: 0xD7422D,
            description: e.message,
            footer: { text: `${amount} to ${member.name}` },
            timestamp: new Date(Date.now())
          } })
        }
      } else if (reaction._emoji.name === 'no') {
        await confirmation.edit({ embed: {
          title: 'Transaction Canceled',
          color: 0xD7422D,
          description: `You've canceled the transaction.`,
          footer: { text: `${amount} to ${member.name}` },
          timestamp: new Date(Date.now())
        } })
      }
    } catch (e) {
      await confirmation.edit({ embed: {
        title: 'Transaction Canceled',
        color: 0xD7422D,
        description: `The transaction has timed out.`,
        footer: { text: `${amount} to ${member.name}` },
        timestamp: new Date(Date.now())
      } })
    }
  }
}
