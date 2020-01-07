const Event = require('@lib/event')
const { Guild, Member } = require('@lib/models')

const Pageres = require('pageres')
const pageres = new Pageres()

module.exports = class LevelSystem extends Event {
  constructor (main) {
    super({ event: 'message' })
    this.minExp = 100
    this.premiumMultiplier = 2
    this.bot = main.bot
    this.cooldown = new Set()

    this.trigger = this.trigger.bind(this)
  }

  async trigger (message) {
    if (!message.guild) return
    // Check if the user is already cooling down
    if (this.cooldown.has(message.author.id)) return

    // Fetch the guild and member.
    const guild = await Guild.findOne({ id: message.guild.id })
    const member = await Member.findOne({ id: message.author.id })

    if (!member || !guild) return

    // Check if member is banned from the bot
    if (member.isBanned) return

    const reqExp = member.level * 200

    // Add a random number of exp to user
    await this.randomExp(member, guild)

    // Level up system
    if (member.exp >= reqExp) return this.levelUp(member, message)

    // Add a user to the cooldown if he's not already there
    try {
      this.startCooldown(message.author.id, message)
    } catch (e) {
      console.error(e)
    }
  }

  async levelUp (member, message) {
    try {
      const newLevel = member.level + 1
      const newExp = 0

      // const queries = {
      //   avatar: message.author.avatarURL,
      //   level: newLevel,
      //   css: `html, body {
      //     background: #2f3136;
      //   }
      //   .avatar .blurShadow {
      //     filter: blur(10px) saturate(200%);
      //     transform: translateY(6px);
      //     opacity: 0.2;
      //   }
      //   .level .levelTitle {
      //     color: #eee;
      //   }
      //   .level .progress {
      //     background: #7289DA;
      //   }`
      // }

      // Encode the object above for the webserver to parse
      // const queryString = encodeURIComponent(Buffer.from(JSON.stringify(queries)).toString('base64'))

      // Capture an image of the generated webpage
      /* let shot = await Buffer.from((await pageres
        .src(`http://localhost:8080/level-up/card?data=${queryString}`, ['224x284'], { delay: 0.2, scale: 0.5 })
        .run())[0]) */

      // Send the generated image.
      // let image = new Attachment(shot, 'levelup.png')
      // await message.channel.send(`:sparkles: **${message.author.username} leveled up!** :sparkles:`, {
      //  files: [image]
      // })

      // Reset pageres, Dumb hack to prevent memory leaks
      pageres.items = []
      pageres.urls = []
      pageres._source = []
      pageres.sizes = ['224x284']
      pageres.stats = { urls: 0, sizes: 1, screenshots: 0 }

      // Set the new level.
      await member.updateOne({ id: member.id, level: newLevel, exp: newExp })
    } catch (err) {
      console.error(err)
    }
  }

  async randomExp (member, guild) {
    let randomExp = Math.floor(Math.random() * 25 + 1)
    let expMultiplier = 1
    if (guild.isPremium) expMultiplier = 2
    randomExp = randomExp * expMultiplier
    const newExp = member.exp + randomExp
    await member.updateOne({ exp: newExp })
  }

  startCooldown (id, message) {
    this.cooldown.add(id)

    setTimeout(() => {
      this.cooldown.delete(id)
    }, 60000)
  }
}
