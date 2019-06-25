const { Guild } = require('@lib/models')

const handle = async (guild) => {
  let guildToAdd = await Guild.findOne({ id: guild.id })
  if (!guildToAdd) Guild.create({ id: guild.id })
}

module.exports = async (on) => {
  on('guildCreate', handle)
}
