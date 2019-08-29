require('module-alias/register') // allows for require path aliases

const Main = require('./main.js')
const Discord = new Main()

Discord.bot.on('ready', () => {
  console.log(`Shard #${Discord.bot.shard.id}: logged in!`)
})
