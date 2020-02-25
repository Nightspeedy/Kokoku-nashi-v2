const Command = require('@lib/command')
const TYPES = require('@lib/types')
const child_process = require('child_process') //eslint-disable-line

module.exports = class extends Command {
  constructor () {
    super({
      name: 'update',
      description: 'Pulls the latest version from GitHub and starts update sequence',
      type: TYPES.BOT_OWNER
    })
  }

  async run ({ message, args }) {
    var msg
    this.update(message, msg, 1)
  }

  async update (message, msg, step) {
    var childProcess, currentAction, upToDate
    upToDate = false
    try {
      switch (step) {
        case 1:
          currentAction = 'Checking for updates, and pulling latest version...'
          msg = await message.channel.send(currentAction)
          childProcess = await child_process.spawn('git', ['pull'])
          break
        case 2:
          currentAction = 'Installing dependencies...'
          msg = await message.channel.send(currentAction)
          childProcess = await child_process.spawn('npm', ['install'])
          break
        case 3:
          message.channel.send('Update complete, rebooting...')
          // child = await child_process.spawn('pm2', ['restart', 'Kokoku Nashi'])
          break
        default:
          return
      }
      childProcess.stdout.on('data', data => {
        if (data.toString().trim() === 'Already up to date.') {
          upToDate = true
        }
      })
      childProcess.stderr.on('data', data => {
        message.channel.send(data.toString().trim())
      })
      childProcess.on('close', async (code) => {
        if (code !== 0) {
          msg.edit('Process exited with non-zero exit code')
        } else {
          if (upToDate) return msg.edit('Already up to date!')
          msg.edit(`${currentAction} Done!`)
          this.update(message, msg, step + 1)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
