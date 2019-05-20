const Discord = require("discord.js");
const fs = require("fs");
const db = require("./database.js");

module.exports = class Main {

    constructor(){

        this.bot = new Discord.Client({
            unknownCommandResponse: false
        });

        //Loading config file, or... Trying to...
        console.log(`Shard #${this.bot.shard.id}: Loading config file...`);
        this.config = require("./config.json");
        console.log(`Shard #${this.bot.shard.id}: Config file loaded!`);

        //Creating easy access variables
        this.token = this.config.token;
        this.prefix = this.config.prefix;

        //Setting up database
        this.members = new db("members", this.bot);
        this.guilds = new db("guilds", this.bot);

        //Setting up command files
        console.log(`Shard #${this.bot.shard.id}: Attempting to set up commands`);
        this.bot.commands = new Discord.Collection();
        this.setupCommandFiles();

        this.bot.login(this.token);
    }

    handleMessage(message){

        //Checking whether or not the code should continue to run
        if (message.author.bot) return;
        if (message.channel.type == "dm") return;

        //Splitting up command and arguments so they are easily usable and accessible
        const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
        const command = args.shift();

        if (message.content.startsWith(this.config.prefix) && !message.content.includes(`${this.config.prefix} `)) this.runCommand(command, message, args);
    }

    runCommand(command, message, args){

        //Trying to run the command
        try {

            console.log(`Shard #${this.bot.shard.id}: Received a command, checking if it's valid`);
            let commandFile = this.bot.commands.get(command);
            commandFile.run(this.bot, message, args, this.members);
            console.log(`Shard #${this.bot.shard.id}: Received valid command, running command file.`);

        //And if an error is catched, no such command exists.
        } catch (error) {

            console.log(`Shard #${this.bot.shard.id}: Received invalid command, returning.`);

            message.channel.send("**Error!** Unknown command!");
        }
    }

    setupCommandFiles(){

        fs.readdir("./commands/", (err, files) => {

            console.log(`Shard #${this.bot.shard.id}: Loading commands...`);
        
            if(err) console.log(err);
        
            let jsfile = files.filter(f => f.split(".").pop() === "js");
        
            if (jsfile.length <= 0) {
                
                throw new Error("CommandsNotFoundException: No command files have been found!");
            }
            
            files.forEach((f, i) => {
        
                let props = require(`./commands/${f}`);
        
                console.log(`Shard #${this.bot.shard.id}: Command ${f} Loaded!`);
                this.bot.commands.set(props.help.name, props);
        
            });
            console.log(`Shard #${this.bot.shard.id}: Commands loaded!`);
        });
    }
}