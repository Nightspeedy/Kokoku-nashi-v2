const Command = require('@lib/command')
const TYPES = require('@lib/types')
// const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')
const Akinator = require('aki-api')
var collector
module.exports = class extends Command {
  constructor () {
    super({
      name: 'akinator',
      aliases: ['aki'],
      description: 'Let Akinator guess the character you have in mind!',
      args: '',
      type: TYPES.GAMES
    })

    this.startMessages = [
      'Fun! Let\'s start the guessing game!',
      'I bet I can guess who the character is that you are thinking of!',
      'I won\'t be beaten easily!',
      'I love playing this with you! Let\'s start!'
    ]
    this.winMessages = [
      'I won again! Thank you for playing! This was fun!',
      'I won! This was fun. Let\'s play again!',
      'Unbelievable, I\'m still not beaten!',
      'The game is over, and i won once again!'
    ]
    this.loseMessages = [
      'Outrageous! I lost!',
      'You won against me? Good job!',
      'Seems like I\'m a bit rusty, Congratulations!',
      'You did it! You beat Akinator!'
    ]
  }

  async run ({ message, args, color }) {
    let region = 'en'
    let data = await Akinator.start(region)
    if (!data) {
      region = 'en2'
      data = await Akinator.start(region)
    }
    await message.channel.send(`**Akinator:** ${this.startMessages[Math.floor(Math.random() * this.startMessages.length)]}`)
    await this.guess(data, message, data.session, region, 1, data.signature)
  }

  async guess (data, message, session, region, step, signature) {
    if (data.progress) {
      if (data.progress > 80) {
        return this.win(data, message, session, region, signature)
      }
    }

    const embed = new RichEmbed()
      .setTitle('Akinator')
      .setDescription(`**Q${step}:** ${data.question ? data.question : data.nextQuestion}`)
      .setFooter('Possible answers are: Yes, No, Don\'t know, Probably, Probably not.')
    await message.channel.send(embed)

    function filter (m) {
      return m.author.id === message.author.id && data.answers.map(answer => answer.toLowerCase()).includes(m.content.toLowerCase())
    }

    collector = await message.channel.createMessageCollector(filter, { time: 60000, maxMatches: 1 })

    collector.on('collect', collected => {
      const answerId = data.answers.map(answer => answer.toLowerCase()).indexOf(collected.content.toLowerCase())

      Akinator.step(region, session, signature, answerId, data.nextStep || 0)
        .then(nextInfo => this.guess(nextInfo, collected, session, region, step + 1, signature))
    })

    collector.on('end', reason => {
      if (reason === 'time') {
        message.channel.send('**Akinator:** Game ended, you did not respond within 60 seconds')
      }
    })
  }

  async win (data, message, session, region, signature) {
    const win = await Akinator.win(region, session, signature, data.nextStep)
    const embed = new RichEmbed()
      .setTitle(win.answers[0].name)
      .setImage(win.answers[0].absolute_picture_path)
      .setDescription('Is this correct?')
      .setFooter('Possible answers: "Yes" or "No"')

    await message.channel.send('I think I got it!', { embed })

    function filter (m) {
      return m.author.id === message.author.id && ['yes', 'no'].includes(m.content.toLowerCase())
    }

    collector = await message.channel.createMessageCollector(filter, { time: 60000, maxMatches: 1 })

    collector.on('collect', collected => {
      switch (collected.content.toLowerCase()) {
        case 'yes':
          message.channel.send(`**Akinator:** ${this.winMessages[Math.floor(Math.random() * this.winMessages.length)]}`)
          break
        case 'no':
          message.channel.send(`**Akinator:** ${this.loseMessages[Math.floor(Math.random() * this.loseMessages.length)]}`)
          break
      }
    })

    collector.on('end', reason => {
      if (reason === 'time') message.channel.send('**Akinator:** Game ended, you did not respond within 60 seconds')
    })
  }
}
