const Command = require('@lib/command')
const TYPES = require('@lib/types')
const { RichEmbed } = require('discord.js')
const { OWNERS } = require('@lib/consts')
const { Member } = require('@lib/models')
const version = require('../package.json').version

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'info',
      aliases: ['uptime', 'onlinetime', 'shardinfo', 'ping', 'pong'],
      description: 'Shows the shard\'s uptime!',
      type: TYPES.UTILITY,
      args: '[@mention]'
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, color }) {
    let totalSeconds = Math.round(this.bot.uptime / 1000)

    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const time = [
      days,
      hours,
      minutes,
      seconds
    ]
    const str = [
      'Days',
      'Hours',
      'Minutes',
      'Seconds'
    ]

    if (time[0] === 1) str[0] = 'Day'
    if (time[1] === 1) str[1] = 'Hour'
    if (time[2] === 1) str[2] = 'Minute'
    if (time[3] === 1) str[3] = 'Second'

    const onlineTime = `${time[0]} ${str[0]}, ${time[1]} ${str[1]}, ${time[2]} ${str[2]}, ${time[3]} ${str[3]}`
    const shard = '#' + this.bot.shard.id
    let owner = { username: 'unknown', discriminator: '0000' }
    const totalUsers = await Member.countDocuments({})
    try { owner = this.bot.users.get('365452203982323712') } catch (e) {}
    let developers = ''
    for (let i = 0; i < OWNERS.length; i++) {
      let user = { username: 'unknown', discriminator: '0000' }
      try { user = this.bot.users.get(OWNERS[i]) } catch (e) {}
      developers += `${user.username}#${user.discriminator}\n`
    }

    message.channel.send('Fetching information').then(sent => {
      const embed = new RichEmbed()
        .setColor(color)
        .setTitle(`:information_source: Information about ${this.bot.user.username}`)
        .addField('Bot Owner', `${owner.username}#${owner.discriminator}`)
        .addField('Bot Developers', developers)
        .addField('Bot Version', `Version ${version}`)
        .addField('Shard ID', shard)
        .addField('Shard Guilds', `In ${this.bot.guilds.size} Guilds`)
        .addField('Total Guilds', `In ${this.bot.guilds.size} Guilds.`)
        .addField('Total users in Database', `Total users ${totalUsers}`)
        .addField('API latency', Math.round(this.bot.ping) + 'ms')
        .addField('Shard latency', `${sent.createdTimestamp - message.createdTimestamp}ms`)
        .addField('Shard uptime', onlineTime)

      sent.edit(embed)
    }).catch(e => {})
  }
}
