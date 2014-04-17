var Lexer = require('./lexer')
  , Parser = require('./parser')
  , fs = require('fs')
  , path = require('path');

var Sneak = {

  render: function (str, basepath) {
    var parser = new Parser(str, basepath);
    return parser.parse();
  },

  renderFile: function (filepath, encoding, callback) {
    if (!encoding) encoding = 'utf8';
    return Sneak.render(fs.readFileSync(filepath, encoding), path.dirname(filepath));
  }

}

module.exports = Sneak;
