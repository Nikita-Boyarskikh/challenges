module.exports = function (input) {
  const GSPMP7Regexp = /^[A-Z]{2,8}-\d{2,8}\/(?:[A-Z]+-?)*[A-Z]+\/(?:([A-Z])(?!\1))+:\{(.*)\}$/;
  return input
    .map(message => GSPMP7Regexp.exec(message))
    .filter(Boolean)
    .map(([message, _, comment]) => {
      return message.replace(comment, comment.replace(/@(.*?)@/g, "<pirate>$1</pirate>"));
    });
}
