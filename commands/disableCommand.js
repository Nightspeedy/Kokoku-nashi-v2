const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { DisabledCommand } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'disable',
      description: 'Disable a command.',
      type: TYPES.GUILD_OWNER,
      args: '{command}',
      cooldownTime: 2
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args }) {
    if (!message.guild) return this.error({ message: 'This only works in guilds.' }, { message })

    const command = this.bot.cmdhandler.commands.get(args[0])
    if (!command) return this.error({ message: "You can't disable what doesn't exist!" }, { message })
    if (await DisabledCommand.findOne({ guild: message.guild.id, command: command.name })) {
      return this.error({ message: 'This command is already disabled.' }, { message })
    }
    if (command.type === TYPES.GUILD_OWNER) return this.error({ message: "You can't disable owner commands!" }, { message })
    if (command.type === TYPES.BOT_OWNER) return this.error({ message: "d̷òn͠'t u͏p̸se͡t̛ the god̡s." }, { message })

    await DisabledCommand.create({ guild: message.guild.id, command: command.name })

    return this.success('Command disabled.', `Successfully disabled ${command.name}`, { message })
  }
}
