module.exports.run = async (bot, message, args, DB) => {
  // Added an example of using the DB
  message.reply(JSON.stringify(await DB.Member.findOne({ id: message.author.id })))

  console.log(bot.commands)
  console.log(message)
  console.log(args)
}

module.exports.help = {
  name: 'help',
  description: "The help command, you're using this dummy!"
}
