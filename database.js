const mongoose = require('mongoose')

module.exports = class Database {
  constructor (bot) {
    console.log(`Shard #${bot.shard.id}: Initizlizing database connection: ${type}`)
    // this.sequilize = new Sequelize('database', 'user', 'password', {
    //     host: 'localhost',
    //     dialect: 'sqlite',
    //     logging: false,
    //     operatorsAliases: false,
    //     // SQLite only
    //     storage: 'database.sqlite',
    // });

    this.models = {
      Member: this.setupMemberModel
    }
  }

  findOne (id) {
    return id
  }

  setupMemberModel () {
    return mongoose.model('members', {
      id: { type: Number, required: true },
      level: { type: Number, default: 0 },
      credits: { type: Number, default: 0 },
      reputation: { type: Number, default: 0 },
      exp: { type: Number, default: 0 },
      isBanned: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now() }
    })
  }

  setupGuildModel () {

    // let guilds = this.sequilize.define('guilds', {

    //     id: {
    //         type: Sequelize.STRING,
    //         unique: true,
    //         allowNull: false,
    //         primaryKey: true,
    //     },
    //     logChannel: {
    //         type: Sequelize.STRING,
    //         allowNull: true,
    //         defaultValue: "",
    //     },
    //     enableLogfiles: {
    //         type: Sequelize.BOOLEAN,
    //         allowNull: false,
    //         defaultValue: false,
    //     },
    //     welcomeMessage: {
    //         type: Sequelize.STRING,
    //         allowNull: false,
    //         defaultValue: `Welcome {MEMBER} just joined!`,
    //     },
    //     enableWelcomeMessage: {
    //         type: Sequelize.BOOLEAN,
    //         allowNull: false,
    //         defaultValue: false,
    //     },
    //     leaveMessage: {
    //         type: Sequelize.STRING,
    //         allowNull: false,
    //         defaultValue: `Bye {MEMBER} We're sad to see you go!`,
    //     },
    //     enableLeaveMessage: {
    //         type: Sequelize.BOOLEAN,
    //         allowNull: false,
    //         defaultValue: false,
    //     },
    //     banMessage: {
    //         type: Sequelize.STRING,
    //         allowNull: false,
    //         defaultValue: `{MEMBER} has experienced the true power of the banhammer!`,
    //     },
    //     enableBanMessage: {
    //         type: Sequelize.BOOLEAN,
    //         allowNull: false,
    //         defaultValue: false,
    //     },
    //     isPremium: {
    //         type: Sequelize.BOOLEAN,
    //         allowNull: false,
    //         defaultValue: false,
    //     }

    // });

    // return guilds;
  }
}
