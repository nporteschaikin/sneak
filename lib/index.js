var Lexer = require('./lexer')
  , Parser = require('./parser')
  , fs = require('fs')
  , path = require('path');

var Sneak = {

  render: function (str, basepath) {
    var parser = new Parser(str, basepath);
    return parser.parse();
  },

  renderFile: function (opts) {
    if (!opts) opts = {}
    if (!opts.encoding) opts.encoding = 'utf8';
    return Sneak.render(fs.readFileSync(opts.path, opts.encoding), path.dirname(opts.path));
  }

}

module.exports = Sneak;
