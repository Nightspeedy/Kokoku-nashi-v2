console.log("Startup command received. Starting bot.");
const config = require("./config.json");
const { ShardingManager } = require("discord.js");
const manager = new ShardingManager('./bot.js', { token: config.token});

console.log("Deploying shards...")
manager.spawn();
manager.on('launch', shard =>{

    console.log(`Shard #${shard.id}: spawned!`);

});
