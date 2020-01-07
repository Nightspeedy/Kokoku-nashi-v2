const Command = require('@lib/command')
const TYPES = require('@lib/types')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'purge',
      description: 'Purge a specific amount of messages (maximum 1000 messages)',
      type: TYPES.MOD_COMMAND,
      args: '{Amount}',
      permissions: [PERMISSIONS.PURGE]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, color }) {
    const embed = new RichEmbed()
      .setColor(color)

    if (args[0]) {
      if (isNaN(args[0])) return ('I cant purge this...')

      const number = args[0] + 1

      embed.setTitle(message.author.tag)
        .setColor(color)

      if (number > 100) {
        await this.purgeLoop(number, message, true)
      } else {
        message.channel.bulkDelete(number).then(message.channel.send('Deleted messages').catch(err => {
          if (err) return this.error({ message: "I coulnd't delete messages, Do i have the MANAGE_MESSAGES permission?" }, { message, args })
        }))
      }
    } else {
      return message.channel.send('Please tell me how many messages you want me to purge!').catch(e => {})
    }
  }

  purgeLoop (number, message, loop) {
    if (!loop) return
    if (number > 100) message.channel.send('Deleting messages, this might take a while!').catch(e => {})

    if (number < 1) return message.channel.send('Successfully deleted messages!').then(message.delete(10000)).catch(e => {})
    setTimeout(async () => {
      if (number > 100) {
        await message.channel.fetchMessages({ limit: 100 })
        try {
          await message.channel.bulkDelete(100)
        } catch (e) {
          console.error(e)
          loop = false
          return this.error({ message: "I coulnd't delete messages, Do i have the MANAGE_MESSAGES permission?" }, { message })
        }
        number -= 100
      } else {
        await message.channel.fetchMessages({ limit: number })
        try {
          await message.channel.bulkDelete(100)
        } catch (e) {
          console.error(e)
          loop = false
          return this.error({ message: "I coulnd't delete messages, Do i have the MANAGE_MESSAGES permission?" }, { message })
        }
        number = 0
      }

      this.purgeLoop(number, message, loop)
    }, 10000)
  }
}
