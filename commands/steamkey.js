const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { Steamkeys } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'steamkey',
      description: 'Adds/Removes/Lists steam keys',
      type: TYPES.BOT_OWNER,
      args: '{add/remove/list} [Game name] [Steam key]',
      cooldownTime: 30
    })
    this.orbt = bot.ORBT
  }

  async run ({ message, args }) {
    if (!args[0]) return

    switch (args[0]) {
      case 'add':
        if (!args[1]) return
        try {
          const key = await Steamkeys.find({ key: args[2] })
          if (key[0]) return message.channel.send('That key already exists!')
          await Steamkeys.create({ name: `${args[1]}`, key: `${args[2]}` })
          message.channel.send('Added key to database.')
        } catch (e) {
          message.channel.send('Something went wrong...')
          return console.log(e)
        }
        break
      case 'remove':
        try {
          if (!args[1]) return
          await Steamkeys.deleteOne({ key: args[1] })
          message.channel.send('Removed key from database.')
        } catch (e) {
          console.log(e)
        }
        break
    }
    message.delete()
  }
}
