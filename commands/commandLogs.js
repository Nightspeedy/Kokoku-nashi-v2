const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

const { CommandLogs } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'commandlogs',
      aliases: ['cmdlog'],
      description: 'Searh the command logs.',
      type: TYPES.BOT_OWNER,
      args: '@mention',
      bot
    }) // Pass the appropriate command information to the base class.
  }

  async run ({ message, args }) {
    const member = args[0] ? this.mention(args[0], message) : message.author
    if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    const logs = await CommandLogs.find({ user: member.id }).sort({ timestamp: -1 }).limit(5)

    message.channel.send({
      embed: {
        color: 0x3A6AE9,
        title: `Command Logs for ${member.tag}`,
        description: '',
        fields: logs.map(log => ({
          name: log.command,
          value: log.arguments.map(arg => `\`${arg}\``).join(' ') + `\n${new Date(log.timestamp).toLocaleString()}`
        })),
        timestamp: new Date()
      }
    })
  }
}
