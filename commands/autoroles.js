
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
      type: TYPES.MOD_COMMAND,
      args: '{add/remove/list} [role ID]',
      permissions: [PERMISSIONS.AUTOROLES]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async run ({ message, args, guild }) {
    if (!this[`action_${args[0]}`]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    this[`action_${args[0]}`]({ message, guild, args })
  }

  async list ({ message }) {
    const totalRoles = (await AutoRoles.find({ guild: message.guild.id })).map(val => val.role)
    let roles = 'Listing current autoroles: \n'
    const embed = new RichEmbed().setTitle('Autoroles list')

    if (totalRoles.length <= 0) {
      roles += 'No autoroles are configured'
      embed.setDescription(roles)
      return message.channel.send(embed).catch(e => {})
    }

    totalRoles.forEach(role => {
      roles += `\n<@&${role}> with ID: ${role}`
    })
    embed.setDescription(roles)

    message.channel.send(embed).catch(e => {})
  }

  // Add a role
  async add ({ message, guild, args }) {
    const roleToAdd = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
    if (!roleToAdd) return this.error(ERROR.ROLE_NOT_FOUND, { message, args })
    const role = await AutoRoles.findOne({ guild: guild.id, role: roleToAdd.id })
    const totalRoles = (await AutoRoles.find({ guild: message.guild.id })).map(val => val.role)
    if (totalRoles.length >= 1 && !guild.isPremium) return this.error({ message: 'To add more then 1 autorole, Please upgrade to Premium.' })

    try {
      if (!role) {
        AutoRoles.create({ guild: guild.id, role: roleToAdd.id })
        this.success('Updated Autoroles!', 'The role has successfully been added!', { message, args })
      } else {
        return this.error({ message: 'This role is already in the list!' }, { message, args })
      }
    } catch (e) {
      this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }

  // Remove a role
  async remove ({ message, guild, args }) {
    const roleToRemove = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
    if (!roleToRemove) return this.error(ERROR.ROLE_NOT_FOUND, { message, args })
    const role = await AutoRoles.findOne({ guild: guild.id, role: roleToRemove.id })
    if (!role) return this.error({ message: 'Can\'t remove a role which is not in the list!' }, { message, args })

    try {
      await AutoRoles.deleteOne({ guild: guild.id, role: roleToRemove.id })
      this.success('Updated Autoroles!', 'The role has successfully been removed!', { message, args })
    } catch (e) {
      this.error(ERROR.TRY_AGAIN, { message, args })
    }
  }
}
