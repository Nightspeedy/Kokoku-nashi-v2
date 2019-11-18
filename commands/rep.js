const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { Member } = require('@lib/models')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'reputation',
      aliases: ['rep', 'giverep'],
      description: 'Send the bot invite URL via DM',
      type: TYPES.SOCIAL,
      args: '',
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, color, args }) {
    return message.reply("Broken, We're working towards fixing this command!")
    // Gift by mention
    let user = this.mention(args[0], message)
    if (typeof user !== 'object') return this.error(ERROR.MEMBER_NOT_FOUND, {message})

    // console.log(user.user.name)
    let member = await Member.findOne({id: message.author.id})
    if (!user && !args[0]) {
      if (member.repLastGiven + 86100000 > Date.now()) {

        let hours, minutes, seconds

        let totalSeconds = (member.repLastGiven + 86100000) - Date.now()

        totalSeconds = totalSeconds / 1000

        hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        minutes = Math.floor(totalSeconds / 60)
        seconds = Math.floor(totalSeconds % 60)

        return message.channel.send(`**Cooldown active.** You can use this command again in: ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`).catch(e => {})
      } else {
        return this.success("<:Enabled:524627369386967042>", "You can now give reputation points!", {message, args})
      }
    }
    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, {message,args})
    if (user.bot) return this.error({message: 'Bots dont have profiles!'}, {message, args})
    if (message.author.id == user.id) return this.error({message: 'You cannot give yourself reputation!'}, {message, args})

    let memberMention = await Member.findOne({id: user.id})
    console.log(memberMention)

    if (!memberMention) return this.error(ERROR.UNKNOWN_MEMBER, {message, args})

    if (member.repLastGiven + 86100000 > Date.now()) {

        let hours, minutes, seconds

        let totalSeconds = (member.repLastGiven + 86100000) - Date.now()

        totalSeconds = totalSeconds / 1000

        hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        minutes = Math.floor(totalSeconds / 60)
        seconds = Math.floor(totalSeconds % 60)

        return this.error({message: `Cooldown active. You can use this command again in: ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`}, {message,args})
    } else {
      try {

        let reputation = memberMention.reputation

        reputation += 1;
        await member.updateOne({repLastGiven: Date.now()})
        await memberMention.updateOne({reputation: reputation});

        const embed = new RichEmbed()
        .setTitle(message.author.username)
        .setColor(color)
        .addField("You repped someone! ", message.author.username + " added reputation to " + user.user.username)
        message.channel.send(embed).catch(e => {})

      } catch(e) {
        console.log(e)
        return this.error(ERROR.TRY_AGAIN, {message, args})
      }
    }
  }
}
