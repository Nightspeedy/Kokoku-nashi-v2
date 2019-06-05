module.exports.PERMISSION_DENIED = { message: 'You do not have permission to excecute this command!' }
module.exports.INVALID_ARGUMENTS = { run: 'k!help {name}' }
module.exports.UNKNOWN_COMMAND = { message: 'Unknown command!' }
module.exports.NO_PERMISSION = { message: 'Do i have the correct permissions to do this?' }
module.exports.OTHER = {
  message: 'Unknown error! It has been sent to my developers for further investigation!',
  function: ({ message, args }) => { console.error(`Error when running "${message.content}"`) }
}
