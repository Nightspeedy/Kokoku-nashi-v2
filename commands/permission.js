const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const PERMISSIONS = require('@lib/permissions')
const PERMISSION_GROUPS = require('@lib/permissionGroups')
const { Permission } = require('@lib/models') // eslint-disable-line
// const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'permissions',
      aliases: ['perms'],
      description: 'Manage permissions, give a specific role access to a specific command.',
      type: TYPES.GUILD_OWNER,
      args: '{set, list} {role name/id} {permission} {true/false}',
      permissions: [PERMISSIONS.GUILD_OWNER]
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

  async set ({ message, args }) {
    const role = message.guild.roles.find(role => role[typeof (args[1]) === 'number' ? 'id' : 'name'] === args[1])
    if (!role) {
      return message.channel.send({
        embed: {
          color: 0xff0000,
          author: {
            name: 'Permissions',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
          },
          description: `I couldn't find the role "${args[1]}"`
        }
      }).catch(e => {})
    }

    const permName = Object.keys(PERMISSIONS).find(name => name === (args[2] || '').toUpperCase())

    if (!permName) {
      const groupName = Object.keys(PERMISSION_GROUPS).find(name => name === (args[2] || '').toUpperCase())
      if (!groupName) {
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
        }).catch(e => {})
      }

      const group = PERMISSION_GROUPS[groupName]

      await Promise.all(group.map(async permName => {
        const shouldAdd = args[3].toLowerCase() === 'true'
        const permission = await Permission.findOne({ guild: message.guild.id, role: role.id, granted: permName })

        if (shouldAdd) {
          !permission && await Permission.create({ guild: message.guild.id, role: role.id, granted: permName })
        } else {
          permission && await permission.deleteOne()
        }
      }))

      return message.channel.send(`✅ ${role.name} has been given ${group.join(', ')}`).catch(e => { console.error(e) })
    } else {
      const shouldAdd = args[3].toLowerCase() === 'true'
      const permission = await Permission.findOne({ guild: message.guild.id, role: role.id, granted: permName })

      if (shouldAdd) {
        !permission && await Permission.create({ guild: message.guild.id, role: role.id, granted: permName })
        return message.channel.send(`✅ ${role.name} has been given ${permName}`).catch(e => {})
      } else {
        permission && await permission.deleteOne()
        return message.channel.send(`✅ ${permName} has been revoked from ${role.name}`).catch(e => {})
      }
    }
  }

  // TODO: Make this prettier, it's very basic
  async list ({ message, args }) {
    const fields = []

    const rules = await Permission.find({ guild: message.guild.id })

    if (args[1]) {
      const role = message.guild.roles.find(r => r.name === args[1])
      fields.push({
        name: role.name,
        value: rules.filter(rule => rule.role === role.id).map(rule => `\`${rule.granted}\``).join(' ')
      })
    } else {
      fields.push({
        name: 'Permission Groups',
        value: Object.keys(PERMISSION_GROUPS).map(group => `\`${group}\``).join(' ')
      })

      fields.push({
        name: 'Available Permissions',
        value: Object.keys(PERMISSIONS).map(perm => `\`${perm}\``).join(' ')
      })

      const roles = []
      rules.forEach(rule => {
        const role = message.guild.roles.find(r => r.id === rule.role) || { name: rule.id }
        roles.indexOf(role.name) === -1 && roles.push(role.name)
      })

      if (roles.length > 0) {
        fields.push({
          name: 'Roles with custom rules',
          value: roles.map(role => `\`${role}\``).join(' ')
        })
      }
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
    }).catch(e => { console.error(e) })
  }
}
