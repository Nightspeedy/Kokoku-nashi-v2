const ArgumentsMatcher = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g
const StripQuotes =  /^"|"$|^'|'$|^```(\S*\n?)|```$/g
const ParseNumbers =  /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g

module.exports = (string) => {
  let split = string.match(ArgumentsMatcher);
  split = split ? split.map(s => s.replace(StripQuotes, '')) : []
  split = split ? split.map(s => isNaN(s) ?  s : 0-(-s)) : []
  return split;
}
