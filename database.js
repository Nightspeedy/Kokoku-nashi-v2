const Mongoose = require("mongoose");

module.exports = class Database {

    constructor(type, bot) {

        console.log(`Shard #${bot.shard.id}: Initizlizing database connection: ${type}`);
        // this.sequilize = new Sequelize('database', 'user', 'password', {
        //     host: 'localhost',
        //     dialect: 'sqlite',
        //     logging: false,
        //     operatorsAliases: false,
        //     // SQLite only
        //     storage: 'database.sqlite',
        // });

        if(type == "members") {
            this.db = this.setupMemberModel();
        }
        if(type == "guilds") {
            this.db = this.setupGuildModel();
        }
    }

    findOne(id){

        return id;

    }

    setupMemberModel() {

        // let members = this.sequelize.define('Members', {
        //     id: {
        //         type: Sequelize.STRING,
        //         unique: true,
        //         allowNull: false,
        //         primaryKey: true,
        //     },
        //     isBanned: {
        //         type: Sequelize.BOOLEAN,
        //         defaultValue: false,
        //         allowNull: false,
        //     },
        //     level: {
        //         type: Sequelize.INTEGER,
        //         defaultValue: 1,
        //         allowNull: false,
        //     },
        //     exp: {
        //         type: Sequelize.INTEGER,
        //         defaultValue: 0,
        //         allowNull: false,
        //     },
        //     reputation: {
        //         type: Sequelize.INTEGER,
        //         defaultValue: 0,
        //         allowNull: false,
        //     },
        //     credits: {
        //         type: Sequelize.INTEGER,
        //         defaultValue: 0,
        //         allowNull: false,
        //     },
        // });
        // return members;
    }

    setupGuildModel(){

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