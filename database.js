const mongoose = require('mongoose')

module.exports = class Database {
  constructor (bot) {
    console.log(`Shard #${bot.shard.id}: Initizlizing database connection...`)

    mongoose.connect(`mongodb://${process.env.KOKO_DB_ADDRESS}`, {
      auth: { authSource: process.env.KOKO_DB_AUTH_SOURCE },
      user: process.env.KOKO_DB_USER,
      pass: process.env.KOKO_DB_PASS,
      useNewUrlParser: true
    })

    this.Member = this.setupMemberModel()
    this.Guild = this.setupGuildModel()
  }

  setupMemberModel () {
    return mongoose.model('members', {
      id: { type: Number, required: true },
      level: { type: Number, default: 0 },
      credits: { type: Number, default: 0 },
      reputation: { type: Number, default: 0 },
      exp: { type: Number, default: 0 },
      isBanned: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now() }
    })
  }

  setupGuildModel () {
    return mongoose.model('guilds', {
      id: { type: Number, required: true },
      logChannel: { type: String },
      enableLogfiles: { type: Boolean, default: false },
      welcomeMessage: { type: String, default: `Welcome {MEMBER} just joined!` },
      enableWelcomeMessage: { type: Boolean, default: false },
      leaveMessage: { type: String, default: `Bye {MEMBER} We're sad to see you go!` },
      enableLeaveMessage: { type: Boolean, default: false },
      banMessage: { type: String, default: `{MEMBER} has experienced the true power of the banhammer!` },
      enableBanMessage: { type: Boolean, default: false },
      isPremium: { type: Boolean, default: false }
    })
  }
}
