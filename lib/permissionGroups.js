const Permissions = require('./permissions')

module.exports.ALL = Object.keys(Permissions).map(key => Permissions[key])
module.exports.MOD = [Permissions.BAN, Permissions.KICK]
module.exports.ADMIN = [Permissions.BAN, Permissions.KICK, Permissions.PURGE, Permissions.AUTOROLES, Permissions.SETTINGS, Permissions.COUNTING]
