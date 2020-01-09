const mongoose = require('mongoose')
const { Member } = require('@lib/models')

module.exports = (main) => async () => {
  try {
    global.datadog.timing('discord.api.latency', Math.round(main.bot.ping))

    const mdbPingStart = Date.now()
    mongoose.connection.db.admin().ping(function (err) {
      if (err) { console.warn(err) } else { global.datadog.timing('db.connection.latency', Date.now() - mdbPingStart) }
    })

    const mdbFindStart = Date.now()
    await Member.findOne({ id: '215143736114544640' })
    global.datadog.timing('db.findone.latency', Date.now() - mdbFindStart)
  } catch (e) {
    console.warn('Failed to log metrics.', e)
  }
}
