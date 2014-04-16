var Lexer = require('./lexer')
  , Parser = require('./parser')
  , fs = require('fs');

var Sneak = {
  
  render: function (str) {
    var parser = new Parser(str);
    return parser.parse();
  },

  renderFile: function (path, encoding, callback) {
    fs.readFile(path, encoding,
      function (err, str) {
        if (err) {
          callback(err);
        } else {
          callback(null, Sneak.render(str));
        }
      }
    )
  }

}

module.exports = Sneak;
