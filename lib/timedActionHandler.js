const { TimedAction, Subscription } = require('@lib/models')

module.exports = class TimedActionHandler {
  constructor (main, shardID, intervalTime = 2500) {
    if (intervalTime < 250) throw new Error('Too fast.')
    this.bot = main.bot
    this.shardID = shardID
    this.intervalTime = intervalTime
    this.interval = this.start()
    this.orbt = main.bot.ORBT
  }

  start () {
    clearInterval(this.interval)
    return setInterval(this.check.bind(this), this.intervalTime)
  }

  async push (type, offset, action) {
    if (!this[`action_${type}`]) throw new Error('Unknown action type.')

    const time = Date.now() + offset

    const timedAction = await TimedAction.create({
      shard: this.shardID,
      type,
      action,
      time
    })

    return timedAction
  }

  async action_sendMessage (action) { // eslint-disable-line
    const channel = this.bot.channels.get(action.channel)
    if (channel) { await channel.send(action.content) }
  }

  async action_sendDM (action) { // eslint-disable-line
    const user = this.bot.users.get(action.userID)
    if (user) { await user.send(action.content) }
  }

  async action_deleteMessage (action) { // eslint-disable-line
    const channel = this.bot.channels.get(action.channel)
    const message = channel.fetchMessage(action.message)
    await message.delete()
  }

  async action_addRoles (action) { // eslint-disable-line
    const guild = this.bot.guilds.get(action.guild)
    const member = guild.members.get(action.guild) || await guild.fetchMember(action.member)
    await member.addRoles(action.roles)
  }

  async action_removeRoles (action) { // eslint-disable-line
    const guild = this.bot.guilds.get(action.guild)
    const member = guild.members.get(action.guild) || await guild.fetchMember(action.member)
    await member.removeRoles(action.roles)
  }

  // TODO: finish and push
  // async action_renewPremium (action) { // eslint-disable-line
  //   const guild = this.bot.guilds.get(action.guild)
  //   const member = guild.members.get(guild.owner.user.id) || await guild.fetchMember(action.member)

  //   const subscription = Subscription.findOne({ id: member.user.id })

  //   if (subscription.autoRenew) {
  //     try {
  //       var subCost = subscription.price
  //       var userWallet = subscription.type === 'member' ? this.orbt.wallet(member.user.id) : this.orbt.wallet(guild.owner.user.id)

  //       if (userWallet.value < subCost) {
  //         await subscription.deleteOne()
  //         return member.user.send(`Your subscription type \`${subscription.type === 'member' ? 'Member' : 'Server'}\` was cancelled because you have insufficient funds!`)
  //       } else {
  //         // TODO: automatically renew subscription
  //       }
  //     } catch (e) {
  //       member.send('Something went wrong when processing your subscription renewal')
  //       // TODO: Send a message to the subscription owner
  //     }
  //   }
  // }

  async check () {
    const query = { time: { $lt: Date.now() }, shard: this.shardID }
    const actionQueue = await TimedAction.find(query)
    for (const index in actionQueue) {
      const action = actionQueue[index]
      try {
        await this[`action_${action.type}`] && this[`action_${action.type}`](action.action)
      } catch (e) { console.warn(`Failed to process id_${action._id},type_${action.type}\naction: ${JSON.stringify(action.action)}\nerror: ${e.message}`) }
    }

    await TimedAction.deleteOne(query)
  }

  stop () { clearInterval(this.interval) }
}
