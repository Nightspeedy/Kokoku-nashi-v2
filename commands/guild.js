const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')


module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'guild',
      aliases: ['server'],
      description: 'Shows your guild\'s settings',
      type: TYPES.MOD_COMMAND,
      args: '[@mention]',
      permissions: [PERMISSIONS.SETTINGS]
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true

    this.bot = bot
  }

  async run ({ message, args, guild }) {

    // TODO: Make nice embed with settings
    return message.reply(JSON.stringify(guild))

  }
}
