const { TimedAction } = require('@lib/models')

module.exports = class TimedActionHandler {
  constructor (bot, shardID, intervalTime = 2500) {
    if (intervalTime < 250) throw new Error('Too fast.')
    this.bot = bot
    this.shardID = shardID
    this.intervalTime = intervalTime
    this.interval = this.start()
  }

  start () {
    clearInterval(this.interval)
    return setInterval(this.check, this.intervalTime)
  }

  async handle_addRoles (action) { // eslint-disable-line
    const guild = this.bot.bot.guilds.get(action.guild)
    const member = guild.members.get(action.guild) || await guild.fetchMember(action.member)
    await member.addRoles(action.roles)
  }

  async handle_removeRoles (action) { // eslint-disable-line
    const guild = this.bot.bot.guilds.get(action.guild)
    const member = guild.members.get(action.guild) || await guild.fetchMember(action.member)
    await member.removeRoles(action.roles)
  }

  async check () {
    const query = { time: { $lt: Date.now() }, shard: this.shardID }
    const actionQueue = await TimedAction.find(query)
    for (const index in actionQueue) {
      const action = actionQueue[index]
      try {
        await this[`handle_${action.type}`] && this[`handle${action.type}`](action.action)
      } catch (e) { console.warn(`Failed to process action_${action._id},type_${action.type}\naction: ${JSON.stringify(action.action)}\nerror: ${e.message}`) }
    }

    await TimedAction.remove(query)
  }

  stop () { clearInterval(this.interval) }
}
