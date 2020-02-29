const Command = require('@lib/command')
const { Guild, MutedMembers } = require('@lib/models')
const { MOD_COMMAND } = require('@lib/types')
const ERROR = require('@lib/errors')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'mute',
      aliases: ['silence'],
      description: 'Mutes a member in this guild.',
      type: MOD_COMMAND,
      args: '{member} [timeout in minutes]'
    })
  }

  async run ({ message, args }) {
    const guild = await Guild.findOne({ id: member.guild.id })
    const minutes = args[0]

    if (guild.muteRole === undefined) {
    	return // TODO: No muteRole configured
    }

    const muteRole = message.guild.roles.get(guild.muteRole)
    const member = await message.guild.fetchMember(this.mention(args[0]).id)

    if (!member) {
    	return // TODO: Invalid member
    }

    await member.addRole(muteRole, `Muted by ${message.author}`)

    if (minutes) {
      const timedAction = await this.bot.timedActionHandler.push('removeRoles', minutes * 60 * 1000, {
      	guild: message.guild.id,
      	roles: [muteRole]
      })

      if (!timedAction) {
        console.error(timedAction)
        this.error(ERROR.UNKNOWN_ERROR, { message, args })
      } else {
        this.success('Member muted', `Member will be automatically unmuted ${minutes} minute${minutes !== 1 ? 's' : ''} from now.`, { message })
      }
    } else {
    	this.success('Member muted', 'Member has been assigned the mute role')
    }
  }
}
