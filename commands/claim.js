const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'daily',
      description: 'Claim your daily kokoin.',
      alias: ['claim', 'dailies'],
      type: TYPES.UTILITY,
      args: ''
    }) // Pass the appropriate command information to the base class.

    this.wallet = bot.config.wallet
    this.orbt = bot.ORBT
  }

  async run ({ message, member }) {
    if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    const aDay = 1000 * 60 * 60 * 24
    if (member.dailyLastUsed > Date.now() - aDay) return this.error(ERROR.TIMEOUT(member.dailyLastUsed + aDay), { message })

    const wallet = await this.orbt.wallet(member.id)
    if (!wallet) return this.error(ERROR.TRY_AGAIN, { message })

    await Member.updateOne({ id: member.id }, { dailyLastUsed: Date.now() })

    const transaction = await this.orbt.transfer({ privateKey: this.wallet.private, publicKey: this.wallet.public, id: 'bot' }, member.id, { frac: 100000 })

    const embeds = this.orbt.embeds(transaction.fromWallet.value / 100000, message.author.username)

    const statusMsg = await message.channel.send({ embed: embeds.queued })

    transaction.status.on('processing', () => {
      statusMsg.edit({ embed: embeds.processing })
    })

    transaction.status.on('success', () => {
      statusMsg.edit({ embed: embeds.completed })
    })
  }
}
