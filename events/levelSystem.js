const Event = require('@lib/event')
const { Guild, Member } = require('@lib/models')

module.exports = class LevelSystem extends Event {
  constructor (bot) {
    super({ event: 'message' })
    this.minExp = 100
    this.premiumMultiplier = 2
    this.bot = bot
    this.cooldown = new Set()

    this.trigger = this.trigger.bind(this)
  }

  async trigger (message) {
    // Check if the user is already cooling down
    if (this.cooldown.has(message.author.id)) return

    // Fetch the guild and member.
    let guild = await Guild.findOne({ id: message.guild.id })
    let member = await Member.findOne({ id: message.author.id })

    if (!member || !guild) return

    // Check if member is banned from the bot
    if (member.isBanned) return

    let reqExp = member.level * 200

    // Level up system
    if (member.exp >= reqExp) return this.levelUp(member)

    // Add a user to the cooldown if he's not already there
    try {
      this.startCooldown(message.author.id, message)
    } catch (e) {
      console.error(e)
    }
    // Add a random number of exp to user
    this.randomExp(member, guild)
    // Add a random number of coins to user
    this.randomCredits(member, guild)
  }

  async levelUp (member) {
    let newLevel = member.level + 1
    let newExp = 0

    await member.updateOne({ id: member.id, level: newLevel, exp: newExp })
  }

  async randomCredits (member, guild) {
    let randomCredits = Math.floor(Math.random() * 25 + 1)
    let creditMultiplier = 1
    if (guild.isPremium) creditMultiplier = 2
    randomCredits = randomCredits * creditMultiplier
    let newCredits = member.credits + randomCredits
    await member.updateOne({ credits: newCredits })
  }

  async randomExp (member, guild) {
    let randomExp = Math.floor(Math.random() * 25 + 1)
    let expMultiplier = 1
    if (guild.isPremium) expMultiplier = 2
    randomExp = randomExp * expMultiplier
    let newExp = member.exp + randomExp
    await member.updateOne({ exp: newExp })
  }

  startCooldown (id, message) {
    this.cooldown.add(id)

    setTimeout(() => {
      this.cooldown.delete(id)
    }, 60000)
  }
}
