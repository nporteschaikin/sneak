var Lexer = require('./lexer')
  , Parser = require('./parser')
  , fs = require('fs')
  , path = require('path');

var Sneak = {

  render: function (str, options) {
    var parser = new Parser(str, options);
    return parser.parse();
  },

  renderFile: function (filepath, options) {
    if (!options) options = {}
    if (!options.basepath) options.basepath = path.dirname(filepath);
    if (!options.encoding) options.encoding = 'utf8';
    return Sneak.render(fs.readFileSync(filepath, options.encoding), options);
  }

}

module.exports = Sneak;
