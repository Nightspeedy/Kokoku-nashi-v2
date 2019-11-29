const { diff } = require('deep-object-diff')
const { diffChars } = require('diff')

module.exports.OWNERS = ['365452203982323712', '215143736114544640', '270622806520102913']

const COLORS = {
  green: 0x32E554,
  orange: 0xE5A932,
  red: 0xD7422D,
  gray: 0x989DA6
}
module.exports.COLORS = COLORS

module.exports.SHOP_ITEMS = [
  {
    displayName: '1x Random Steam key',
    productName: 'steamkey',
    price: 5000
  }
]


module.exports.LOG_EVENTS = [
  { event: 'channelCreate', title: '**Channel Created**', message: (channel) => `<#${channel.id}> was created.`, color: COLORS.green },
  { event: 'channelDelete', title: '**Channel Deleted**', message: (channel) => `<#${channel.id}> was removed.`, color: COLORS.red },
  { event: 'channelPinsUpdate', title: '**Message Pinned**', message: (channel) => `A message was pinned in <#${channel.id}>.`, color: COLORS.gray },
  {
    event: 'channelUpdate',
    title: '**Channel Updated**',
    message: (oldChannel, newChannel) => {
      const channelDiff = diff(oldChannel, newChannel)
      try {
        delete channelDiff.position
      } catch (e) {}
      const changes = Object.keys(channelDiff).map(key => ({ name: `**${key}**`, value: `\`${oldChannel[key]}\` **->** \`${newChannel[key]}\`` }))
      if(changes.length === 0) return { abort: true }
      return { description: `<#${newChannel.id}> was updated.`, fields: changes }
    },
    color: COLORS.gray
  },
  { event: 'emojiCreate', title: '**Emoji Created**', message: (emoji) => ({ description: `Name: ${emoji.name}, ID: ${emoji.id}`, thumbnail: { url: emoji.url } }), color: COLORS.green },
  { event: 'emojiDelete', title: '**Emoji Deleted**', message: (emoji) => ({ description: `Name: ${emoji.name}, ID: ${emoji.id}`, thumbnail: { url: emoji.url } }), color: COLORS.red },
  { event: 'emojiUpdate', title: '**Emoji Updated**', message: (oldEmoji, emoji) => ({ description: `Name: ${oldEmoji.name} **->** ${emoji.name}, ID: ${emoji.id}`, thumbnail: { url: emoji.url } }), color: COLORS.gray },
  {
    event: 'guildBanAdd',
    title: '**Member Banned**',
    message: (guild, user) => ({
      author: {
        name: user.tag,
        icon_url: user.avatarURL
      },
      description: `${user.tag} was banned.`,
      fields: user.lastMessage ? [
        { name: '**Last Message**', value: `${(user.lastMessage || {}).content || 'No Message.'}\n\n[Open Message](${user.lastMessage.url})` }
      ] : []
    }),
    color: COLORS.red
  },
  {
    event: 'guildBanRemove',
    title: '**Member Unbanned**',
    message: (_, user) => ({
      author: {
        name: user.tag,
        icon_url: user.avatarURL
      },
      description: `${user.tag} was unbanned.`
    }),
    color: COLORS.yellow
  },
  {
    event: 'guildMemberAdd',
    title: '**Member Joined**',
    message: (_, user) => ({
      author: {
        name: user.tag,
        icon_url: user.avatarURL
      },
      description: `${user.tag} joined the server.`,
      fields: [
        { name: '**Account Created At**', value: new Date(user.user.createdAt) },
        { name: '**ID**', value: new Date(user.id) }
      ]
    }),
    color: COLORS.green
  },
  {
    event: 'guildMemberRemove',
    title: '**Member Left**',
    message: (_, user) => ({
      author: {
        name: user.tag,
        icon_url: user.avatarURL
      },
      description: `${user.tag} left the server.`
    }),
    color: COLORS.green
  },
  {
    event: 'guildMemberUpdate',
    title: '**Member Updated**',
    message: (oldMember, newMember) => {
      const memberDiff = diff(oldMember, newMember)
      const changes = Object.keys(memberDiff).map(key => {
        if (key === '_roles') {
          return {
            name: '**Roles**',
            value: `\`${oldMember[key].map(id => oldMember.guild.roles.get(id).name).join(' ')}\` **->** \`${newMember[key].map(id => newMember.guild.roles.get(id).name).join(' ')}\``
          }
        }
        return { name: `**${key}**`, value: `\`${oldMember[key]}\` **->** \`${newMember[key]}\`` }
      })
      return {
        author: {
          name: newMember.user.tag,
          icon_url: newMember.user.avatarURL
        },
        description: `${newMember.user.tag} was updated.`,
        fields: changes
      }
    },
    color: COLORS.gray
  },
  {
    event: 'messageUpdate',
    title: '**Message Edited**',
    message: (oldMessage, newMessage) => {
      if (oldMessage.content === newMessage.content) return { abort: true }
      return {
        description: `Message edited in <#${newMessage.channel.id}> by <@${newMessage.author.id}> [View Message](${newMessage.url})`,
        author: {
          name: newMessage.author.tag,
          icon_url: newMessage.author.avatarURL
        },
        fields: [
          {
            name: '**Changes**',
            value: diffChars(
              oldMessage.content.replace(/@/g, '\\@').replace(/\*/g, '\\*').replace(/~/g, '\\~').replace(/\_/g, '\\_').replace(/\`/g, '\\`'),
              newMessage.content.replace(/@/g, '\\@').replace(/\*/g, '\\*').replace(/~/g, '\\~').replace(/\_/g, '\\_').replace(/\`/g, '\\`')
            ).map(part => part.added ? ` **${part.value}** ` : part.removed ? ` ~~${part.value}~~ ` : part.value).join('')
          }
        ]
      }
    },
    color: COLORS.yellow
  },
  {
    event: 'messageDelete',
    title: '**Message Deleted**',
    message: (message) => ({
      author: {
        name: message.author.tag,
        icon_url: message.author.avatarURL
      },
      fields: [
        { name: '**Content**', value: message.content.replace(/@/g, '') },
        { name: '**Author**', value: `<@${message.author.id}>` }
      ]
    }),
    color: COLORS.red
  },
  {
    event: 'messageDeleteBulk',
    title: '**Multiple Messages Deleted**',
    message: (messages) => {
      const channels = []
      messages.array().forEach(message => {
        if (channels.indexOf(message.channel.id) === -1) channels.push(message.channel.id)
      })
      const members = []
      messages.array().forEach(message => {
        if (members.indexOf(message.author.id) === -1) members.push(message.author.id)
      })
      return {
        description: `${messages.array().length} messages deleted in ${channels.map(id => `<#${id}>`).join(', ')} sent by ${members.map(id => `<@${id}>`).join(', ')}`
      }
    },
    color: COLORS.red
  },
  {
    event: 'roleCreate',
    title: '**Role Created**',
    message: (role) => ({
      description: '',
      fields: [
        { name: 'Name', value: role.name },
        { name: 'Color', value: role.hexColor }
      ],
      image: `http://singlecolorimage.com/get/${role.hexColor.substr(1)}/400x25`,
      color: role.color
    })
  },
  {
    event: 'roleDelete',
    title: '**Role Deleted**',
    message: (role) => ({
      fields: [
        { name: '**Name**', value: role.name },
        { name: '**ID**', value: role.id }
      ]
    }),
    color: COLORS.red
  },
  {
    event: 'roleUpdate',
    title: '**Role Updated**',
    message: (oldRole, newRole) => {
      const memberDiff = diff(oldRole, newRole)

      try {
        delete memberDiff.position
      } catch (e) {}
      
      let image
      const changes = Object.keys(memberDiff).map(key => {
        if (key === 'color') {
          image = { url: `http://singlecolorimage.com/get/${newRole.hexColor.substr(1)}/200x25`, height: 25, width: 200 }
          return { name: `**${key}**`, value: `\`${oldRole.hexColor}\` **->** \`${newRole.hexColor}\`` }
        }
        return { name: `**${key}**`, value: `\`${oldRole[key]}\` **->** \`${newRole[key]}\`` }
      }).filter(field => field !== undefined)

      if (changes.length === 0) return { abort: true }

      return { description: `${newRole.name} was updated.`, fields: changes, image, color: newRole.color }
    }
  }

]
