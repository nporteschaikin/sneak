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
    fs.readFile(filepath, encoding,
      function (err, str) {
        if (err) {
          callback(err);
        } else {
          callback(null, Sneak.render(str, path.dirname(filepath)));
        }
      }
    )
  }

}

module.exports = Sneak;
