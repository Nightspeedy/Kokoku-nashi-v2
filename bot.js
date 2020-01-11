require('module-alias/register') // allows for require path aliases

const Main = require('./main.js')
const Discord = new Main()

// Monitoring to DataDog
if (process.env.NODE_ENV === 'production') {
  const { StatsD } = require('node-dogstatsd')
  const dogstatsd = new StatsD()
  global.datadog = dogstatsd

  console.log('Logging set up.')

  const metrics = require('./metrics.js')
  setInterval(metrics(Discord), 3e4) // Log metrics every 30 seconds.
} else {
  // Blank functions as we don't want to
  // push actual stats while in development.
  global.datadog = {
    increment: () => {},
    incrementBy: () => {},
    decrement: () => {},
    decrementBy: () => {},
    timing: () => {},
    histogram: () => {}
  }
}

Discord.bot.on('ready', () => {
  console.log(`Shard #${Discord.bot.shard.id}: logged in!`)
})
