module.exports.run = async(bot, message, args, members) => {

    message.reply("test");

    console.log(bot.commands);
    console.log(message);
    console.log(args);

}

module.exports.help = {
    name: "help",
    description: "The help command, you're using this dummy!"
}