const fs = require("fs")
const path = require("path")
const Discord = require('discord.js')

// TODO: Document and clean

module.export = class CommandHandler {
  constructor() {
    this.commands = new Discord.Collection()
  }
  
  async install(dir, DB) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if(err) { reject(err); return }
        const jsfiles = files.filter(f => f.split('.').pop() === 'js')
        const commands = jsfiles.map(jsfile => return new (require(path.join(dir,path)))())
        commands.forEach(command => command.init(DB))
        commands.forEach(command => this.commands.set(command.name, command))
        resolve(this)
      })
    })
  }
  
  async listen() {
    // TODO: Command listener code here
  }
}
