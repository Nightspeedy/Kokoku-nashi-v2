
const Command = require('@lib/command')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor (bot) {
        super({
            name: 'purge',
            description: "Purge a specific amount of messages (maximum 1000 messages)",
            type: "modCommand",
            args: "{Amount}"
        }) // Pass the appropriate command information to the base class.
        this.fetch.member = false // Fetch the Member object from DB on trigger.

        this.bot = bot
    }

    async run ({ message, args, color }) {
        
        let embed = new RichEmbed()
        .setColor(color)
        
        if (args[0]) {

            if (isNaN(args[0])) return ("I cant purge this...")
            
            let number = args[0] + 1

            embed.setTitle(message.author.tag)
            .setColor(color)
            
            if (number > 100) {

                await this.purgeLoop(number, message, true);

            } else {
                message.channel.bulkDelete(number).then(message.channel.send("Deleted messages").catch(err => {

                    message.channel.send("**ERROR!** I coulnd't delete messages, Do i have the MANAGE_MESSAGES permission?")

                }))
            }
        
        } else {
            return message.channel.send("Please tell me how many messages you want me to purge!")
        }
    }
    purgeLoop(number, message, loop) {
        if(!loop) return
        if (number > 100) message.channel.send("Deleting messages, this might take a while!")
    
        if (number < 1) return message.channel.send("Successfully deleted messages!").then(message.delete(), 10000)
        setTimeout( async () => {
            if (number > 100){
                const fetched = await message.channel.fetchMessages({limit: 100})
                console.log(fetched)
                try {
                    await message.channel.bulkDelete(100)
                } catch(e) {
                    console.error(err)
                    message.channel.send("**ERROR!** I coulnd't delete messages, Do i have the MANAGE_MESSAGES permission?")
                    loop = false
                }
                number -= 100
            } else {
                const fetched = await message.channel.fetchMessages({limit: number})
                console.log(fetched)
                try {
                    await message.channel.bulkDelete(100)
                } catch(e) {
                    console.error(err)
                    message.channel.send("**ERROR!** I coulnd't delete messages, Do i have the MANAGE_MESSAGES permission?")
                    loop = false
                }
                number = 0
            }
    
            this.purgeLoop(number, message, loop);
        }, 10000)
    }
}
