const { Guild, Member } = require('@lib/models')

module.exports = class levelSystem {

    constructor(bot) {

        this.minExp = 100
        this.premiumMultiplier = 2
        this.bot = bot
        this.cooldown = []
        
    }

    async run(message) {

        message.reply("Running levelstem")
        // Check if the user is already cooling down
        if(this.cooldown.indexOf(message.author.id)) return

        // Fetch the guild and member.
        let guild = await Guild.findOne({ id: message.guild.id })
        let member = await Member.findOne({ id: message.author.id })

        // Check if member is banned from the bot
        if (member.isBanned) return

        // Calculate required EXP and random EXP
        let reqExp = member.level * 200
        let randomExp = Math.floor(Math.random() * 10 + 1)

        if (guild.isPremium) randomExp = randomExp * 2

        // Level up system
        if (member.exp >= reqExp) this.levelUp(member)

        // Add a user to the cooldown if he's not already there
        try {

        this.startCooldown(message.author.id, message)
        } catch(e) {

            console.error(e)

        }
        // Add a random number of coins to user
        this.randomCoins(member, guild)


    }

    levelUp(member) {

        let newLevel = member.level + 1
        let newExp = 0
        
        return Member.update({ id: member.id, level: newLevel, exp: newexp })
    }

    randomCoins(member, guild) {

        
        let randomCoins = Math.floor(Math.random() * 25 + 1)
        let coinMultiplier = 1;
        if (guild.isPremium) coinMultiplier = 2

        randomCoins = randomCoins * coinMultiplier

        newCoins = member.coins + randomCoins

        return Member.update({})
    }

    startCooldown(id, message) {
        this.cooldown.push(String(id))

        console.log("Test 123")

        message.reply("Cooldown list:\n" + this.cooldown)
        setTimeout( () => {

            console.log("Setting timeout")
            this.cooldown.delete(String(id))
        }, 60000);
    }
}