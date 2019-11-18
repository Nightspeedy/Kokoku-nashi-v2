const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const PERMISSIONS = require('@lib/permissions')
const { SHOP_ITEMS } = require('@lib/consts')
const { Steamkeys } = require('@lib/models')
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'shop',
      description: 'Buy something from the shop :)',
      type: TYPES.UTILITY,
      args: "Boop",
      bot
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    
    if (args[0] === 'buy') {
        const botKeys = this.bot.config.wallet
        const userWallet = await this.bot.ORBT.wallet(message.author.id)

        let item = undefined
        let amount

        SHOP_ITEMS.forEach(element => {
            console.log(element)

            if (element.productName === args[1].toLowerCase()) {

                item = args[1].toLowerCase()
                amount = element.price
            }
        });

        if (!item) return message.channel.send("That item does not exist.")

        const confirmation = await message.channel.send({
            embed: {
              title: 'Confirm purchase',
              color: 0x3A6AE9,
              description: `Are you sure you want to purchase this item?`
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
                try{
                    await message.author.send("Thank you for your purchase! Your order is processing!")
                    game = await Steamkeys.aggregate([ { $match: { type: 'game' } }, { $sample: { size: 1 } } ])
                    if (!game[0]) {
                        message.channel.send("Out of stock. Transaction was cancelled!")
                        return confirmation.edit({ embed: embeds.canceled })
                    }
                } catch(e) {

                    message.channel.send("I could not DM you. Transaction was cancelled!")
                    return confirmation.edit({ embed: embeds.canceled })
                }

                const transaction = await this.bot.ORBT.transfer(message.author.id, { privateKey: botKeys.private, publicKey: botKeys.public, id: 'Bot'}, amount)
                await confirmation.edit({ embed: embeds.queued })
      
                const listener = (data) => {
                    console.log("Test 1")
                  if (data.indexOf(transaction.id) > -1) {
                    console.log("Test2")
                    this.transferItem(item, message, game)
                    this.bot.ORBT.io.off('transactionsProcessed', listener)
                    confirmation.edit({ embed: embeds.completed })
                  }
                }
      
                this.bot.ORBT.io.on('transactionsProcessed', listener)
              } catch (e) {
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

  async transferItem(item, message, game){
    
    let embed = new RichEmbed()
    console.log(item)
    console.log(message)

    switch(item) {
        case 'steamkey':
            console.log("Got here")
            embed.setTitle('Thank you for your purchase!')
            .setDescription('Your purchase: 1x Random Steam key')
            .addField(`Game: ${game[0].name}`, `Steam key: ${game[0].key}`)

            await Steamkeys.remove({key: game[0].key})

            message.author.send(embed)
        break
    }

  }
}
