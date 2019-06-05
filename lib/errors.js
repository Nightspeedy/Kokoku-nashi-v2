module.exports.PERMISSION_DENIED = new Error("You do not have permission to excecute this command!");
module.exports.INVALID_ARGUMENTS = new Error("Invalid arguments used! Use 'k!help [command]' for more information!");
module.exports.UNKNOWN_COMMAND = new Error("Unknown command!");
module.exports.NO_PERMISSION = new Error("Do i have the correct permissions to do this?");
module.exports.OTHER = new Error("Unknown error! It has been sent to my developers for further investigation!");