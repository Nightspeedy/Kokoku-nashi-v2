const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { Member } = require('@lib/models')

module.exports = class extends Command {
    constructor (bot) {
        super({
        name: 'user',
        description: 'Change user variables (levels/reputation/exp and much more)',
        type: TYPES.BOT_OWNER,
        args: '{@mention} {variable} [new value]'
        }) // Pass the appropriate command information to the base class.

        this.fetch.guild = true

    }

    async run ({ message, args, guild, color }) {

        // Error checking
        let member = message.mentions.users.first()
        if (!member) return this.error(ERROR.MEMBER_NOT_FOUND, {message, args})

        let user = await Member.findOne({id: member.id})
        if (!user) return this.error(ERROR.UNKNOWN_MEMBER, {message, args})
        switch(args[1].toLowerCase()) {
            case 'reset':
                this.resetProfile(member, user, message)
            break
            case 'add-credits':
                this.addCredits(user, args, message)
            break
            case 'remove-credits':
                this.removeCredits(user, args, message)
            break
            case 'add-reputation':
                this.addReputation(user, args, message)
            break
            case 'remove-reputation':
                this.removeReputation(user, args, message)
            break
            case 'add-levels':
                this.addLevels(user, args, message)
            break
            case 'remove-levels':
                this.removeLevels(user, args, message)
            break
            case 'set-level':
                this.setLevel(user, args, message)
            break
            case 'set-reputation':
                this.setReputation(user, args, message)
            break
            // TODO: Add cases to change a user's description and title
        }

    }

    // Reset a user profile
    async resetProfile(member, user, message) {
        let userID = user.id
        await user.remove()
        await Member.create({id: userID})
        user = await Member.findOne({id: userID})
        if(!user){
            return this.error({message: 'Couldn\'t create new profile'}, {message, args})
        } else {
            this.success("Profile has been reset", "Successfully reset user profile", {message})
        }
    }

    // Add credits to a user
    async addCredits(user, args, message) {

        // TODO: Replace later with cryptocoin stuff
        return message.reply("Don't use this. cryptocoins are comming")
    }    

    // Remove credits from a user
    async removeCredits(user, args, message) {

        // TODO: Replace later with cryptocoin stuff
        return message.reply("Don't use this. cryptocoins are comming")
    }

    // Add reputation points to a user
    async addReputation(user, args, message) {

        if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})
        let repToAdd = parseInt(args[2])
        if (isNaN(repToAdd)) return this.error({message: 'Expected argument is not a number!'}, {message, args})
        let newReputation = user.reputation + repToAdd

        try {
            await user.updateOne({reputation: newReputation})
            this.success("Added reputation", `Successfully added reputation points to user!`, {message, args})
        } catch(e) {
            if(e) return this.error(ERROR.TRY_AGAIN, {message, args})
        }
    }

    // Remove reputation points from a user
    async removeReputation(user, args, message) {

        if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})
        let repToRemove = parseInt(args[2])
        if (isNaN(repToRemove)) return this.error({message: 'Expected argument is not a number!'}, {message, args})
        let newReputation = user.reputation - repToRemove

        if (newReputation < 0) newReputation = 0
        try {
            await user.updateOne({reputation: newReputation})
            this.success("Removed reputation", `Successfully removed reputation points from user!`, {message, args})
        } catch(e) {
            if(e) return this.error(ERROR.TRY_AGAIN, {message, args})
        }
    }
    
    // Add levels to a user
    async addLevels(user, args, message) {

        if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})
        let levelsToAdd = parseInt(args[2])
        if (isNaN(levelsToAdd)) return this.error({message: 'Expected argument is not a number!'}, {message, args})
        let newLevel = user.level + levelsToAdd

        try {
            await user.updateOne({level: newLevel})
            this.success("Added levels", `Successfully added levels to user!`, {message, args})
        } catch(e) {
            if(e) return this.error(ERROR.TRY_AGAIN, {message, args})
        }
    }

    // Remove levels from a user
    async removeLevels(user, args, message) {

        if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})
        let levelsToRemove = parseInt(args[2])
        if (isNaN(levelsToRemove)) return this.error({message: 'Expected argument is not a number!'}, {message, args})
        let newLevel = user.level - levelsToRemove

        if (newLevel < 0) newLevel = 0
        try {
            await user.updateOne({level: newLevel})
            this.success("Removed levels", `Successfully removed levels from user!`, {message, args})
        } catch(e) {
            if(e) return this.error(ERROR.TRY_AGAIN, {message, args})
        }
    }

    // Set a a user's level
    async setLevel(user, args, message) {

        if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})

        if (isNaN(args[2])) return this.error({message: 'Expected argument is not a number!'}, {message, args})
        if (args[2] < 0) return this.error({message: 'Cannot set a negative value'}, {message, args})

        try {
            await user.updateOne({level: args[2]})
        } catch(e) {
            console.log(e)
            if(e) return this.error(ERROR.TRY_AGAIN, {message, args})
        }

    }

    // Set a user's reputation points
    async setReputation(user, args, message) {

        if (!args[2]) return this.error(ERROR.INVALID_ARGUMENTS, {message, args})

        if (isNaN(args[2])) return this.error({message: 'Expected argument is not a number!'}, {message, args})
        if (args[2] < 0) return this.error({message: 'Cannot set a negative value'}, {message, args})

        try {
            await user.updateOne({reputation: args[2]})
        } catch(e) {
            console.log(e)
            if(e) return this.error(ERROR.TRY_AGAIN, {message, args})
        }

    }
}
