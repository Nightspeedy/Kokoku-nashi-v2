const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')
const { SHOP_ITEMS } = require('@lib/consts')
const { Steamkeys } = require('@lib/models')
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'shop',
      description: 'Buy something from the shop :)',
      type: TYPES.UTILITY,
      args: 'Boop',
      bot
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    if (message.guild.id !== '524624032012959745') return this.error({ message: 'This command can only be used in the [official Kōkoku Nashi server](https://discord.gg/rRSTX4w)!' }, { message })

    if (!args[0]) args[0] = 'list'

    if (args[0] === 'buy') {
      const botKeys = this.bot.config.wallet

      let item
      let amount

      SHOP_ITEMS.forEach(element => {
        if (element.productName === args[1].toLowerCase()) {
          item = args[1].toLowerCase()
          amount = element.price
        }
      })

      if (!item) return message.channel.send('That item does not exist.')

      const confirmation = await message.channel.send({
        embed: {
          title: 'Confirm purchase',
          color: 0x3A6AE9,
          description: 'Are you sure you want to purchase this item?'
        }
      })

      await confirmation.react('601850856832368640')
      await confirmation.react('601850856718991370')

      const filter = (reaction, user) => {
        return ['no', 'yes'].includes(reaction.emoji.name) && user.id === message.author.id
      }
      const embeds = this.bot.ORBT.embeds(amount, 'Shop')

      try {
        const collected = await confirmation.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        const reaction = collected.first()

        if (reaction._emoji.name === 'yes') {
          try {
            let game
            try {
              game = await Steamkeys.aggregate([{ $match: { type: 'game' } }, { $sample: { size: 1 } }])
              if (!game[0]) {
                message.channel.send('Out of stock. Transaction was cancelled!')
                return confirmation.edit({ embed: embeds.canceled })
              }
              await message.author.send('Thank you for your purchase! Your order is processing!')
            } catch (e) {
              message.channel.send('I could not DM you. Transaction was cancelled!')
              return confirmation.edit({ embed: embeds.canceled })
            }

            const transaction = await this.bot.ORBT.transfer(message.author.id, { privateKey: botKeys.private, publicKey: botKeys.public, id: 'Bot' }, amount)
            await confirmation.edit({ embed: embeds.queued })

            transaction.status.on('processing', () => {
              confirmation.edit({ embed: embeds.processing })
            })

            transaction.status.on('success', () => {
              this.transferItem(item, message, game)
              confirmation.edit({ embed: embeds.completed })
            })
          } catch (e) {
            return confirmation.edit({ embed: embeds.canceled })
          }
        } else if (reaction._emoji.name === 'no') {
          await confirmation.edit({ embed: embeds.canceled })
        }
      } catch (e) {
        await confirmation.edit({ embed: embeds.canceled })
      }
    } else if (args[0] === 'list') {
      const embed = new RichEmbed()
        .setTitle('Item shop')
        .setDescription('Here you can buy items with your Kokoin \n\nUsage of the buy command is as follows:\nk!shop buy steamkey\n\nUpon purchase, you will be asked to confirm your transaction. After your transaction has been verified. the goods will be transfered.')
        .addField('1x Steam key', 'Item name: steamkey - Price: 5000 KKN')

      message.channel.send(embed)
    } else {

    }
  }

  async transferItem (item, message, game) {
    const embed = new RichEmbed()

    switch (item) {
      case 'steamkey':
        embed.setTitle('Your order was completed!')
          .setDescription('Your purchase: 1x Random Steam key')
          .addField(`Game: ${game[0].name}`, `Steam key: ${game[0].key}`)

        await Steamkeys.deleteOne({ key: game[0].key })

        message.author.send(embed)
        message.channel.send('Your Steam key has been sent to your DM!')
        break
    }
  }
}
