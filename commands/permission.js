const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const { Permission } = require('@lib/models') // eslint-disable-line
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (bot) {
    super({
      name: 'permissions',
      aliases: ['perms'],
      description: 'Manage permissions, give a specific role access to a specific command.',
      type: TYPES.GUILD_OWNER,
      args: '{set, list} {role name/id} {permission} {true/false}',
      permissions: [PERMISSIONS.GUILD_OWNER]
    }) // Pass the appropriate command information to the base class.

    this.bot = bot
  }

  async set ({ message, args }) {
    let role = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
    if (!role) {
      return message.channel.send({
        embed: {
          color: 0xff0000,
          author: {
            name: 'Permissions',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
          },
          description: `I couldn't find the role "${args[2]}"`
        }
      })
    }

    let permName = Object.keys(PERMISSIONS).find(name => name === (args[2] || '').toUpperCase())
    if (!permName) {
      return message.channel.send({
        embed: {
          color: 0xff0000,
          author: {
            name: 'Permissions',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
          },
          description: `I couldn't find the permission "${args[2]}"`,
          fields: [{
            name: 'Available Permissions',
            value: Object.keys(PERMISSIONS).map(perm => `\`${perm}\``).join(' ')
          }]
        }
      })
    }

    let shouldAdd = args[3].toLowerCase() === 'true'
    let permission = await Permission.findOne({ guild: message.guild.id, role: role.id, granted: permName })

    if (shouldAdd) {
      !permission && await Permission.create({ guild: message.guild.id, role: role.id, granted: permName })
      return message.channel.send(`✅ ${role.name} has been given ${permName}`)
    } else {
      permission && await permission.remove()
      return message.channel.send(`✅ ${permName} has been revoked from ${role.name}`)
    }
  }

  // very basic, make prettier later
  async list ({ message, args }) {
    let fields = []

    let rules = await Permission.find({ guild: message.guild.id })

    if (args[1]) {
      let role = message.guild.roles.find(r => r.name === args[1])
      fields.push({
        name: role.name,
        value: rules.filter(rule => rule.role === role.id).map(rule => `\`${rule.granted}\``).join(' ')
      })
    } else {
      fields.push({
        name: 'Available Permissions',
        value: Object.keys(PERMISSIONS).map(perm => `\`${perm}\``).join(' ')
      })

      let roles = []
      rules.forEach(rule => {
        let role = message.guild.roles.find(r => r.id === rule.role) || { name: rule.id }
        roles.indexOf(role.name) === -1 && roles.push(role.name)
      })

      fields.push({
        name: 'Roles with custom rules',
        value: roles.map(role => `\`${role}\``).join(' ')
      })
    }

    return message.channel.send({
      embed: {
        color: this.color,
        author: {
          name: 'Permissions',
          icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
        },
        fields: fields
      }
    })
  }

  async run ({ message, args }) {
    if (!args[0]) return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    switch (args[0].toLowerCase()) {
      case 'set': await this.set({ message, args }); break
      case 'list': await this.list({ message, args }); break
      default: return this.error(ERROR.INVALID_ARGUMENTS, { message, args })
    }
  }
}
