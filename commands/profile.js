const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'profile',
      aliases: ['account'],
      description: 'Shows your, or someone\'s profile!',
      type: TYPES.MOD_COMMAND,
      args: '[@mention]',
      permissions: [PERMISSIONS.KICK || PERMISSIONS.MODERATOR]
    }) // Pass the appropriate command information to the base class.

    this.fetch.member = true

    this.bot = bot
  }

  async run ({ message, args, member }) {

    return message.reply(JSON.stringify(member))

  }
}
