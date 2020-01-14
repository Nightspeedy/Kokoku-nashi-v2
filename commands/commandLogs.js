const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')

const { CommandLogs } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'commandlogs',
      aliases: ['cmdlog'],
      description: 'Searh the command logs.',
      type: TYPES.BOT_OWNER,
      args: '@mention'
    })
  }

  async run ({ message, args }) {
    const user = args[0] ? this.mention(args[0], message) : message.author
    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    const logs = await CommandLogs.find({ user: user.id }).sort({ timestamp: -1 }).limit(5)

    message.channel.send({
      embed: {
        color: 0x3A6AE9,
        title: `Command Logs for ${user.tag}`,
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
