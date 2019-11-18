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

module.exports.LOG_EVENTS = [
  { event: 'channelCreate', title: '**Channel Created**', message: (channel) => `<#${channel.id}> was created.`, color: COLORS.green },
  { event: 'channelDelete', title: '**Channel Deleted**', message: (channel) => `<#${channel.id}> was removed.`, color: COLORS.red },
  { event: 'channelPinsUpdate', title: '**Message Pinned**', message: (channel) => `A message was pinned in <#${channel.id}>.`, color: COLORS.gray },
  {
    event: 'channelUpdate',
    title: '**Channel Updated**',
    message: (oldChannel, newChannel) => {
      const channelDiff = diff(oldChannel, newChannel)
      const changes = Object.keys(channelDiff).map(key => ({ name: `**${key}**`, value: `\`${oldChannel[key]}\` **->** \`${newChannel[key]}\`` }))
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
      description: `${user.tag} was banned.`,
      fields: [
        { name: '**Last Message**', value: `${(user.lastMessage || {}).content || 'No Message.'}\n\n[Open Message](${user.lastMessage.url})` }
      ],
      thumbnail: { url: user.avatarURL }
    }),
    color: COLORS.red
  },
  {
    event: 'guildBanRemove',
    title: '**Member Unbanned**',
    message: (_, user) => ({
      description: `${user.tag} was unbanned.`,
      thumbnail: { url: user.avatarURL }
    }),
    color: COLORS.yellow
  },
  {
    event: 'guildMemberAdd',
    title: '**Member Joined**',
    message: (_, user) => ({
      description: `${user.tag} joined the server.`,
      fields: [
        { name: '**Account Created At**', value: new Date(user.user.createdAt) },
        { name: '**ID**', value: new Date(user.id) }
      ],
      thumbnail: { url: user.user.avatarURL }
    }),
    color: COLORS.green
  },
  {
    event: 'guildMemberRemove',
    title: '**Member Left**',
    message: (_, user) => ({
      description: `${user.tag} left the server.`,
      thumbnail: { url: user.user.avatarURL }
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
      return { description: `${newMember.user.tag} was updated.`, fields: changes }
    },
    color: COLORS.gray
  },
  {
    event: 'messageUpdate',
    title: '**Message Edited**',
    message: (oldMessage, newMessage) => {
      if (oldMessage.content === newMessage.content) return { abort: true }
      return {
        description: '',
        fields: [
          {
            name: '**Previous Content**',
            value: oldMessage.content.replace(/@/g, '').replace(/\*/g, '\\*').replace(/~/g, '\\~')
          },
          {
            name: '**Content Diff**',
            value: diffChars(
              oldMessage.content.replace(/@/g, '').replace(/\*/g, '\\*').replace(/~/g, '\\~'),
              newMessage.content.replace(/@/g, '').replace(/\*/g, '\\*').replace(/~/g, '\\~')
            ).map(part => part.added ? `**${part.value}**` : part.removed ? `~~${part.value}~~` : part.value).join('')
          },
          {
            name: '**New Content**',
            value: newMessage.content.replace(/@/g, '').replace(/\*/g, '\\*').replace(/~/g, '\\~')
          },
          { name: '**Author**', value: `<@${newMessage.author.id}>` }
        ]
      }
    },
    color: COLORS.gray
  },
  {
    event: 'messageDelete',
    title: '**Message Deleted**',
    message: (message) => ({
      fields: [
        { name: '**Content**', value: message.content.replace(/@/g, '') },
        { name: '**Author**', value: `<@${message.author.id}>` }
      ]
    }),
    color: COLORS.gray
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
      image: `http://singlecolorimage.com/get/${role.hexColor.substr(1)}/400x25`
    }),
    color: COLORS.green
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
      if (memberDiff.length === 1 && Object.keys(memberDiff)[0] === 'position') return { abort: true }
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
