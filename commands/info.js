const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { OWNERS } = require('@lib/consts')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'info',
      aliases: ['uptime', 'onlinetime', 'shardinfo', 'ping', 'pong'],
      description: 'Shows the shard\'s uptime!',
      type: TYPES.UTILITY,
      args: ''
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, color }) {
    let totalSeconds = Math.round(this.bot.uptime / 1000)

    let days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    let hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60

    let time = [
      days,
      hours,
      minutes,
      seconds
    ]
    let str = [
      'Days',
      'Hours',
      'Minutes',
      'Seconds'
    ]

    if (time[0] === 1) str[0] = 'Day'
    if (time[1] === 1) str[1] = 'Hour'
    if (time[2] === 1) str[2] = 'Minute'
    if (time[3] === 1) str[3] = 'Second'

    let onlineTime = `${time[0]} ${str[0]}, ${time[1]} ${str[1]}, ${time[2]} ${str[2]}, ${time[3]} ${str[3]}`
    let shard = '#' + this.bot.shard.id
    let owner = { username: 'unknown', discriminator: '0000' }
    try { owner = this.bot.users.get('365452203982323712') } catch (e) {}
    let developers = ''
    for (let i = 0; i < OWNERS.length; i++) {
      let user = { username: 'unknown', discriminator: '0000' }
      try { user = this.bot.users.get(OWNERS[i]) } catch (e) {}
      developers += `${user.username}#${user.discriminator}\n`
    }

    message.channel.send("Fetching information").then(sent =>{
      let embed = new RichEmbed()
      .setColor(color)
      .setTitle(`:information_source: Information about ${this.bot.user.username}`)
      .addField('Bot Owner', `${owner.username}#${owner.discriminator}`)
      .addField('Bot Developers', developers)
      .addField('Shard ID', shard)
      .addField('API latency', Math.round(this.bot.ping)+ 'ms' )
      .addField('Shard latency', `${sent.createdTimestamp - message.createdTimestamp}ms`)
      .addField('Shard uptime', onlineTime)

      sent.edit(embed);
    });
  }
}
