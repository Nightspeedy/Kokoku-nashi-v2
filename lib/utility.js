module.exports = class Utils {
  constructor (bot) {
    this.bot = bot
  }

  async asyncFilter (arr, callback) {
    const fail = Symbol('')
    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
  }

  async mutuals (user) {
    // HACK: Only works for one shard
    const shared = []
    for (const guild of this.bot.guilds) {
      const foundMember = await guild[1].fetchMember(user.id, false).catch(e => {})
      if (foundMember) {
        shared.push(guild[1])
      }
    }
    return shared
  }
}
