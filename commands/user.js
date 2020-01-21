const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Member, Background } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'user',
      description: 'Change user variables (levels/reputation/exp and much more)',
      type: TYPES.BOT_OWNER,
      args: '{@mention} {variable} [new value]'
    })
  }

  async run ({ message, args }) {
    // Error checking
    const user = await this.mention(args[0], message)
    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message, args })
    const member = await Member.findOne({ id: user.id })
    if (!member) return this.error(ERROR.UNKNOWN_MEMBER, { message, args })
    const action = args[1].toLowerCase()

    if (!this[`action_${action}`]) return this.error({ message: 'Invalid Action' }, { message })
    this[`action_${action}`]({ member, args, message })
  }

  // Reset a user profile
  async action_reset ({ member, message }) {//eslint-disable-line
    await member.deleteOne()
    member = await Member.create({ id: member.id })
    if (!member) {
      return this.error({ message: 'Couldn\'t reset profile!' }, { message })
    } else {
      this.success('Profile has been reset', 'Successfully reset user profile', { message })
    }
  }

  // Add reputation points to a user
  async action_addreputation ({ member, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const repToAdd = parseInt(args[2])
    if (isNaN(repToAdd)) return this.error(ERROR.NAN, { message, args })
    const newReputation = member.reputation + repToAdd

    try {
      await member.updateOne({ reputation: newReputation })
      this.success('Added reputation', 'Successfully added reputation points to user!', { message, args })
    } catch (e) {
      console.error(e)
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Remove reputation points from a user
  async action_removereputation ({ member, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const repToRemove = parseInt(args[2])
    if (isNaN(repToRemove)) return this.error(ERROR.NAN, { message, args })
    let newReputation = member.reputation - repToRemove

    if (newReputation < 0) newReputation = 0
    try {
      await member.updateOne({ reputation: newReputation })
      this.success('Removed reputation', 'Successfully removed reputation points from user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Add levels to a user
  async action_addlevels ({ member, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const levelsToAdd = parseInt(args[2])
    if (isNaN(levelsToAdd)) return this.error(ERROR.NAN, { message, args })
    const newLevel = member.level + levelsToAdd

    try {
      await member.updateOne({ level: newLevel })
      this.success('Added levels', 'Successfully added levels to user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Remove levels from a user
  async action_removelevels ({ member, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    const levelsToRemove = parseInt(args[2])
    if (isNaN(levelsToRemove)) return this.error(ERROR.NAN, { message, args })
    let newLevel = member.level - levelsToRemove

    if (newLevel < 0) newLevel = 0
    try {
      await member.updateOne({ level: newLevel })
      this.success('Removed levels', 'Successfully removed levels from user!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Set a a user's level
  async action_setlevel ({ member, args, message }) {//eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (isNaN(args[2])) return this.error(ERROR.NAN, { message, args })
    if (args[2] < 0) return this.error({ message: 'Cannot set a negative value' }, { message, args })

    try {
      await member.updateOne({ level: args[2] })
      this.success('Set level', 'Successfully set user level!', { message, args })
    } catch (e) {
      if (e) return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Set a user's reputation points
  async action_setreputation ({ member, args, message }) { //eslint-disable-line
    if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })

    if (isNaN(args[2])) return this.error({ message: 'Expected argument is not a number!' }, { message, args })
    if (args[2] < 0) return this.error({ message: 'Cannot set a negative value' }, { message, args })

    try {
      await member.updateOne({ reputation: args[2] })
      this.success('Set reputation', 'Successfuly set user reputation!', { message, args })
    } catch (e) {
      console.log(e)
      return this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }
  async action_togglepremium ({ member, args, message }) { //eslint-disable-line
    if (member.isPremium) {
      try {
        await member.updateOne({ isPremium: false })
        return this.success('Premium status', 'User is no longer premium', { message, args })
      } catch (e) {
        return this.error(ERROR.TRY_AGAIN, { message })
      }
    }
    try {
      await member.updateOne({ isPremium: true })
      return this.success('Premium status', 'User is now premium', { message, args })
    } catch (e) {
      return this.error(ERROR.TRY_AGAIN, { message })
    }
  }
  async action_setbackground ({ member, args, message }) { //eslint-disable-line
    try {
      const background = await Background.findOne({ name: args[2].toUpperCase() })
      if (!background) return this.error({ message: 'Background not found.' }, { message })
      await member.updateOne({ selectedBackground: args[2].toUpperCase() })
      this.success('Background updated', `Changed users background to ${args[2].toUpperCase()}`, { message })
    } catch (e) {
      return this.error(ERROR.TRY_AGAIN, { message })
    }
  }
}
