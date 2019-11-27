const Event = require('@lib/event')
const { Counting, Member } = require('@lib/models')
const ArgumentParser = require("@lib/argumentParser")

module.exports = class extends Event {
  constructor (bot) {
    super({ event: 'message' })
    this.cmdhandler = bot.bot.cmdhandler
    this.bot = bot.bot
  }

  async trigger (message) {
    
    if (message.author.id === this.bot.user.id) return
    if (message.channel.name !== 'counting') return
    let counting = await Counting.findOne({id: message.guild.id})
    if (!counting) {
      await Counting.create({id: message.guild.id})
      counting = await Counting.findOne({id: message.guild.id})
    }

    if (!counting.countingEnabled) return

    let description = counting.countingDescription

    if (description.includes("{NUMBER}")) description = description.replace("{NUMBER}", `${counting.countingNumber + 2}`)
    if (!message.content.startsWith(counting.countingNumber + 1)) {
      message.delete()
      let wrong = counting.countingWrongNumber
      wrong = wrong.replace("{NUMBER}", `${counting.countingNumber + 1}`)
      return message.channel.send(wrong).then(msg => msg.delete(10000))
    }
    if (message.author.id === counting.countingLast) {
      message.delete()
      return message.channel.send(counting.countingDoubleMessage).then(msg => msg.delete(10000))
    }

    message.channel.setTopic(description)
    
    let msg = ArgumentParser(message.content, this.bot)
    await counting.updateOne({countingNumber: msg[0], countingLast: message.author.id})

  }
}
