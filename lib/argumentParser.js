const ArgumentsMatcher = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|@.*#[0-9]{4}|\S+/g
const StripQuotes = /^"|"$|^'|'$|^```(\S*\n?)|```$/g

module.exports = (string) => {
  let split = string.match(ArgumentsMatcher)
  // split = split ? split.map(s => s.replace(StripQuotes, '')) : []
  // console.log(split)
  // split = split ? split.map(s => isNaN(s) ? s : 0 - (-s)) : []
  // console.log(split)
  return split
}