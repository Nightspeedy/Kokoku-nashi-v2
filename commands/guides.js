const Command = require('@lib/command')
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { Guides } = require('@lib/models')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'guides',
      aliases: ['guide', 'howto'],
      description: 'Got some problems setting up? Read these guides, and get to know how to use my commands.',
      type: TYPES.UTILITY,
      args: '[guideName/list]'
    })
  }

  async run ({ message, args }) {
    if (!args[0] || args[0] === 'list') {
      const guides = (await Guides.find({}, { _id: 0, name: 1 })).map(guide => guide.name).join('\n')
      this.success('List of available guides', guides, { message })
    } else {
      const guide = await Guides.findOne({ name: args[0] })
      if (!guide) {
        return this.error(ERROR.INVALID_ARGUMENTS, { message })
      }
      await message.channel.send({
        embed: {
          color: 0x3A6AE9,
          title: `(Guide) ${guide.title}`,
          description: guide.content,
          image: { url: guide.imageUrl }
        }
      })
    }
  }
}
