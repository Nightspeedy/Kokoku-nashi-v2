const mongoose = require('mongoose')

module.exports = class DatabaseConnection {
  constructor (bot, config = {}) {
    console.log(`Shard #${bot.shard.id}: Initizlizing database connection...`)

    mongoose.connect(`mongodb://${config.address || process.env.KOKO_DB_ADDRESS}`, {
      auth: { authSource: config.source || process.env.KOKO_DB_AUTH_SOURCE },
      user: config.user || process.env.KOKO_DB_USER,
      pass: config.pass || process.env.KOKO_DB_PASS,
      useNewUrlParser: true
    })
  }
}
