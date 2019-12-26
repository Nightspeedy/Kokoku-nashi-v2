module.exports.PERMISSION_DENIED = { message: 'You do not have permission to excecute this command!' }
module.exports.INVALID_CHANNEL = { message: 'This channel does not exist!' }
module.exports.WELCOME_CHANNEL_INVALID = { message: 'Welcome message channel does not exist! ' }
module.exports.INVALID_ARGUMENTS = { run: 'k!help {name}' }
module.exports.UNKNOWN_COMMAND = { message: 'Unknown command!' }
module.exports.NO_PERMISSION = { message: 'Do i have the correct permissions to do this?' }
module.exports.UNKNOWN_MEMBER = { message: 'This member does not have a profile!' }
module.exports.MEMBER_NOT_FOUND = { message: 'I could not find this person!' }
module.exports.TRY_AGAIN = { message: 'Something went wrong! Please try again. If this error keeps happening, visit our support server' }
module.exports.NEEDS_PREMIUM = { message: 'This feature requires premium!' }
module.exports.BOT_NO_PERMISSION = { message: 'I don\'t have permission to do this!' }
module.exports.ROLE_NOT_FOUND = { message: 'This role does not exist!' }
module.exports.INSUFFICIENT_FUNDS = { message: 'You don\'t have the funds to do this!' }
module.exports.NOT_IN_VC = { message: 'You must be in a voice channel to use that command!'}
module.exports.BOT_NOT_IN_VC = { message: 'I must be in a voice channel before you can use that command!'}

const getHMS = (date) => {
  const distance = date - Date.now()
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return {
    hours,
    minutes,
    seconds,
    toString: () => {
      return `Hours: ${hours} Minutes:${minutes} Seconds:${seconds}`
    }
  }
}

module.exports.TIMEOUT = (date) => ({ message: `You can't do that yet! Time remaining: ${getHMS(date).toString()}` })

module.exports.OTHER = {
  message: 'Unknown error! It has been sent to my developers for further investigation!',
  function: ({ message, args }) => { console.error(`Error when running "${message.content}"`) }
}
