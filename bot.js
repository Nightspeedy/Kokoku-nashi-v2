const Main = require("./main.js");
const Discord = new Main();

Discord.bot.on("ready", () => {

    console.log(`Shard #${Discord.bot.shard.id}: logged in!`);

})

Discord.bot.on("message", message => {
    
    Discord.handleMessage(message);
    
});