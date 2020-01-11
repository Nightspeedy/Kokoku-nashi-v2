const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'user',
      description: 'Change user variables (levels/reputation/exp and much more)',
      type: TYPES.BOT_OWNER,
      args: '{@mention} {variable} [new value]'
    }) // Pass the appropriate command information to the base class.

    this.fetch.guild = true
  }

  async run ({ message, args, guild, color }) {
    // Error checking
    const member = this.mention(args[0], message)
    if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, { message, args })

    const user = await Member.findOne({ id: member.id })
    if (!user) return this.error(ERROR.UNKNOWN_MEMBER, { message, args })

    const action = args[1].toLowerCase()

    if (!this[`action_${action}`]) return this.error({ message: 'Invalid Action' }, { message })
    this[`action_${action}`](user, args, message)
  }

  async action_actions ({ message }) {//eslint-disable-line
    const commands = Object.keys(this).filter(key => key.startsWith('action_'))
    message.channel.send({
      embed: {
        title: 'Actions Available',
        description: commands.map(cmd => `\`${cmd}\``).join(' ')
      }
    })
  }

  // Reset a user profile
  async action_reset ({ user, message }) {//eslint-disable-line
    const userID = user.id
    await user.deleteOne()
    await Member.create({ id: userID })
    user = await Member.findOne({ id: userID })
    if (!user) {
      return this.error({ message: 'Couldn\'t create new profile' }, { message })
    } else {
      this.success('Profile has been reset', 'Successfully reset user profile', { message })
    }
  }

  // Add credits to a user
  async action_addCredits ({ message }) {//eslint-disable-line
    // TODO: Replace later with cryptocoin stuff
    return message.reply("Don't use this. cryptocoins are comming")
  }

  // Remove credits from a user
  async action_removeCredits ({ message }) {//eslint-disable-line
    // TODO: Replace later with cryptocoin stuff
    return message.reply("Don't use this. cryptocoins are comming")
  }

  // Add reputation points to a user
  async action_addReputation ({ user, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const repToAdd = parseInt(args[2])
    if (isNaN(repToAdd)) return this.error(ERROR.NAN, { message, args })
    const newReputation = user.reputation + repToAdd

    try {
      await user.updateOne({ reputation: newReputation })
      this.success('Added reputation', 'Successfully added reputation points to user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Remove reputation points from a user
  async action_removeReputation ({ user, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const repToRemove = parseInt(args[2])
    if (isNaN(repToRemove)) return this.error(ERROR.NAN, { message, args })
    let newReputation = user.reputation - repToRemove

    if (newReputation < 0) newReputation = 0
    try {
      await user.updateOne({ reputation: newReputation })
      this.success('Removed reputation', 'Successfully removed reputation points from user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Add levels to a user
  async action_addLevels ({ user, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const levelsToAdd = parseInt(args[2])
    if (isNaN(levelsToAdd)) return this.error(ERROR.NAN, { message, args })
    const newLevel = user.level + levelsToAdd

    try {
      await user.updateOne({ level: newLevel })
      this.success('Added levels', 'Successfully added levels to user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Remove levels from a user
  async action_removeLevels ({ user, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const levelsToRemove = parseInt(args[2])
    if (isNaN(levelsToRemove)) return this.error(ERROR.NAN, { message, args })
    let newLevel = user.level - levelsToRemove

    if (newLevel < 0) newLevel = 0
    try {
      await user.updateOne({ level: newLevel })
      this.success('Removed levels', 'Successfully removed levels from user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Set a a user's level
  async action_setLevel ({ user, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (isNaN(args[2])) return this.error(ERROR.NAN, { message, args })
    if (args[2] < 0) return this.error({ message: 'Cannot set a negative value' }, { message, args })

    try {
      await user.updateOne({ level: args[2] })
      this.success('Set level', 'Successfully set user level!', { message, args })
    } catch (e) {
      console.log(e)
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Set a user's reputation points
  async action_setReputation ({ user, args, message }) { //eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (isNaN(args[2])) return this.error({ message: 'Expected argument is not a number!' }, { message, args })
    if (args[2] < 0) return this.error({ message: 'Cannot set a negative value' }, { message, args })

    try {
      await user.updateOne({ reputation: args[2] })
      this.success('Set reputation', 'Successfuly set user reputation!', { message, args })
    } catch (e) {
      console.log(e)
      return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }
  async action_togglePremium ({ user, args, message }) { //eslint-disable-line
    if (user.isPremium) {
      try {
        user.updateOne({ isPremium: false })
        this.success('Premium status', 'User is no longer premium', { message, args })
      } catch (e) {
        return this.error(ERROR.TRY_AGAIN, { message })
      }
    }
    try {
      user.updateOne({ isPremium: true })
      return this.success('Premium status', 'User is now premium', { message, args })
    } catch (e) {
      return this.error(ERROR.TRY_AGAIN, { message })
    }
  }
}
