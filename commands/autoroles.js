
const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { RichEmbed } = require('discord.js')
const { AutoRoles } = require('@lib/models')

module.exports = class extends Command {
    constructor (bot) {
        super({
        name: 'autoroles',
        description: "Set the server's auto roles",
        type: TYPES.UTILITY,
        args: '{add/remove/list} [role ID]',
        permissions: [PERMISSIONS.MANAGE_AUTOROLES]
        }) // Pass the appropriate command information to the base class.

        // Fetch the guild object
        this.fetch.guild = true

        this.bot = bot
    }

    async run ({ message, args, guild }) {

        switch (args[0].toLowerCase()) {

            case 'add':
                this.add(message, guild, args)
                break
            case 'remove':
                this.remove(message, guild, args)
                break
            case 'list':
                message.channel.send("We're working on this! If you see this message, we will release a smaller update on Monday july 1st")
                
            default:
                this.error(ERROR.INVALID_ARGUMENTS, {message,args})
                break
        }
    }
    // Add a role
    async add(message, guild, args) {
        let roleToAdd = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])

        if (!roleToAdd) return this.error(ERROR.ROLE_NOT_FOUND, {message,args})

        let role = await AutoRoles.findOne({guild: guild.id, role: roleToAdd.id})

        let totalRoles = (await AutoRoles.find({ guild: member.guild.id })).map(val => val.role)
        if (totalRoles.length >= 1 && !guild.isPremium) return this.error({message: 'To add more then 1 autorole, Please upgrade to Premium.'})

        try {
            if (!role) {
                AutoRoles.create({guild: guild.id, role: roleToAdd.id})
                this.success('Updated Autoroles!', 'The role has successfully been added!', {message, args})
            } else {
                return this.error({message: 'This role is already in the list!'}, {message, args})
            }

        } catch(e) {
            this.error(ERROR.TRY_AGAIN, {message, args})
        }
    }
    // Remove a role
    async remove(message, guild, args) {
        let roleToRemove = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
        if (!roleToRemove) return this.error(ERROR.ROLE_NOT_FOUND, {message,args})
        let role = await AutoRoles.findOne({guild: guild.id, role: roleToRemove.id})
        if (!role) return this.error({message: 'Can\'t remove a role which is not in the list!'}, {message, args})

        try {
            await AutoRoles.deleteOne({guild: guild.id, role: roleToRemove.id})
            this.success('Updated Autoroles!', 'The role has successfully been removed!', {message,args})
        } catch(e) {
            this.error(ERROR.TRY_AGAIN, {message, args})
        }
    }
}
