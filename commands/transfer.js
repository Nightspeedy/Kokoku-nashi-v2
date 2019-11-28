const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
// const PERMISSIONS = require('@lib/permissions')
// const { Attachment } = require('discord.js')
const { Strings } = require('@lib/models')
// var QRCode = require('qrcode')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'transfer',
      description: 'Check your, or someone elses wallet.',
      type: TYPES.UTILITY,
      args: '{amount} {@mention}',
      bot
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
    this.orbt = bot.ORBT

    this.fetch.guild = true
  }

  async run ({ message, args, guild, color }) {
    const me = message.member
    const member = this.mention(args[0], message)
    if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    if (me.id === member.id) return this.error(ERROR.INVALID_ARGUMENTS, { message })

    const amount = parseFloat(args[1])
    if (isNaN(amount) || amount <= 0) return this.error(ERROR.INVALID_ARGUMENTS, { message })

    const minAmount = await Strings.findOne({ key: 'minimumTransaction' }) || { value: 0 }

    if (amount < parseFloat(minAmount.value)) return this.error({ message: `The minimum transaction is ${minAmount.value} KKN.` }, { message })

    const confirmation = await message.channel.send({
      embed: {
        title: 'Confirm Transaction',
        color: 0x3A6AE9,
        description: `Do you want to send ${amount} Kokoin to ${member.username}?`
      }
    })

    await confirmation.react('601850856832368640')
    await confirmation.react('601850856718991370')

    const filter = (reaction, user) => {
      return ['no', 'yes'].includes(reaction.emoji.name) && user.id === message.author.id
    }
    const embeds = this.orbt.embeds(amount, member.username)

    try {
      const collected = await confirmation.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      const reaction = collected.first()

      if (reaction._emoji.name === 'yes') {
        try {
          const transaction = await this.orbt.transfer(me.id, member.id, amount)
          confirmation.edit({ embed: embeds.queued })

          transaction.status.on('processing', () => {
            confirmation.edit({ embed: embeds.processing })
          })

          transaction.status.on('success', () => {
            confirmation.edit({ embed: embeds.completed })
          })

        } catch (e) {
          console.error('transaction failed', e)
          return confirmation.edit({ embed: embeds.canceled })
        }
      } else if (reaction._emoji.name === 'no') {
        await confirmation.edit({ embed: embeds.canceled })
      }
    } catch (e) {
      await confirmation.edit({ embed: embeds.canceled })
    }
  }
}
