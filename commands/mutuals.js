module.exports = class extends Command {
  constructor () {
    super({
      name: 'mutuals',
      description: 'Get a list of guilds you share with the bot.',
      type: TYPES.UTILITY,
      args: '',
      cooldownTime: 30
    })
  }

  async run ({ message }) {
    `this.guilds.filter(async guild=>await guild.fetchMember())`

    this.bot.shard.broadcastEval('')
  }
}
