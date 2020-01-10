const ArgumentsMatcher = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|@.*#[0-9]{4}|\S+/g
const StripQuotes = /^"|"$|^'|'$|^```(\S*\n?)|```$/g

const numberParser = (string, bot) => {
  try {
    const mention = bot.users.get(string) // Try fetching a user with the ID of string.
    if (mention || isNaN(string) || Number(string) > Number.MAX_SAFE_INTEGER) { return string }
    return Number(string)
  } catch (e) {
    console.error(e)
    return Number(string) // Somthing went wrong, return number.
  }
}

module.exports = (string, bot) => {
  let split = string.match(ArgumentsMatcher)
  split = split ? split.map(s => s.replace(StripQuotes, '')) : []
  split = split ? split.map(s => numberParser(s, bot)) : []
  return split
}
